# Project Overview

## Vision

Agent Supervisor transforms OpenCode from a single interactive coding assistant into a distributed AI agent control plane capable of orchestrating autonomous software engineering workflows across multiple agents, providers, repositories, and execution environments.

The system acts as a server-based orchestration layer that manages hierarchies of AI agents, coordinates decision-making, routes tasks between specialized workers, enforces approval and security policies, and exposes APIs for external control and integrations.

The long-term goal is to build an infrastructure platform similar in spirit to cloud coding agents such as Cursor Agents, Codex Cloud, Devin, or enterprise autonomous engineering systems — but fully self-hostable, provider-agnostic, OpenCode-native, API-first, and designed for multi-agent collaboration.

Instead of a single AI assistant interacting directly with a human, this project introduces:

- a master/supervisor AI
- specialized worker agents
- automated approval routing
- provider/model orchestration
- runtime isolation
- persistent task memory
- observability and metrics
- external integrations
- human escalation only when necessary

The system is intended for:
- autonomous coding
- repository maintenance
- debugging
- code review
- DevOps automation
- research pipelines
- infrastructure management
- long-running engineering workflows
- AI-assisted operations teams

## OpenCode Reference Boundary

OpenCode SDK and server behavior must be treated as an external contract. Before modifying or extending OpenCode integration, agents and contributors should read:

- `docs/opencode/server.mdx`
- `docs/opencode/sdk.mdx`

Use those files to verify server endpoints, SDK methods, session/message bodies, provider/config APIs, TUI controls, auth, permission responses, and event streams. The planned control-plane `/v1/*` API should wrap or coordinate OpenCode behavior without confusing it with the native OpenCode server API.

---

# Core Philosophy

## From Assistant → Autonomous Engineering System

Traditional coding assistants operate in a direct human-to-model loop:

Human → AI Assistant → Human Approval → Action

This project changes the interaction model into a hierarchical autonomous system:

Human
↓
Control Plane
↓
Master Agent
↓
Worker Agents
↓
Execution Environment

Worker agents should not constantly interrupt the user for decisions. Instead, they route requests upward through a policy-driven supervision layer.

The master agent becomes the operational brain of the system:
- coordinating tasks
- evaluating risks
- selecting providers/models
- approving safe actions
- escalating uncertain or dangerous actions
- managing execution state
- validating outputs
- aggregating results

Humans become supervisors rather than operators.

---

# System Architecture

## High-Level Architecture

