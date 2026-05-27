# Agent Memory - Agent Supervisor Session

## Current Task

Add an OpenCode project hook that keeps `docs/plans/ROADMAP.md` loaded and synchronized when feature lifecycle status changes.

## Last Completed Step

Created `.opencode/plugin/roadmap-lifecycle.ts`, updated `.gitignore` so the hook can be tracked while other `.opencode` runtime files stay ignored, and updated `docs/plans/ROADMAP.md` to mark the roadmap lifecycle hook as done. Verified the hook with `bun --check` and confirmed git status shows the hook as untracked rather than ignored.

## Next Exact Step

Restart OpenCode so the auto-discovered `.opencode/plugin/roadmap-lifecycle.ts` hook is loaded, then verify a feature-related prompt receives the roadmap context/reminder.

## Incomplete Items And Why

- Full platform binary refresh is incomplete because this environment does not have `rustup` or `docker`; only the local macOS arm64 and fallback binaries were refreshed for E2E verification.
- Standalone REST control-plane server, Telegram bot, Prometheus endpoint, persistent task database, provider registry/model router, policy engine/approval queue, audit log storage, and sandbox manager remain planned roadmap items, not implemented runtime features.
- Runtime validation inside a restarted OpenCode session is pending because this environment cannot reload the user's running OpenCode process.

## Key Decisions

- Use Agent Supervisor as the project/product name.
- Keep `opencode-orchestrator` as the package/plugin identifier for compatibility until an explicit package rename/migration is planned.
- Use Bun v1.3.13+ as the package manager and script runtime for project tooling.
- Add `agent-supervisor-cleanup` and `opencode-orchestrator-cleanup` global cleanup bins instead of relying on `npm explore`.
- Require `docs/opencode/server.mdx` and `docs/opencode/sdk.mdx` as the source of truth for OpenCode SDK/server assumptions.
- Track feature implementation status in `docs/plans/ROADMAP.md` using `done`, `in progress`, `not started`, `deferred`, and `cancelled`.
- Implement roadmap lifecycle enforcement as an auto-discovered OpenCode plugin with `experimental.chat.system.transform`, `chat.message`, and `experimental.session.compacting` hooks.

## Rejected Alternatives

- Renaming the npm package from `opencode-orchestrator` to `agent-supervisor` immediately, because repository rules and compatibility expectations currently preserve the package/plugin identifier.
- Claiming REST API, Telegram, Prometheus, persistent storage, model routing, policy, audit log, or sandbox features as implemented; current work is documentation/tooling/scaffolding alignment.
- Keeping npm-based project scripts after the user requested Bun migration.
- Storing the roadmap rule only in static docs, because the user explicitly requested `.opencode` hooks.

## Known Risks

- Package lifecycle scripts now require Bun; users installing with npm without Bun available may fail until distribution assumptions are finalized.
- Tracked non-local platform binaries may still contain previous branding until rebuilt by the release workflow.
- `docs/opencode/` and `docs/plans/` were already untracked in the worktree at session start; this task modified files under `docs/plans/` and read but did not modify `docs/opencode/`.
- `.opencode/plugin/roadmap-lifecycle.ts` depends on OpenCode project plugin auto-discovery and requires an OpenCode restart to take effect.

## Open These Files First Next Session

1. `AGENT_MEMORY.md`
2. `.opencode/plugin/roadmap-lifecycle.ts`
3. `docs/plans/ROADMAP.md`
4. `.gitignore`
5. `README.md`
6. `package.json`
7. `docs/SYSTEM_ARCHITECTURE.md`
