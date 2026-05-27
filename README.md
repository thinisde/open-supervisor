---

<div align="center">
  <img src="assets/logo.png" alt="logo" width="200" />
  <h1>Agent Supervisor</h1>
  <p>OpenCode-native multi-agent control plane for self-hosted AI engineering workflows</p>

  [![MIT License](https://img.shields.io/badge/license-MIT-red.svg)](LICENSE)
  [![npm](https://img.shields.io/npm/v/opencode-orchestrator.svg)](https://www.npmjs.com/package/opencode-orchestrator)
  <!-- VERSION:START -->
  **Version:** `1.2.69`
  <!-- VERSION:END -->
</div>

---

## Project Direction

Agent Supervisor is an OpenCode-based multi-agent control plane.

The target system is a long-lived server that manages a hierarchy of AI agents. A Master/Supervisor Agent receives tasks, decomposes work, selects models/providers, spawns isolated OpenCode worker agents, monitors progress, routes approvals through policy, and escalates to the human owner only when necessary.

The current package is still distributed as the `opencode-orchestrator` OpenCode plugin for compatibility. The control-plane server, public REST API, Telegram bot, Prometheus endpoint, persistent task database, and provider registry are planned architecture unless explicitly noted as implemented.

## Current Implementation

Today this repository provides an OpenCode plugin runtime with:

- OpenCode plugin registration through `opencode.json` or `opencode.jsonc`
- `Commander`, `Planner`, `Worker`, and `Reviewer` agent definitions
- `/task`, `/plan`, and `/agents` helper commands inside OpenCode
- session-based worker spawning through the OpenCode SDK/client
- task tracking, polling, and completion detection
- concurrency controls, session pooling, and cleanup hooks
- TUI toast notifications and local metrics collection
- Rust-backed search/tool helpers for performance-sensitive operations

OpenCode server and SDK assumptions must be verified against the local reference docs:

- [`docs/opencode/server.mdx`](docs/opencode/server.mdx)
- [`docs/opencode/sdk.mdx`](docs/opencode/sdk.mdx)

## Target Architecture

```text
Human Owner
  -> API / Telegram / CLI
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
  -> Git Worktrees / Sandboxes / Repositories
```

The control plane is intended to be API-first and server-first. A web dashboard is not part of the first milestone.

## Agent Roles

| Agent | Target Responsibility |
| --- | --- |
| Master / Supervisor Agent | Understand tasks, create plans, route approvals, select models/providers, review worker output, produce final reports |
| Agent Coordinator / Scheduler | Allocate worker sessions, enforce concurrency limits, track lifecycle state |
| Planner Agent | Decompose work, identify dependencies, define execution order |
| Coder Agent | Implement patches in isolated task context |
| Reviewer Agent | Check correctness, regressions, tests, and policy compliance |
| Debugger Agent | Investigate logs, failing tests, and runtime behavior |
| DevOps Agent | Handle CI, containers, deployment planning, and operational tasks |
| Research Agent | Gather external information and summarize evidence |
| Security Agent | Review permissions, secrets, dependency risk, and destructive actions |

The current runtime implements the `Commander`, `Planner`, `Worker`, and `Reviewer` roles. Additional worker roles are roadmap items.

## Server/API Concept

The planned control plane should expose a REST API for automation and integrations, with optional WebSocket or SSE streams for live events.

Proposed endpoints:

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

The server should eventually support task submission, task status tracking, agent lifecycle management, logs/events, approval queues, model/provider routing, Prometheus metrics, Telegram integration, persistent task state, and audit logs.

## Approval And Escalation

The target approval model is an escalation chain, not human approval for every action.

```text
Worker Agent
  -> Master Agent
  -> Policy Engine
  -> Human Owner only if needed
```

Low-risk actions should be eligible for automatic approval by the Master Agent or policy layer:

- read files
- inspect code
- edit non-critical files
- run tests and formatters
- create summaries
- propose patches

High-risk or ambiguous actions should escalate to the human owner:

- deleting large file sets
- modifying secrets
- production deployment
- database migrations
- billing/provider configuration changes
- force-pushing git history
- destructive shell commands
- high-cost model usage
- unclear architectural direction

## Model And Provider Routing

The target control plane is provider-agnostic. The Master Agent should choose models/providers per task and per agent based on complexity, cost, latency, coding ability, reasoning ability, context length, privacy requirements, provider availability, and fallback policy.

Potential providers include OpenAI, Anthropic, OpenRouter, Google Gemini, Groq, Mistral, Ollama/local models, and custom OpenAI-compatible endpoints.

Example routing goals:

- Planner Agent: strong reasoning model
- Coder Agent: strong code model
- Reviewer Agent: high-accuracy model
- Research Agent: cheap/fast model with web tools
- Debugger Agent: code model with shell access
- Security Agent: conservative high-reliability model

## Telegram Integration Concept

Telegram is the planned first human control interface. It should support task notifications, approval prompts, reject/approve buttons, short status updates, final reports, error alerts, pause/resume/stop controls, log previews, and direct questions to the Master Agent.

Example flow:

1. User submits a task through the API.
2. Master Agent creates a plan.
3. Worker Agent requests approval for a risky action.
4. Master Agent auto-approves if policy allows it.
5. If risk is too high or unclear, Telegram sends an approval prompt.
6. Human owner taps Approve or Reject.
7. Task execution continues and the final report is sent.

## Observability Concept

The target server should expose Prometheus-compatible metrics and structured logs.

Planned metrics include:

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

Structured logs and audit trails should capture task lifecycle events, approval decisions, model/provider selection, worker restarts, and policy outcomes.

## Quick Start

Install the current OpenCode plugin with Bun:

```bash
bun add -g opencode-orchestrator
```

Install hooks are source-checkout safe, prefer `opencode.jsonc` when present, preserve sibling plugin entries, and skip automatic config mutation in CI environments.

Inside an OpenCode environment:

```bash
/task "Implement a new authentication module with JWT and audit logs"
```

To remove the plugin safely later:

```bash
agent-supervisor-cleanup
bun remove -g opencode-orchestrator
```

Package removal does not reliably run dependency cleanup hooks across package managers, so OpenCode config cleanup is explicit.

## Development

```bash
bun install
bun run build
bun run test:unit
```

Useful scripts:

- `bun run build`: build the TypeScript plugin and install-hook scripts
- `bun run build:all`: build TypeScript and Rust distribution binaries through Docker
- `bun run test:unit`: run TypeScript unit tests
- `bun run test:e2e`: run E2E tests
- `bun run rust:test`: run Rust tests
- `bun run log`: follow the local plugin log

## Documentation

- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Developer Note](docs/DEVELOPERS_NOTE.md)
- [OpenCode Server Reference](docs/opencode/server.mdx)
- [OpenCode SDK Reference](docs/opencode/sdk.mdx)
- [Control Plane Goals](docs/plans/goals.md)

## Development Status

This repository is an early-stage architecture and orchestration framework moving toward a self-hostable OpenCode control plane. Many server-control-plane features are planned, experimental, partially implemented, or under active exploration. Feature implementation status is tracked in [`docs/plans/ROADMAP.md`](docs/plans/ROADMAP.md).

Do not treat the planned REST API, Telegram integration, Prometheus endpoint, persistent task state, model router, provider registry, policy engine, audit log, or sandbox manager as complete until corresponding code and tests exist.

## License

MIT License - see [LICENSE](LICENSE) for details. Original copyright notices and license attributions must be preserved.

---

<div align="center">
  <sub>OpenCode-native control-plane infrastructure for autonomous software engineering</sub>
</div>
