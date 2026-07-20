---
title: "Building an AI agent in Go"
brief: "What an AI agent actually is once you strip away the hype — a model, a set of tools, and a loop. I build a small tool-calling agent in Go from scratch."
publishedAt: "2026-07-20"
updatedAt: "2026-07-20"
tags:
  - ai agents
  - golang
  - system design
---

I spend most of my time in backend systems, so when "AI agents" started showing up everywhere, my first instinct was to distrust the word. It sounded like a product category, not a thing you could build.

Then I wrote one. It turns out an agent is much smaller than the marketing suggests. Strip away the framing and you are left with three parts:

- a **model** that can decide what to do next
- a set of **tools** the model is allowed to call
- a **loop** that runs until the model is done

That is the whole idea. Everything else — memory, planning, multi-agent orchestration — is a variation on this core. In this post I build that core in Go, without a framework, so the mechanics are impossible to hide.

# The mental model

A plain LLM call is a function: text in, text out. It cannot check the weather, read a file, or query your database. It only predicts tokens.

An agent closes that gap by giving the model a menu of tools and letting it ask for them. The model does not run any code itself. It says *"I would like to call `read_file` with this path"*, your program runs the actual function, and you hand the result back. The model reads the result and decides what to do next.

The important shift is who is in control. In a normal request you drive the model. In an agent, the model drives you — it decides which tool to call and when it is finished. Your job is to run the loop faithfully.

# The core loop

Here is the shape of it, before any real code:

```
1. send the conversation (+ tool definitions) to the model
2. model replies with either:
     a. a final answer   -> we're done
     b. one or more tool calls
3. run the requested tools
4. append the results to the conversation
5. go back to step 1
```

That is the entire agent. Everything below is just filling in the blanks in Go.

# Defining a tool

A tool is a function plus a schema that tells the model how to call it. I keep both together:

```go
type Tool struct {
	Name        string
	Description string
	// InputSchema is a JSON Schema describing the arguments.
	InputSchema map[string]any
	// Run executes the tool with the raw JSON arguments the model provided.
	Run func(ctx context.Context, args json.RawMessage) (string, error)
}
```

A concrete tool — read a file from disk:

```go
var readFile = Tool{
	Name:        "read_file",
	Description: "Read the contents of a file at a relative path.",
	InputSchema: map[string]any{
		"type": "object",
		"properties": map[string]any{
			"path": map[string]any{
				"type":        "string",
				"description": "Relative path to the file.",
			},
		},
		"required": []string{"path"},
	},
	Run: func(ctx context.Context, args json.RawMessage) (string, error) {
		var in struct {
			Path string `json:"path"`
		}
		if err := json.Unmarshal(args, &in); err != nil {
			return "", err
		}
		b, err := os.ReadFile(in.Path)
		if err != nil {
			return "", err
		}
		return string(b), nil
	},
}
```

The `Description` and `InputSchema` are not documentation for humans — they are the prompt. The model decides whether and how to call the tool based entirely on these words, so they earn their keep. Vague descriptions produce vague tool use.

# The loop in Go

Now the part that makes it an agent. I keep a running list of messages and call the model until it stops asking for tools:

```go
func (a *Agent) Run(ctx context.Context, task string) (string, error) {
	messages := []Message{
		{Role: "user", Content: task},
	}

	for step := 0; step < a.MaxSteps; step++ {
		resp, err := a.model.Complete(ctx, messages, a.tools)
		if err != nil {
			return "", err
		}

		// No tool calls means the model is done.
		if len(resp.ToolCalls) == 0 {
			return resp.Text, nil
		}

		// Record what the model asked for.
		messages = append(messages, resp.AsMessage())

		// Run each requested tool and feed the result back.
		for _, call := range resp.ToolCalls {
			result := a.dispatch(ctx, call)
			messages = append(messages, Message{
				Role:       "tool",
				ToolCallID: call.ID,
				Content:    result,
			})
		}
	}

	return "", fmt.Errorf("gave up after %d steps", a.MaxSteps)
}
```

Two details matter more than they look.

The `MaxSteps` bound is not optional. A model can get stuck calling the same tool forever, and without a ceiling your agent becomes an unbounded bill. Treat it as a circuit breaker, not a nice-to-have.

Every tool result goes *back into the conversation*. The model has no memory between calls except the message list you maintain. If you forget to append a result, the model is blind to what its own tool just returned.

# Dispatching tools safely

`dispatch` is where the model's request meets real code, so it is where things break. The rule I follow: **a tool error is data, not a crash.** The model should see the error and get a chance to recover, rather than taking the whole program down.

```go
func (a *Agent) dispatch(ctx context.Context, call ToolCall) string {
	tool, ok := a.tools[call.Name]
	if !ok {
		return fmt.Sprintf("error: unknown tool %q", call.Name)
	}

	out, err := tool.Run(ctx, call.Args)
	if err != nil {
		// Hand the error back to the model instead of returning it.
		return fmt.Sprintf("error: %v", err)
	}
	return out
}
```

Returning the error as a string feels wrong to a Go programmer — we are trained to propagate errors, not stringify them. But here the model is a participant that can read the message and adjust. Tell it the path did not exist and it will often try a different one. Crash, and it never gets the chance.

# What this is missing (on purpose)

The loop above is real but bare. In production I reach for:

- **Timeouts and cancellation** — every tool takes a `ctx`; wire real deadlines through it so a slow tool cannot hang the loop.
- **Concurrency** — when the model requests several independent tools in one turn, run them with an `errgroup` instead of serially. Go makes this almost free, and it is one of the reasons the language fits agents well.
- **Observability** — log every tool call and result. When an agent misbehaves, the transcript is the only way to understand why.
- **Guardrails** — a `read_file` tool that accepts any path is a directory-traversal bug waiting to happen. Validate and sandbox arguments before you run them.

None of these change the core loop. They wrap it.

# Why Go

I did not pick Go for this on a whim. Agents spend most of their wall-clock time waiting — on the model, on network tools, on disk. That is exactly the workload goroutines and channels were built for, and I have [written before](https://www.hovanhoa.net/go-concurrency-goroutines-channels) about why Go's concurrency model feels different. Parallel tool calls, streaming responses, and per-tool timeouts are ergonomic here in a way they are not in a single-threaded runtime.

The static types help too. A tool's arguments arrive as untyped JSON from the model, and having the compiler enforce the boundary where that JSON becomes a real struct catches a whole class of bugs before they reach the model.

# Closing

An agent is a model, some tools, and a loop. Once you have written the loop by hand, the frameworks stop being magic — you can read their source and recognise the same three parts, just with more features bolted on. That demystification is worth the afternoon it takes to build one.

If you want to go further, add a second tool, let the agent chain them, and watch the transcript. Seeing the model call `list_files` and then `read_file` on its own — without you scripting the order — is the moment it clicks.

Let's connect on [Twitter](https://x.com/_hovanhoa_) and [LinkedIn](https://linkedin.com/in/hovanhoa/).

Thanks for reading. See you next time.