```text
                        Human Owner
                              ↓
                  Telegram / API / CLI
                              ↓
                     Control Plane Server
                              ↓
                 Master / Supervisor Agent
                              ↓
               Agent Coordinator & Scheduler
                              ↓
 ┌────────────────────────────────────────────────────┐
 │                 Worker Agent Pool                 │
 ├────────────────────────────────────────────────────┤
 │ Planner Agent                                     │
 │ Coder Agent                                       │
 │ Reviewer Agent                                    │
 │ Debugger Agent                                    │
 │ Research Agent                                    │
 │ DevOps Agent                                      │
 │ Security Agent                                    │
 │ Documentation Agent                               │
 │ Infrastructure Agent                              │
 └────────────────────────────────────────────────────┘
                              ↓
                OpenCode Runtime Instances
                              ↓
             Git Worktrees / Containers / Sandboxes
                              ↓
                    Repositories & Systems
````

---

# Control Plane

## Control Plane Server

The control plane is the central orchestration service responsible for:

* task lifecycle management
* agent spawning and scheduling
* provider/model routing
* approval workflows
* event streaming
* runtime monitoring
* telemetry collection
* policy enforcement
* persistent state
* audit logging
* API exposure
* Telegram integration

The server is intended to run continuously as a long-lived service.

The architecture is API-first:

* REST API first
* WebSocket/SSE optional
* Telegram as first interactive interface
* web dashboard later

---

# Master Agent

## Supervisor Intelligence Layer

The master agent acts as the system coordinator.

It is responsible for:

* understanding incoming tasks
* decomposing objectives
* planning execution
* selecting worker agents
* selecting models/providers
* evaluating worker outputs
* resolving approval requests
* retrying failed subtasks
* detecting deadlocks or loops
* escalating uncertain decisions
* producing final reports

The master agent is intended to operate continuously across many concurrent tasks.

Unlike worker agents, the master has:

* global task visibility
* policy awareness
* provider awareness
* cost awareness
* execution history
* escalation authority

---

# Worker Agents

## Specialized Execution Agents

Worker agents are isolated OpenCode runtime instances designed for focused responsibilities.

Each worker may use:

* different prompts
* different providers
* different models
* different permissions
* different execution environments

Example agents:

### Planner Agent

Responsible for:

* task decomposition
* architecture planning
* implementation sequencing
* dependency analysis

### Coder Agent

Responsible for:

* code generation
* refactoring
* patch creation
* implementation tasks

### Reviewer Agent

Responsible for:

* code review
* architectural validation
* regression detection
* style consistency
* policy compliance

### Debugger Agent

Responsible for:

* log analysis
* runtime debugging
* stack trace analysis
* test failure investigation

### DevOps Agent

Responsible for:

* Docker
* CI/CD
* deployment pipelines
* infrastructure automation
* monitoring integration

### Security Agent

Responsible for:

* permission analysis
* dangerous command detection
* dependency auditing
* secret exposure detection

---

# Runtime Isolation

## Sandboxed Agent Sessions

Each worker agent should ideally run inside an isolated execution environment.

Possible isolation mechanisms:

* git worktrees
* containerized runtimes
* temporary working directories
* restricted shell environments
* provider-specific permission scopes

Goals:

* avoid context contamination
* improve concurrency
* isolate failures
* support rollback/retry
* improve reproducibility
* reduce accidental destructive operations

Each task may spawn:

* one agent
* many agents
* hierarchical subtasks
* parallel execution branches

---

# Approval & Escalation System

## Human-In-The-Loop Only When Necessary

One of the primary goals of this project is reducing unnecessary human interruption.

Traditional agent systems often stop execution whenever a potentially risky action appears.

This project introduces an escalation hierarchy:

```text
Worker Agent
↓
Master Agent
↓
Policy Engine
↓
Human Owner (only if required)
```

The master agent should automatically resolve low-risk approvals whenever possible.

Examples of auto-approved actions:

* reading files
* searching repositories
* formatting code
* running tests
* generating patches
* editing non-sensitive files
* creating summaries

Examples requiring escalation:

* deleting repositories
* force-pushing branches
* production deployment
* infrastructure destruction
* billing configuration changes
* secret modifications
* large migrations
* dangerous shell execution

The goal is autonomous operation with controlled escalation.

---

# Provider & Model Orchestration

## Multi-Provider AI Routing

The system is provider-agnostic.

Supported providers may include:

* OpenAI
* Anthropic
* OpenRouter
* Gemini
* Groq
* Ollama
* Mistral
* local OpenAI-compatible endpoints
* self-hosted inference clusters

The master agent dynamically selects providers/models based on:

* reasoning complexity
* coding ability
* latency requirements
* token cost
* context size
* reliability
* privacy requirements
* model availability
* provider outages

Example routing strategy:

| Agent          | Example Model                       |
| -------------- | ----------------------------------- |
| Planner Agent  | high-reasoning model                |
| Coder Agent    | code-specialized model              |
| Reviewer Agent | high-accuracy model                 |
| Research Agent | low-cost fast model                 |
| Security Agent | conservative high-reliability model |

This allows balancing:

* cost
* performance
* reliability
* scalability

---

# Telegram Integration

## Human Control Interface

Telegram acts as the first operational interface.

The Telegram bot should support:

* task creation
* approval requests
* live task updates
* agent status notifications
* pause/resume controls
* escalation alerts
* log previews
* final reports
* error notifications

Example workflow:

1. User submits task via API.
2. Master creates execution plan.
3. Worker agents begin execution.
4. Dangerous action detected.
5. Master evaluates risk.
6. If uncertain, Telegram sends approval request.
7. User approves/rejects.
8. Execution continues.

Telegram becomes a lightweight operational control surface before a full dashboard exists.

---

# Observability & Monitoring

## Metrics & Telemetry

The system is designed for production-style observability.

Prometheus metrics should eventually expose:

* active tasks
* queued tasks
* running agents
* token usage
* estimated provider costs
* provider latency
* task duration
* approval counts
* escalation counts
* runtime failures
* retry counts
* worker crashes
* model usage distribution

Structured logs and audit trails should exist for:

* security analysis
* debugging
* replayability
* compliance
* operational visibility

---

# API-First Platform

## REST API

The project is API-first by design.

Potential endpoints:

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

The API should eventually support:

* task submission
* live event streams
* patch previews
* provider management
* agent inspection
* execution replay
* approval workflows
* external automation integrations

---

# Long-Term Direction

## Autonomous Engineering Infrastructure

The long-term goal is building a generalized autonomous engineering platform capable of:

* large-scale repository maintenance
* autonomous issue resolution
* long-running engineering projects
* infrastructure automation
* distributed coding teams
* AI-assisted DevOps
* multi-agent collaboration
* automated debugging
* autonomous code review
* intelligent deployment workflows

The system is intended to evolve into a self-hostable engineering control plane rather than a single-user assistant.

---

# Development Status

This project is currently an early-stage architecture and orchestration framework built on top of OpenCode concepts.

Many features described here are:

* planned
* experimental
* architectural goals
* partially implemented
* under active exploration

The current focus is:

* orchestration
* supervision
* runtime management
* approval routing
* API infrastructure
* provider abstraction
* agent coordination
* operational reliability

---

# License

This project is based on software licensed under the MIT License.

Original copyright notices and license attributions must be preserved where required.
