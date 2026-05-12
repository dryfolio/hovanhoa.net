---
title: "Live Reloading in Go"
brief: "A quick guide to setting up Air for live reload in Go projects to avoid manual restarts during development."
publishedAt: "2025-01-14"
updatedAt: "2025-01-14"
tags:
  - golang
---

Live reload is a handy feature that lets developers see code changes instantly. It removes the need to manually stop and restart the server after every update.

Since Go is a compiled language, we cannot reload code in the same way as some interpreted runtimes. But after seeing many developers recommend it, I tried this setup and found it very useful.

That is why I am sharing something I recently learned.

![](/posts/live-reload-in-go-with-air/cover.png)

# What Is Air?

Air is a live reload tool for Go developers. It watches your codebase and automatically rebuilds and restarts your app whenever files change.

Without a tool like this, a common Go workflow is:

1. Stop the running app
2. Rebuild or rerun
3. Start it again

Doing that repeatedly can slow development and break focus.

With Air, you get:

- **Automatic reloading:** Air watches your Go files and refreshes the server on save.
- **Streamlined workflow:** No more manual stop/start cycle after each small change.
- **Better developer experience:** You stay focused on coding instead of process management.

# Install Air

Install Air with Go:

```bash
go install github.com/cosmtrek/air@latest
```

If you use Homebrew on macOS:

```bash
brew install cosmtrek/tap/air
```

Then verify the installation:

```bash
air -v
```

# Set Up and Run Air

1. Go to your project root.
2. Generate a default `.air.toml` config:

```bash
air init
```

3. This creates `.air.toml`, where you can customize watched directories, file extensions, and build commands. The default is usually good enough to start. You can explore more options [here](https://github.com/air-verse/air).
4. Start Air:

```bash
air
```

Air will detect file changes, rebuild, restart your app, and print any errors in the terminal.

![](/posts/live-reload-in-go-with-air/air-terminal.png)

You can also check this [repo](https://github.com/hovanhoa/go-url-shortener) to see my Go project config.

# Conclusion

That is all for this Christmas post.

I hope this helps if you are setting up a smoother Go development workflow. If you need help, feel free to message me.

![](/posts/live-reload-in-go-with-air/christmas.jpeg)

Let’s connect on [Twitter](https://x.com/_hovanhoa_) and [LinkedIn](https://linkedin.com/in/hovanhoa/).

Thanks for reading. Merry Christmas, and see you soon.
