# System Architecture

## Overview

Agent Supervisor is being built from the current OpenCode plugin orchestrator into an OpenCode-native multi-agent control plane.

The target architecture is a long-lived server that coordinates a hierarchy of AI agents, routes work through isolated OpenCode worker sessions, applies approval policy, selects models/providers per task, exposes API-first control surfaces, and escalates to the human owner only when necessary.

**Status**: Early architecture and orchestration framework. The current repository implements an OpenCode plugin runtime and local multi-agent orchestration primitives. The server control plane, public REST API, Telegram bot, Prometheus endpoint, persistent task store, provider registry, model router, policy engine, and audit log are planned unless backed by current code.

## OpenCode Reference Sources

OpenCode SDK and server assumptions must be verified against the local reference docs before changing integration code or architecture docs:

- `docs/opencode/server.mdx`: `opencode serve`, server OpenAPI shape, sessions, messages, providers, TUI, auth, and SSE events
- `docs/opencode/sdk.mdx`: `createOpencode`, `createOpencodeClient`, generated client methods, session APIs, provider APIs, TUI APIs, and event subscription

The current plugin uses the OpenCode plugin API and SDK/client shape. Future control-plane APIs should wrap or coordinate OpenCode server behavior rather than inventing incompatible session semantics.

## Target Hierarchy

```text
Human Owner
  -> Control Plane Server
  -> Master / Supervisor Agent
  -> Agent Coordinator / Scheduler
  -> Worker Agent Pool
       -> Planner Agent
       -> Coder Agent
       -> Reviewer Agent
       -> Debugger Agent
       -> DevOps Agent
       -> Research Agent
       -> Security Agent
  -> OpenCode Runtime Instances
  -> Git Worktrees / Runtime Sandboxes
  -> Repositories and External Systems
```

## Current Runtime

The implemented runtime is an OpenCode plugin entrypoint in `src/index.ts`.

Current components:

- Bun-based package scripts for local development, builds, tests, release helpers, and install-hook execution
- Plugin hook registration for tools, config, events, chat messages, tool execution, assistant completion, session compaction, system transform, and shutdown
- Config handler that registers `Commander`, `Planner`, `Worker`, and `Reviewer` agents with OpenCode
- Slash command helpers for `/task`, `/plan`, and `/agents`
- `ParallelAgentManager` as the current in-process task/session coordination facade
- `TaskLauncher`, `TaskPoller`, `TaskResumer`, and `TaskCleaner` for worker session lifecycle
- `SessionPool` for reusable OpenCode child sessions
- `TaskStore` for in-memory task state and best-effort task archival
- `ConcurrencyController` for per-agent/provider/model concurrency keys, priority queues, circuit breaker state, and resource-pressure checks
- Toast and OS notification paths for current OpenCode/TUI feedback
- `MetricsCollector` for local runtime counters and latency summaries
- Rust CLI crates for performance-sensitive helper tools

This current runtime is useful scaffolding for the future control plane, but it is not yet a standalone REST server.

## Target Control Plane Server

The planned server should own task lifecycle and expose external control APIs. It should eventually manage:

- task submission and status tracking
- agent session lifecycle
- worker scheduling and queueing
- provider/model registry and routing
- approval queue and policy engine
- logs, events, and audit trail
- Telegram notifications and actions
- optional WebSocket/SSE event streams
- Prometheus-compatible metrics
- persistent task state
- runtime sandbox metadata

Proposed API surface:

```text
POST   /v1/tasks
GET    /v1/tasks/:id
GET    /v1/tasks/:id/events
POST   /v1/tasks/:id/approve
POST   /v1/tasks/:id/reject
GET    /v1/agents
GET    /v1/providers
GET    /metrics
```

These are proposed control-plane endpoints, not current OpenCode server endpoints. For the OpenCode server's actual API shape, use `docs/opencode/server.mdx`.

## Agent Responsibilities

### Master / Supervisor Agent

The Master Agent is the operational brain of the system. It is responsible for understanding incoming tasks, decomposing objectives, selecting worker agents, selecting models/providers, evaluating worker output, deciding whether low-risk approvals can be handled automatically, escalating high-risk or ambiguous decisions, retrying failed subtasks, and producing final reports.

In the current codebase, the `Commander` agent is the closest implemented role to this target Master/Supervisor Agent.

### Agent Coordinator / Scheduler

The coordinator should allocate worker sessions, enforce concurrency limits, prevent unsafe fan-out, track session status, and preserve parent/child task relationships.

Current scaffolding exists in `ParallelAgentManager`, `TaskLauncher`, `TaskPoller`, `TaskStore`, `SessionPool`, and `ConcurrencyController`.

