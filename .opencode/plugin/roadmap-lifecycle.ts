import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Part, Plugin } from "@opencode-ai/plugin";

const ROADMAP_PATH = "docs/plans/ROADMAP.md";
const FEATURE_LIFECYCLE_PATTERN = /\b(feature|implement|implemented|implementation|in progress|done|deferred|defer|cancelled|canceled|cancel|roadmap|status)\b/i;

const ROADMAP_RULES = `<agent_supervisor_roadmap_lifecycle>
Project: Agent Supervisor.

Before implementing, changing, deferring, or cancelling any feature, use the current roadmap as the status source of truth.

Required workflow:
1. Read \`${ROADMAP_PATH}\` before feature implementation work begins.
2. If a feature moves to \`in progress\`, \`done\`, \`deferred\`, or \`cancelled\`, update \`${ROADMAP_PATH}\` in the same work session.
3. Do not claim a feature is implemented unless the roadmap status and notes match the actual code and verification evidence.
4. Keep planned control-plane features marked as planned/not started until code and tests exist.
5. Preserve the \`opencode-orchestrator\` package/plugin identifier unless an explicit package migration is requested.
</agent_supervisor_roadmap_lifecycle>`;

function textOf(parts: Part[]): string {
  return parts
    .map((part) => (part.type === "text" ? part.text ?? "" : ""))
    .join("\n");
}

function prependTextPart(parts: Part[], text: string): void {
  const textPart = parts.find((part) => part.type === "text");
  if (textPart?.type === "text") {
    textPart.text = `${text}\n\n${textPart.text ?? ""}`;
    return;
  }

  parts.unshift({ type: "text", text } as Part);
}

export default (async ({ directory }) => {
  const roadmapFile = join(directory, ROADMAP_PATH);

  async function roadmapSnapshot(): Promise<string> {
    try {
      const content = await readFile(roadmapFile, "utf8");
      return `<current_roadmap path="${ROADMAP_PATH}">\n${content}\n</current_roadmap>`;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      return `<current_roadmap path="${ROADMAP_PATH}" status="unavailable">${reason}</current_roadmap>`;
    }
  }

  return {
    "experimental.chat.system.transform": async (_input, output) => {
      output.system.unshift(`${ROADMAP_RULES}\n\n${await roadmapSnapshot()}`);
    },

    "chat.message": async (_input, output) => {
      const messageText = textOf(output.parts);
      if (!FEATURE_LIFECYCLE_PATTERN.test(messageText)) return;

      prependTextPart(
        output.parts,
        `Roadmap lifecycle hook: read ${ROADMAP_PATH} first, and update it if this work changes any feature status.`
      );
    },

    "experimental.session.compacting": async (_input, output) => {
      output.context.push(`${ROADMAP_RULES}\n\nKeep ${ROADMAP_PATH} synchronized with feature lifecycle changes after compaction.`);
    },
  };
}) satisfies Plugin;
