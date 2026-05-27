/**
 * Agent Definitions Registry
 * 
 * Current control-plane agent scaffolding:
 * - Commander: current Master/Supervisor Agent equivalent
 * - Planner: Planning + Research
 * - Worker: Implementation + Documentation
 * - Reviewer: Verification + Context Management (Final Quality Gate)
 *
 * Additional worker-agent roles are planned in docs/SYSTEM_ARCHITECTURE.md.
 */

import { AGENT_NAMES } from "../shared/agent/constants/index.js";
import type { AgentDefinition } from "../shared/agent/interfaces/index.js";
import { commander } from "./commander.js";
import { planner } from "./subagents/planner.js";
import { worker } from "./subagents/worker.js";
import { reviewer } from "./subagents/reviewer.js";

export const AGENTS: Record<string, AgentDefinition> = {
  [AGENT_NAMES.COMMANDER]: commander,
  [AGENT_NAMES.PLANNER]: planner,
  [AGENT_NAMES.WORKER]: worker,
  [AGENT_NAMES.REVIEWER]: reviewer,
};