### Worker Agents

Workers should run as isolated OpenCode instances or sessions with focused responsibility. The target worker pool includes Planner, Coder, Reviewer, Debugger, DevOps, Research, Security, Documentation, and Infrastructure roles.

The current runtime implements Planner, Worker, and Reviewer subagents. Additional worker types are roadmap items.

## Runtime Isolation

Each worker should ideally run in:

- a separate working directory
- a separate git worktree
- a separate task context
- an optional container sandbox
- a controlled permission scope

The current implementation creates and tracks OpenCode sessions. Full worktree/container sandbox orchestration is planned.

## Approval And Intervention Model

The target system should route approvals through an escalation chain:

```text
Worker Agent
  -> Master Agent
  -> Policy Engine
  -> Human Owner only if needed
```

Low-risk actions should be eligible for automatic approval, including file reads, repository inspection, non-critical edits, test runs, formatters, summaries, and patch proposals.

Human escalation should be required for destructive shell commands, large deletions, secret modifications, production deployment, database migrations, billing/provider changes, force pushes, unclear architecture decisions, and high-cost model usage.

The current plugin has safety hooks and runtime checks, but a complete policy engine and approval queue are planned.

## Model And Provider Routing

The control plane should be provider-agnostic and support per-agent model selection. Provider routing should consider task complexity, cost, latency, coding ability, reasoning ability, context length, privacy, availability, and fallback rules.

Potential providers include OpenAI, Anthropic, OpenRouter, Google Gemini, Groq, Mistral, Ollama/local models, and custom OpenAI-compatible endpoints.

The current `ConcurrencyController` already has provider/model concurrency configuration fields. A complete provider registry and model router are planned.

## API-First Control Panel

There is no web dashboard in the first target milestone.

The intended control surfaces are:

- REST API first
- optional WebSocket/SSE event streams
- Telegram bot as the first interactive human control layer
- CLI later
- web dashboard later

The control panel should feel similar to cloud coding agent products: task queue, agent sessions, live logs, approval events, patch previews, final reports, model/provider selection, cost visibility, retry controls, and human escalation.

## Telegram Integration

Telegram is the planned first human-facing action surface. It should support task notifications, approval requests, reject/approve buttons, short status updates, final reports, error alerts, pause/resume/stop task actions, log previews, direct questions to the Master Agent, and escalation alerts.

No Telegram bot is currently implemented in this repository.

## Observability

The target control plane should expose structured logs, audit logs, and Prometheus-compatible metrics.

Planned metrics:

- `active_tasks`
- `active_agents`
- `queued_tasks`
- `task_duration_seconds`
- `agent_runtime_seconds`
- `model_tokens_total`
- `model_cost_estimated_total`
- `approval_requests_total`
- `human_escalations_total`
- `task_failures_total`
- `provider_errors_total`
- `worker_restarts_total`

The current repository has a local `MetricsCollector` and a metrics hook, but it does not expose a Prometheus `/metrics` endpoint yet.

## Current Data Flow

Current OpenCode plugin flow:

```text
OpenCode plugin loads
  -> src/index.ts initializes hooks and managers
  -> config handler registers agents and commands
  -> user submits /task or Commander prompt
  -> chat/system hooks inject mission context
  -> Commander delegates work through task tools
  -> ParallelAgentManager creates child sessions through OpenCode client
  -> TaskPoller checks OpenCode session status and messages
  -> Reviewer task may be launched for completed Worker tasks
  -> notifications and progress state are updated
```

Target server flow:

```text
API task submission
  -> persistent task record
  -> Master Agent plan
  -> scheduler allocates worker sessions
  -> workers execute in isolated OpenCode runtimes
  -> approval requests route through policy
  -> risky decisions escalate through Telegram
  -> metrics, logs, and audit records are emitted
  -> final report is returned through API and notification channels
```

## Development Constraints

- Preserve OpenCode compatibility and verify SDK/server assumptions against `docs/opencode/*.mdx`.
- Keep APIs server-first and provider-agnostic.
- Use `worker agent`, not `slave`, in user-facing documentation.
- Do not hardcode secrets or provider credentials.
- Route risky actions through approval policy.
- Preserve MIT attribution and original license notices.
- Do not claim planned systems are complete without implementation and tests.

## Open Gaps

- Standalone control-plane server
- REST API implementation
- SSE/WebSocket event stream for control-plane tasks
- Telegram bot integration
- Prometheus metrics endpoint
- Persistent task state
- Audit log storage
- Provider registry and model router
- Policy engine and approval queue
- Worktree/container sandbox manager
- Additional specialized worker roles

Feature status is tracked in `docs/plans/ROADMAP.md`.
