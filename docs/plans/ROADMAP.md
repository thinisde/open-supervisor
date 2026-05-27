# Agent Supervisor Roadmap

This roadmap tracks implementation status for Agent Supervisor, currently distributed through the `opencode-orchestrator` package/plugin identifier for compatibility.

Status values:

- `done`: implemented and verified in the repository
- `in progress`: partially implemented or actively being scaffolded
- `not started`: planned but no implementation exists yet
- `deferred`: intentionally postponed
- `cancelled`: no longer planned

## Current Snapshot

| Area | Status | Notes |
| --- | --- | --- |
| OpenCode plugin runtime | done | Current entrypoint is `src/index.ts` and registers plugin hooks, tools, commands, notifications, and shutdown handling. |
| Agent Supervisor project naming | done | User-facing docs and metadata use Agent Supervisor while preserving `opencode-orchestrator` package/plugin compatibility. |
| Bun toolchain migration | done | Package scripts, docs, CI/release helpers, lockfile, and install-hook execution use Bun. Verified with build, unit tests, Rust tests, and JSON-RPC E2E. |
| OpenCode SDK/server reference requirement | done | Contributor/helper guidance points to `docs/opencode/server.mdx` and `docs/opencode/sdk.mdx` before changing SDK/server assumptions. |
| Roadmap tracking | done | This file is the status source for planned feature implementation. |
| Roadmap lifecycle hook | done | `.opencode/plugin/roadmap-lifecycle.ts` injects the current roadmap into OpenCode system context and reminds agents to update it when feature status changes. |

## Implemented Runtime Scaffolding

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| OpenCode config registration | done | `scripts/postinstall.ts`, `scripts/preuninstall.ts`, `scripts/run-install-hook.mjs` | Registers/removes `opencode-orchestrator` in OpenCode config with JSON/JSONC handling, backups, and CI no-op behavior. |
| Global cleanup command | done | `scripts/cleanup-plugin.mjs`, `package.json` `bin` | Provides `agent-supervisor-cleanup` and `opencode-orchestrator-cleanup` so cleanup no longer depends on `npm explore`. |
| Current agent registration | done | `src/plugin-handlers/config-handler.ts`, `src/agents/definitions.ts` | Registers Commander, Planner, Worker, and Reviewer with OpenCode. |
| Slash command scaffolding | done | `src/tools/slashCommand.ts` | Provides `/task`, `/plan`, and `/agents` in the current plugin runtime. |
| Session-based worker spawning | done | `src/core/agents/manager.ts`, `src/core/agents/manager/task-launcher.ts`, `src/core/agents/session-pool.ts` | Uses OpenCode sessions as current worker execution boundaries. |
| Task state tracking | done | `src/core/agents/task-store.ts` | In-memory task tracking with best-effort archival. Not a persistent control-plane database. |
| Task polling and completion detection | done | `src/core/agents/manager/task-poller.ts` | Polls OpenCode session status/messages to detect worker completion. |
| Concurrency controller | done | `src/core/agents/concurrency.ts` | Supports agent/provider/model concurrency keys, priority queues, circuit state, and resource pressure checks. |
| Session pooling | done | `src/core/agents/session-pool.ts` | Reuses OpenCode sessions and compacts context when supported by the client. |
| TUI toast notifications | done | `src/core/notification/*`, `src/shared/notification/*` | Current notification path is OpenCode TUI/local OS notifications. |
| Local metrics collection | done | `src/core/metrics/collector.ts`, `src/hooks/custom/metrics.ts` | Local counters exist, but no Prometheus endpoint exists yet. |
| Rust helper tooling | done | `crates/orchestrator-core`, `crates/orchestrator-cli` | Rust workspace provides helper binaries used by the package. |
| Project roadmap lifecycle hook | done | `.opencode/plugin/roadmap-lifecycle.ts` | Auto-discovered OpenCode plugin hook reads `docs/plans/ROADMAP.md`, injects roadmap context, reminds feature lifecycle work to update roadmap status, and preserves the rule through compaction. |

