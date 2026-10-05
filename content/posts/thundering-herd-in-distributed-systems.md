---
title: "The Thundering Herd Problem in Distributed Systems"
brief: "Three ways a thundering herd shows up in production — retry storms, cache stampedes, and planned traffic spikes — and how the industry actually deals with each one."
publishedAt: "2026-10-05"
updatedAt: "2026-10-05"
tags:
  - system design
  - distributed systems
---

A thundering herd happens when a large number of clients or services wake up at nearly the same moment and all hit the same resource. The average load of the system may look fine. The instantaneous load does not. Gateways, caches, and databases that were healthy a second ago suddenly receive a burst they were never sized for.

The interesting part is that the burst is often caused by the system itself. A brief network flap, a rolling restart, a hot cache key expiring, or a known event on the calendar is enough. Once the first wave of timeouts starts, retries and reconnects feed the next wave. Wikipedia calls the extreme form of this *congestion collapse*: the system cannot recompute a value before requests time out, so the cache hit rate falls to zero and the miss loop never ends.

The same pattern shows up in at least three different shapes. They look unrelated until you notice they share one root: many independent actors making the same decision at the same time, with no randomness and no coordination.

# Retry and reconnect storms

When connections drop at scale — a flaky client network, a gateway restart, a redeploy — every client tries to come back. If the retry delay is fixed, or even exponential without jitter, they come back together. The reconnect is rarely cheap. It often re-authenticates, reloads session state, and resubscribes to channels, so the spike is not just TCP handshakes at the gateway. It lands on caches and databases behind it. Servers that are already recovering get slower, more clients time out, and those clients retry again.

Exponential backoff alone does not fix this. AWS showed that clients still cluster into synchronized retry waves. The backoff stretches the storm; it does not break it up.

## Jitter on the client

The standard client-side recipe is exponential backoff plus jitter: grow the wait between attempts, then randomize it so reconnects spread over time. AWS compared three variants:

- **Full jitter:** `sleep = random(0, min(cap, base * 2^attempt))`. This performed best in their tests.
- **Equal jitter:** `sleep = base/2 + random(0, base/2 * 2^attempt)`.
- **Decorrelated jitter:** `sleep = min(cap, random(0, 3 * last_sleep))`.

Marc Brooker’s argument is simple: randomness is a coordination protocol that does not need a coordinator. You also want a retry budget — stop auto-retrying after N attempts (WebSocket.org suggests something like 10–15 tries over about two minutes) and let the user reconnect on purpose. Infinite retry is how a short outage becomes a long one.

## Rate limits, draining, and shedding on the server

Clients cannot be the only line of defense. A large enough herd will still arrive as a spike.

**Connection rate limiting** at the gateway or load balancer (Nginx `limit_conn` / `limit_req`, Envoy local rate limits, or a shared Redis limiter across instances) is usually a token bucket or leaky bucket. Thresholds should come from load tests of real backend capacity, not a guess, with a soft limit that starts shedding low-priority connections and a hard limit that rejects the rest. Rejections should carry `Retry-After` with a little randomness — otherwise every rejected client comes back on the same tick.

**Staggered rollout and connection draining** stop the herd from being created in the first place. Restart a small batch of instances at a time, with soak time between batches. Before killing a process:

1. Mark the instance not-ready so the load balancer stops sending new users.
2. Ask open connections to leave cleanly. For WebSockets that means close code `1001` (Going Away). Clients should wait a random interval before reconnecting, so they do not all land on the new instances together. A TCP reset is worse: every client discovers the failure on the same beat.
3. Wait 30–60 seconds for clients to move, then force-close whatever is left.

On Kubernetes this is `RollingUpdate` with a small `maxUnavailable`, a `preStop` hook for draining, a `terminationGracePeriodSeconds` long enough to finish it, a readiness probe so the next batch waits for the previous one to be healthy, and a `PodDisruptionBudget` so cluster upgrades cannot take too many pods down at once.

**Circuit breakers and load shedding** protect two different directions. A circuit breaker sits on outbound calls to a dependency. It watches error and timeout rates in a window, then moves `closed → open → half-open`: fail fast while the dependency is sick, probe a few requests after a pause, and close again only if those succeed. Libraries such as Resilience4j, or Envoy/Istio outlier detection, cover this without inventing a state machine. Load shedding sits on inbound traffic. It watches a cheap local signal — queue depth, in-flight requests, CPU — and starts refusing work, preferably the least important work first. Adaptive concurrency limits that rise and fall with latency (the same idea as TCP congestion control) beat a single hard number.

The two belong together: the circuit breaker stops you from kicking a dying dependency, and load shedding stops you from accepting more than you can finish.

## Cheap reconnects versus expensive ones

