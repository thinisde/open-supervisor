# Examples

This directory contains Agent Supervisor control-plane usage examples for the planned server-first architecture.

The examples are conceptual until the control-plane REST API exists. Do not treat them as runnable API contracts yet.

## Planned Task Submission

```http
POST /v1/tasks
Content-Type: application/json

{
  "title": "Add audit logging to authentication",
  "repository": "file:///workspace/app",
  "priority": "normal",
  "requestedAgents": ["planner", "coder", "reviewer"],
  "approvalPolicy": "auto-low-risk"
}
```

Expected target behavior:

1. Control Plane Server persists a task record.
2. Master Agent decomposes the request into subtasks.
3. Scheduler creates isolated OpenCode worker sessions.
4. Policy Engine auto-approves low-risk work.
5. Telegram asks the human owner only for high-risk or ambiguous decisions.
6. Final report is returned through API and notification channels.

## OpenCode Reference

When implementing these examples, verify native OpenCode server and SDK behavior against:

- `docs/opencode/server.mdx`
- `docs/opencode/sdk.mdx`

The planned `/v1/*` control-plane API is separate from the native OpenCode server API.