## Control-Plane Milestones

| Feature | Status | Target Outcome | Notes |
| --- | --- | --- | --- |
| Long-lived control-plane server | not started | Standalone server process that owns task lifecycle and worker coordination. | Do not claim implemented until a server entrypoint, tests, and docs exist. |
| REST API | not started | `POST /v1/tasks`, `GET /v1/tasks/:id`, approval endpoints, agent/provider listing. | Keep distinct from native OpenCode server endpoints in `docs/opencode/server.mdx`. |
| Optional SSE/WebSocket task events | not started | Live task status and log/event streaming. | Should align with OpenCode event semantics where possible. |
| Persistent task database | not started | Durable tasks, subtasks, events, approvals, and final reports. | Current task store is in-memory. |
| Structured audit log storage | not started | Durable audit trail for security, approvals, model routing, and worker actions. | Required for production-style operation. |
| Policy engine | not started | Classify actions and decide auto-approval vs escalation. | Must keep risky actions out of direct worker-human loops. |
| Approval queue | not started | Track pending approvals and resolution state. | Needed before Telegram approval buttons are meaningful. |
| Telegram bot integration | not started | Task notifications, approval prompts, pause/resume/stop, logs, and final reports. | First planned human action layer. |
| Prometheus `/metrics` endpoint | not started | Expose server metrics such as active tasks, queued tasks, costs, failures, and escalations. | Current metrics are local only. |
| Provider registry | not started | Provider metadata, auth state, availability, and default models. | Must remain provider-agnostic. |
| Model router | not started | Per-agent/per-task model selection by cost, latency, capability, context, privacy, and fallback. | Builds on provider registry. |
| Runtime sandbox manager | not started | Worktree/container/tmpdir isolation and permission scoping for workers. | Current worker isolation is OpenCode session-based. |
| Agent coordinator/scheduler service | in progress | Promote current in-process `ParallelAgentManager` concepts into server-owned scheduler boundaries. | Existing code is scaffolding, not a standalone service. |
| Master/Supervisor Agent role | in progress | Master agent plans, reviews outputs, routes approvals, and produces final reports. | Current `Commander` is the closest implemented role. |
| Additional specialized worker roles | not started | Coder, Debugger, DevOps, Research, Security, Documentation, Infrastructure agents. | Current runtime has Planner, Worker, Reviewer. |
| Patch preview workflow | not started | Show proposed file changes before risky application. | Should integrate with approval policy. |
| Cost visibility | not started | Token and model cost tracking per task/agent/provider. | Requires model/provider registry and telemetry. |
| Retry controls | not started | API/Telegram controls for retrying failed tasks or subtasks. | Requires persistent task state. |

## Deferred Or Cancelled

| Feature | Status | Reason |
| --- | --- | --- |
| Web dashboard | deferred | API-first and Telegram-first control surfaces come first. |
| Full distributed multi-node scheduling | deferred | Single-server control plane should be stabilized first. |
| Provider-specific public API contracts | deferred | Public contracts should remain provider-agnostic. |
| `slave` terminology | cancelled | Use `worker agent` in user-facing docs. |

## Verification Policy

Move a feature to `done` only when all applicable evidence exists:

- code entrypoint or implementation exists
- tests or verification command pass
- docs describe the actual behavior without overclaiming
- OpenCode SDK/server assumptions are verified against `docs/opencode/*.mdx`
- package scripts and CI use Bun where JavaScript tooling is involved
- rollback path is documented for risky changes

## Next Candidates

1. Define the server entrypoint boundary without implementing the full REST API.
2. Draft the task persistence schema and approval event model.
3. Design the provider registry and model router contracts.
4. Specify Telegram approval message payloads and callback handling.
5. Decide whether the published npm package name should remain `opencode-orchestrator` permanently or eventually migrate to `agent-supervisor`.