A full reconnect that re-authenticates and reloads every subscription is expensive. A session resume is not. The usual design stores a session object — `session_id`, `user_id`, auth state, subscribed channels, `last_sequence_number`, TTL — in a shared fast store such as Redis, with a short expiry (WebSocket.org suggests on the order of 2–5 minutes). The first connect does the heavy work and returns a token. On reconnect, the client presents that token:

- If it is still valid, skip re-auth, attach the new connection to the existing session, and replay only the missed messages from `last_sequence_number`.
- If it is gone, fall back to the heavy path.

Sliding expiration keeps active users from being kicked mid-session. The token needs to be unguessable, explicitly invalidated on logout, and preferably bound to something extra such as a device fingerprint. The metric that tells you this is working is the ratio of light resumes to heavy reconnects.

## Slack, 22 February 2022

Slack’s incident that day is a useful reminder that jitter is necessary and not sufficient. A Consul rollout collapsed the cache hit rate. Scatter queries dumped load onto the database. Clients already had backoff and jitter, and they still added traffic while the system was trying to recover. Slack throttled client boot requests, fixed the scatter queries, read from replicas, and changed how Consul was rolled out. Client-side randomness helps. It does not replace server-side admission control when the backend is already on fire.

# Cache stampede

A hot cache key expires or is deleted. Every request that depended on it misses at once and independently goes to the database. One recompute would have been enough. Thousands happen anyway, because no request knows the others are doing the same work.

This is also called dog-piling. Facebook ran into it at memcache scale. The failure mode is the congestion collapse described earlier: recomputation never finishes before the next timeout, so the cache never refills.

Wikipedia groups the industry responses into three families.

## Mutex locking and request coalescing

On a miss, the request tries to acquire a lock for that key. In Redis that is typically:

```
SET lock:mykey <token> NX PX 5000
```

Only the holder queries the database, writes the cache, and releases the lock — preferably with a Lua script that deletes the lock only if the token still matches, so a crashed holder’s TTL expiry cannot be stolen and then deleted by the late owner. Everyone else waits and reads the new value, serves a still-held stale copy, or returns an error if there is nothing to serve.

Inside a single process, Go’s `singleflight` pattern (the idea exists in other languages too) coalesces in-flight calls for the same key into one real fetch. That is enough when traffic stays on one instance. Across many instances you need a distributed lock.

This is the strongest correctness story: exactly one origin query per expiry. The cost is the edge cases — stuck locks, crash-while-holding, waiters that time out.

Facebook’s memcache leases are a server-side version of the same idea. On a miss, memcached hands out a lease token that authorizes the client to set the key. Tokens also prevent *stale sets*, where out-of-order updates write an old value back into cache. To stop a herd, the server issues at most one lease per key every 10 seconds. Other missers wait briefly or keep the old value. At most one origin query proceeds, even if thousands miss together.

## Probabilistic early expiration (XFetch)

Salvatore Sanfilippo described a lock-free alternative. Each read, *before* the key actually expires, rolls a probability of refreshing early. The probability rises as expiry approaches:

```
current_time - (expiry_time - delta * beta * log(random()))
```

`delta` is the estimated recompute time, `beta` is usually `1`, and `random()` is in `(0, 1)`. Because every request draws a different number, typically one request “wins” and refreshes while everyone else still sees a valid cached value. There is no lock and no extra infrastructure. Wikipedia notes that the exponential-distribution version of this is theoretically optimal against stampede. It is still probabilistic: a small chance remains that several requests refresh together.

## Background recomputation

The third family takes recomputation off the request path entirely. A cron, worker, or TTL-driven job refreshes the key before it expires, so user traffic always hits. This fits relatively static, enumerable keys — prices, config, trending lists. It does not fit keys that appear per user or per request.

## Stale-while-revalidate

At the HTTP and CDN layer, `Cache-Control: max-age=1, stale-while-revalidate=59` splits the lifetime into three phases. While fresh, serve from cache. While stale-but-usable, still serve the old value immediately and trigger a single background revalidation. Only after both windows expire does a request wait on a fetch. During the stale window, nobody blocks and only one revalidation runs. It is the simplest option if the product can tolerate a few seconds of slightly old data. It is the wrong option for balances and payment state.

# Predictable traffic spikes

Retry storms and cache stampedes are accidents. Some spikes are on the calendar: New Year’s Eve, a countdown, a flash sale, a livestream where everyone taps at once. The code may be healthy. The provisioned capacity is simply smaller than the crowd. Auto-scaling that reacts after the fact is too slow when the wave is already at the door, and some backends have hard limits anyway — a database connection pool does not scale out forever.

This problem is planning plus admission control, not detection.

## Capacity planning

