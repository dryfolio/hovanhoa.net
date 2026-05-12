---
title: "Building a URL Shortener Service using Golang"
brief: "How to design and implement a TinyURL-like service with Go, Gin, GORM, Redis, and PostgreSQL."
publishedAt: "2024-12-26"
updatedAt: "2024-12-26"
tags:
  - golang
  - system design
---

This tutorial shows how to build a URL shortener similar to TinyURL, covering both design and implementation.

# Technologies

- Golang
- Gin Framework
- GORM
- Redis
- PostgreSQL

# High-Level Design

## API Endpoints

API endpoints enable communication between clients and servers. We design these APIs using REST principles.

If you are new to RESTful APIs, see: [restfulapi](https://restfulapi.net/)

A URL shortener mainly needs two endpoints:

1. **URL shortening:** `POST` request with the original long URL.
2. **URL redirecting:** `GET` request with the short URL.

## URL Shortening

For URL shortening, we need a hash function that maps a long URL to a short URL. Conceptually, we store `<shortURL, longURL>` pairs.

![](/posts/building-a-url-shortener-service-using-golang/url-shortening.png)

## URL Redirecting

The API supports two redirect status codes:

- **301 (permanent redirect):** browser caches response, so future requests can bypass shortener service.
- **302 (temporary redirect):** future requests continue passing through shortener service first.

![](/posts/building-a-url-shortener-service-using-golang/url-redirecting.png)

To reduce server load, `301` is often a good default when mappings are stable.

# Low-Level Design

## Hash Algorithm

Like any hash strategy, collisions can happen. Checking the database on every collision is expensive.

A common approach is **Base62** encoding, using characters:

- `0-9`
- `a-z`
- `A-Z`

![](/posts/building-a-url-shortener-service-using-golang/base62-conversion.png)

In this project, I use Twitter Snowflake to generate a unique numeric ID, then convert it with Base62.

## URL Shortening Flow

![](/posts/building-a-url-shortener-service-using-golang/url-shortening-flow.png)

1. Check whether `longURL` already exists in cache.  
   If not, check database, cache result, and return it.  
   If still not found, treat as new URL.
2. Generate new unique ID (Snowflake), then convert with Base62.
3. Store `<shortURL, longURL>` in database and cache, then return short URL.

## URL Redirecting Flow

![](/posts/building-a-url-shortener-service-using-golang/url-redirecting-flow.png)

1. User requests `shortURL`
2. Load balancer routes request to web server
3. If short URL exists in cache, return long URL
4. Otherwise fetch from database
5. Return `301` with `Location: longURL`

# Development

## Step 1: Set Up the Project

Create a new project directory and initialize a Go module:

![](/posts/building-a-url-shortener-service-using-golang/setup-project.png)

## Step 2: Define the URL Struct

Create a URL struct for mapping `shortURL` and `longURL`:

![](/posts/building-a-url-shortener-service-using-golang/url-struct.png)

## Step 3: Implement URL Shortening

Create `GenerateShortURL` to:

- handle `POST` requests
- generate short URLs
- return JSON response

![](/posts/building-a-url-shortener-service-using-golang/implement-shortening.png)

## Step 4: Implement URL Redirecting

Create `RedirectShortURL` to:

- handle `GET` requests
- resolve short URL
- redirect to long URL

![](/posts/building-a-url-shortener-service-using-golang/implement-redirecting.png)

**Notes:**

- Caching is handled in service layer logic for each function call.
- Snippets above are illustrative. Full source code is available [here](https://github.com/hovanhoa/go-url-shortener).

# Conclusion

That is all for this article.

I hope this tutorial is useful. If you need help, feel free to reach out.

Let's connect on [Twitter](https://x.com/_hovanhoa_) and [LinkedIn](https://linkedin.com/in/hovanhoa/).

Thanks for reading. See you next time.
