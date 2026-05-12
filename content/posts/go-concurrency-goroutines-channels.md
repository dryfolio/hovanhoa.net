---
title: "Concurrency in Golang"
brief: "A practical introduction to Go concurrency concepts, including goroutines, channels, select, and wait groups."
publishedAt: "2024-11-26"
updatedAt: "2024-11-26"
tags:
  - golang
  - concurrency
---

After reading the Concurrency chapter in *Learning Go - An Idiomatic Approach to Real-World Go Programming*, I was surprised by how different Go's approach to concurrency is compared to many other languages. That inspired me to write this post.

# Introduction to Concurrency

Concurrency is the idea of dividing one process into independent parts and defining how those parts safely share data.

In many languages, concurrency is built on OS threads and locking mechanisms. Go takes a different direction.

Concurrency allows different parts of a program to run independently, which can improve performance and use system resources more effectively. It is especially useful for network services and applications handling multiple user inputs.

In general, programs follow three steps:

1. Input data
2. Process data
3. Produce output

Whether concurrency is useful depends on data dependencies between these steps. If tasks are independent, they can run concurrently. If one task depends on another task's result, they must run in order.

# Concurrency vs Parallelism

Concurrency and parallelism are related but not the same.

- **Concurrency** focuses on program structure and coordination.
- **Parallelism** focuses on physical execution and speedup across multiple cores/machines.

Concurrent programs can run on single-core or multi-core processors. Parallel programs require multi-core or distributed execution.

![](/posts/go-concurrency-goroutines-channels/concurrency-vs-parallelism.jpeg)

For example, a web server can handle multiple requests concurrently, but on a single core those requests may not execute in true parallel. On the other hand, a parallel matrix multiplication might use many cores but still not model coordination logic like a concurrent system.

# Goroutines

A goroutine is a lightweight thread managed by the Go runtime.

When a Go program starts, the runtime creates threads and runs an initial goroutine for `main`. The runtime scheduler maps goroutines onto OS threads.

Why this is powerful:

- Creating goroutines is faster than creating OS threads.
- Goroutines begin with small stacks that grow as needed.
- Context switching between goroutines is cheaper than switching OS threads.

![](/posts/go-concurrency-goroutines-channels/goroutines.png)

In a typical example, `printNumbers()` can run as a goroutine using the `go` keyword, while `main` continues concurrently.

# Channels

Goroutines communicate through channels. Like slices and maps, channels are built-in types created with `make`:

```go
ch := make(chan int)
```

Channels are reference types, and an uninitialized channel has a zero value of `nil`.

The `<-` operator reads from and writes to channels:

```go
a := <-ch
ch <- b
```

Each sent value is received once. If multiple goroutines read from the same channel, only one gets each value.

By default, channels are unbuffered:

- Send blocks until another goroutine receives.
- Receive blocks until another goroutine sends.

So at least two concurrently running goroutines are typically involved.

Buffered channels allow limited queued sends before blocking. Writes block when full; reads block when empty.

## Using for-range with Channels

`for-range` can iterate values from a channel until it is closed:

```go
for v := range ch {
    fmt.Println(v)
}
```

## Closing a Channel

Close a channel with:

```go
close(ch)
```

Writing to a closed channel (or closing it twice) causes panic. Reading from a closed channel is valid: buffered values are drained first, then zero values are returned.

## Channel Behaviors

Channels have different behaviors depending on whether they are nil, open, closed, buffered, or unbuffered.

![](/posts/go-concurrency-goroutines-channels/channel-behaviors.png)

The table above summarizes these behaviors in detail.

# Select

`select` lets you wait on multiple channel operations and proceed with the first one that is ready. It is similar to `switch`, but for channels.

![](/posts/go-concurrency-goroutines-channels/select.png)

In this kind of pattern, a loop with `select` can wait for results from multiple goroutines via channels.

# WaitGroups

Sometimes one goroutine must wait for many others.

For this, use `sync.WaitGroup` from the standard library.

![](/posts/go-concurrency-goroutines-channels/waitgroups.png)

`sync.WaitGroup` is ready to use at zero value (no explicit initialization needed). It has three main methods:

- `Add(n)` increases the counter.
- `Done()` decreases the counter (usually in each goroutine).
- `Wait()` blocks until the counter reaches zero.

Common pattern:

- Call `Add` once with total workers.
- Call `Done` inside each worker.
- Use `defer wg.Done()` to guarantee completion bookkeeping even if errors occur.

# Conclusion

This article covered Go concurrency tools, especially goroutines and channels.

We looked at:

- how goroutines provide lightweight concurrent execution,
- how channels coordinate communication and synchronization,
- how `select` handles multiple channel operations,
- and how `WaitGroup` helps wait for multiple goroutines.

I hope this article is useful. If you need any help, feel free to leave a comment.

Let's connect on [Twitter](https://x.com/_hovanhoa_) and [LinkedIn](https://linkedin.com/in/hovanhoa/).

Thanks for reading. See you next time.