SRE capacity planning usually starts with forecasting four growth shapes: linear, exponential (viral doubling), seasonal (this issue), and step functions (a 10x jump from one event). Historical peaks plus this year’s business context beat a linear extrapolation.

Load tests before the event should hit 50%, 100%, and 150–200% of forecasted traffic, looking for the real bottleneck — CPU, connection pools, queues — while there are still no users on the line. Operating bands of 0–70% (normal), 70–85% (warn), and 85%+ (danger) avoid both year-round overprovisioning and running with no headroom. The useful baseline on ordinary days is 70–85% utilization, so a spike has somewhere to go.

For a known event, the industry pattern is to start 4–6 weeks out: study last year’s traffic, load-test at 2x the expected peak, raise autoscaling ceilings, grow database capacity, and brief on-call. The principle is blunt. Plan for what you can see coming. Keep reactive tools for what you cannot. A New Year spike is the first kind.

## Virtual waiting rooms

Capacity planning still has a ceiling. Ticketmaster, SeatGeek, and large sales events put an admission layer in front of that ceiling rather than letting the backend absorb overflow.

A virtual waiting room parks arrivals in a FIFO queue (often DynamoDB or equivalent) instead of letting them into the real system. Each visitor gets a token with a timestamp. A separate process gradually exchanges visitor tokens for access tokens in arrival order. Only a valid access token enters the protected zone.

A leaky bucket sized to the backend’s true concurrency caps how fast people leave the queue. When the bucket is full, new requests get `429` and stay in line. The backend never sees more than it can handle, no matter how long the queue is.

The token check belongs at the edge — Lambda@Edge, Fastly, and similar — so invalid or not-yet-admitted traffic never reaches origin. Queue-it’s AWS case study claimed a proof of concept in about an hour and production in a day, without a DNS cutover or a rewrite of the app.

AWS’s own framing is that autoscaling, load testing, and caching are the foundation, and they are not always enough. Traffic can arrive faster than new capacity can be provisioned. That is when a waiting room is the last defense: an ordered wait for some people, instead of an outage for everyone.

The two groups of solutions do not replace each other. Planning sets the floor you can serve. Admission control is what you do when the floor is not high enough.

# What they have in common

All three issues are synchronized demand. Retry storms synchronize on a failure. Cache stampedes synchronize on an expiry. Calendar spikes synchronize on a clock. The industry answers are also the same idea in different clothes:

- **Break the synchrony.** Jitter, probabilistic early refresh, staggered deploys.
- **Collapse duplicate work.** Singleflight, locks, leases, one background recompute.
- **Refuse work you cannot finish.** Rate limits, load shedding, waiting rooms, retry budgets.
- **Plan when you can see the wave coming.** Forecast, load-test above the peak, keep headroom.

None of these is a silver bullet. Slack still needed throttles after clients already had jitter. XFetch still allows a rare double refresh. A waiting room still makes people wait. The systems that survive a herd combine several of these, and they measure the thing that actually matters: connections per second at the gateway, origin QPS at the moment a hot key dies, time to recover, and how much traffic was served stale, shed, or queued instead of taken as a crash.

# References

- [AWS Architecture Blog – Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Marc Brooker – Jitter: Making Things Better With Randomness](https://brooker.co.za/blog/2015/03/21/backoff.html)
- [WebSocket.org – WebSocket Reconnection: State Sync and Recovery Guide](https://websocket.org/guides/reconnection/)
- [Arpit’s Substack – Thundering Herd Problem and addressing it with randomness](https://arpit.substack.com/p/thundering-herd-problem-and-addressing)
- [Slack Engineering – Slack's Incident on 2-22-22](https://slack.engineering/slacks-incident-on-2-22-22/)
- [Wikipedia – Cache stampede](https://en.wikipedia.org/wiki/Cache_stampede)
- [Redis (antirez) – Cache Stampede Prevention](https://redis.antirez.com/fundamental/cache-stampede-prevention.html)
- [Hemant Gupta – Insights from Paper: Scaling Memcache at Facebook](https://hemantkgupta.medium.com/insights-from-paper-scaling-memcache-at-facebook-1386a5956859)
- [web.dev – Stale-while-revalidate](https://web.dev/articles/stale-while-revalidate)
- [Amisha Sinha – SRE Capacity Planning](https://medium.com/@amishasinha_31533/sre-capacity-planning-8f7c4b7f5cf0)
- [System Design Newsletter – Virtual Waiting Room Architecture](https://newsletter.systemdesign.one/p/virtual-waiting-room)
- [AWS Partner Network Blog – Managing Peak Traffic with Queue-it](https://aws.amazon.com/blogs/apn/how-to-manage-peak-traffic-on-aws-using-queue-its-virtual-waiting-room)
