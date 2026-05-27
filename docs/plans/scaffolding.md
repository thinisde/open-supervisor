You are modifying Agent Supervisor, currently distributed through the `opencode-orchestrator` package/plugin identifier for compatibility.

Goal: reposition the project from a simple OpenCode orchestrator into a server-based AI agent control plane.

Update all helper/docs/config files, especially:

- README.md
- AGENTS.md
- AGENT_MEMORY.md
- docs/*
- examples/*
- config templates
- comments that describe the project vision
- any existing helper files that explain architecture or usage

Also update helper guidance so contributors use `@docs/opencode/*.mdx` before making OpenCode SDK/server assumptions. The local files currently are:

- `docs/opencode/server.mdx`
- `docs/opencode/sdk.mdx`

Do not implement the full system yet unless files already contain scaffolding. Focus on aligning documentation, project rules, architecture notes, terminology, and examples with the new product direction.

# New Project Vision

This project is an OpenCode-based multi-agent control plane.

It runs as a long-lived server that manages a hierarchy of AI agents. A master/supervisor AI receives tasks, decomposes them, selects suitable models/providers, spawns worker OpenCode agents, monitors their progress, handles approvals, and escalates to the human only when necessary.

The system should feel like “cloud coding agents” from Cursor/Codex style products, but without a web dashboard for now. The first interface should be API-first, with Telegram as the interactive notification/action layer.

# Core Architecture

Document the hierarchy clearly:

Human Owner
↓
Control Plane Server
↓
Master / Supervisor Agent
↓
Agent Coordinator / Scheduler
↓
Worker Agents
├── Planner Agent
├── Coder Agent
├── Reviewer Agent
├── Debugger Agent
├── DevOps Agent
├── Research Agent
└── Security Agent

The master agent is responsible for:
- understanding user tasks
- breaking tasks into subtasks
- choosing which agents to spawn
- choosing which model/provider each agent should use
- reviewing worker outputs
- deciding whether an approval request can be handled automatically
- escalating high-risk decisions to the human
- producing the final report

# Server Requirements

Update docs to describe the project as a server application.

The server should eventually support:

- REST API for control
- optional WebSocket/SSE event stream
- task submission
- task status tracking
- agent lifecycle management
- logs/events
- approval queue
- model/provider registry
- Prometheus metrics endpoint
- Telegram bot integration
- persistent task state
- audit logs

Mention likely endpoints:

- POST /v1/tasks
- GET /v1/tasks/:id
- GET /v1/tasks/:id/events
- POST /v1/tasks/:id/approve
- POST /v1/tasks/:id/reject
- GET /v1/agents
- GET /v1/providers
- GET /metrics

# Agent Spawning

Document that the system spawns isolated OpenCode instances as workers.

Each worker should ideally run in:

- a separate working directory
- a separate git worktree
- a separate task context
- optional container sandbox
- controlled permission scope

Workers should not directly ask the human unless configured to do so. Instead, approval requests should be routed to the master agent.

# Approval / Intervention Model

Replace “human approval first” language with an escalation chain:

Worker Agent
↓
Master Agent
↓
Policy Engine
↓
Human Owner only if needed

The master can approve low-risk actions automatically.

Examples of low-risk auto-approvals:
- read files
- inspect code
- edit non-critical files
- run tests
- run formatters
- create summaries
- propose patches

Examples requiring human escalation:
- deleting large file sets
- modifying secrets
- production deployment
- database migrations
- changing billing/provider config
- force-pushing git history
- destructive shell commands
- unclear architectural direction
- high-cost model usage

# Model / Provider System

Document that the system supports multiple AI providers and per-agent model selection.

Providers may include:

- OpenAI
- Anthropic
- OpenRouter
- Google Gemini
- Groq
- Mistral
- Ollama/local models
- custom OpenAI-compatible endpoints

The master agent should decide which model/provider to use based on:

- task complexity
- cost
- latency
- coding ability
- reasoning ability
- context length
- privacy requirements
- provider availability
- fallback rules

Example:

Planner Agent → strong reasoning model  
Coder Agent → strong code model  
Reviewer Agent → high-accuracy model  
Research Agent → cheap/fast model with web tools  
Debug Agent → code model with shell access  
Security Agent → strict high-reliability model  

# Telegram Integration

Document Telegram as the first human control interface.

Telegram should support:

- task notifications
- approval requests
- reject/approve buttons
- short status updates
- final reports
- error alerts
- “pause task”
- “resume task”
- “stop task”
- “show logs”
- “ask master”
- “escalate to human”

Example flow:

1. User submits task via API.
2. Master creates plan.
3. Worker requests approval.
4. Master decides automatically if safe.
5. If risky, Telegram sends approval prompt.
6. Human taps Approve/Reject.
7. Task continues.

# Prometheus / Observability

Update docs to mention Prometheus support.

Metrics should eventually include:

- active_tasks
- active_agents
- queued_tasks
- task_duration_seconds
- agent_runtime_seconds
- model_tokens_total
- model_cost_estimated_total
- approval_requests_total
- human_escalations_total
- task_failures_total
- provider_errors_total
- worker_restarts_total

Also document structured logs and audit trails.

# API-First Control Panel

There is no web UI yet.

Describe the “control panel” as API-first for now:

- REST API
- Telegram bot
- CLI later
- web dashboard later

Avoid promising a finished website.

The design direction should be similar to cloud coding agents:
- task queue
- agent sessions
- live logs
- approval events
- patch previews
- final reports
- model/provider selection
- cost visibility
- retry controls
- human escalation

# Naming / Terminology

Use these terms consistently:

- Control Plane
- Master Agent
- Supervisor Agent
- Worker Agent
- Agent Session
- Task
- Subtask
- Approval Request
- Escalation
- Provider Registry
- Model Router
- Policy Engine
- Audit Log
- Runtime Sandbox

Avoid “slave” in user-facing docs. Use “worker agent” instead.

# Documentation Tone

Make the docs sound like an early but serious developer infrastructure project.

Tone:
- technical
- self-hostable
- server-first
- API-first
- OpenCode-native
- automation-focused
- safe-by-default
- human-in-the-loop only when necessary

# README Structure

Rewrite README.md to include:

1. Project description
2. Architecture overview
3. Agent hierarchy diagram
4. Key features
5. Planned features
6. Server/API concept
7. Telegram integration concept
8. Prometheus metrics concept
9. Model/provider routing concept
10. Approval/escalation model
11. Example workflow
12. Development status
13. MIT license attribution

# AGENTS.md

Update AGENTS.md to define project rules for AI contributors:

- preserve MIT attribution
- do not remove original license notices
- prefer small changes
- update docs when architecture changes
- never hardcode secrets
- keep APIs server-first
- preserve OpenCode compatibility
- prefer provider-agnostic abstractions
- use “worker agent”, not “slave”
- route risky actions through approval policy
- document assumptions

# AGENT_MEMORY.md

Update AGENT_MEMORY.md with persistent project memory:

- This fork is becoming an OpenCode control plane.
- It runs as a server.
- It manages multiple OpenCode worker agents.
- A master/supervisor agent coordinates workers.
- The master handles most approval requests.
- Humans are only escalated for high-risk or ambiguous decisions.
- Telegram is the first interactive control interface.
- REST API is the primary control surface.
- Prometheus metrics are required.
- Multiple model providers must be supported.
- The master chooses models/providers per agent/task.

# Important Constraints

Do not claim features are fully implemented unless they already exist.

Use wording like:
- planned
- intended
- target architecture
- roadmap
- design goal
- proposed endpoint

Keep implementation claims accurate.

Do not remove original MIT license attribution.

After modifying files, summarize:
- changed files
- major documentation changes
- any assumptions
- any TODOs discovered
