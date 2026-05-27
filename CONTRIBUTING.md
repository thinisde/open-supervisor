# Contributing to Agent Supervisor

Agent Supervisor is an OpenCode-native multi-agent control plane. The current package remains the `opencode-orchestrator` plugin for compatibility while the server-first control-plane architecture is built incrementally.

## Project Rules

- Preserve MIT attribution and original license notices.
- Prefer small, evidence-based changes.
- Update docs when architecture, APIs, agent roles, approval flow, provider routing, or OpenCode integration changes.
- Never hardcode secrets, tokens, provider keys, chat IDs, or deployment credentials.
- Keep new external APIs server-first and automation-friendly.
- Preserve OpenCode compatibility.
- Prefer provider-agnostic abstractions over provider-specific coupling.
- Use `worker agent`, not `slave`, in user-facing text.
- Route risky actions through approval policy instead of direct human interruption where policy can decide safely.
- Document assumptions, especially when a feature is planned rather than implemented.

## OpenCode SDK/Server Reference

Before changing code or docs that depend on OpenCode server behavior, read the local reference docs:

- `docs/opencode/server.mdx`
- `docs/opencode/sdk.mdx`

Use those files to verify session APIs, message APIs, provider/config APIs, TUI methods, events, server flags, authentication, and SDK client creation. Do not rely on memory for OpenCode API shapes.

## Current Architecture

The implemented runtime is a hybrid TypeScript/Rust OpenCode plugin:

- TypeScript handles plugin hooks, agent prompts, task/session orchestration, notifications, and metrics collection.
- Rust handles performance-sensitive helper tools and is distributed as platform binaries.
- OpenCode sessions are the current worker execution boundary.
- `Commander`, `Planner`, `Worker`, and `Reviewer` are the current implemented agent roles.

The planned control plane extends this into a long-lived server with REST APIs, optional SSE/WebSocket streams, Telegram actions, Prometheus metrics, persistent task state, provider/model routing, approval policy, audit logs, and runtime sandbox metadata.

## Development Setup

Prerequisites:

- Bun v1.3.13+
- Rust stable with `cargo`
- Docker for distribution binary builds
- OpenCode installed locally for plugin runtime validation

Quick start:

```bash
bun install
bun run build
```

## Scripts

| Command | Description |
| --- | --- |
| `bun run build` | Build the TypeScript plugin and install-hook scripts |
| `bun run build:all` | Build TypeScript and Rust distribution binaries through Docker |
| `bun run rust:build` | Build Rust binary only |
| `bun run rust:test` | Run Rust unit and integration tests |
| `bun run test:unit` | Run TypeScript unit tests |
| `bun run test:e2e` | Run E2E tests |
| `bun run test:all` | Run the broad build/test suite |
| `bun run log` | Follow local plugin logs |

## Testing Strategy

Use the smallest relevant verification command first, then broaden if the change affects shared runtime paths.

- Rust core changes: `bun run rust:test`
- TypeScript unit changes: `bun run test:unit`
- Plugin build or exported type changes: `bun run build`
- OpenCode SDK/server integration changes: verify against `docs/opencode/*.mdx`, run relevant unit/E2E tests, and manually validate in OpenCode when feasible
- Documentation-only changes: read affected docs after editing and run at least a lightweight repository command such as `bun run build` when metadata or helper code changed

## Synchronization Rules

Keep related artifacts synchronized:

- TypeScript constants and Rust constants when tool names, status labels, or protocol strings change
- README and `docs/SYSTEM_ARCHITECTURE.md` when product direction or architecture changes
- Agent prompts and user-facing docs when agent responsibilities change
- Tests and fixtures when contracts, status values, or tool schemas change
- OpenCode integration docs and code when SDK/server assumptions change

## Release Notes

Release descriptions should distinguish implemented functionality from planned control-plane milestones. Avoid claiming the REST API, Telegram integration, Prometheus endpoint, persistent task state, provider registry, model router, policy engine, audit log, or sandbox manager are complete until code and tests exist.
