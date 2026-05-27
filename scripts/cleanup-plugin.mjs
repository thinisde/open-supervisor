#!/usr/bin/env bun

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const runner = path.join(scriptDir, "run-install-hook.mjs");

const result = spawnSync(process.execPath, [runner, "preuninstall"], {
  cwd: path.resolve(scriptDir, ".."),
  stdio: "inherit",
  env: process.env,
});

if (typeof result.status === "number") {
  process.exit(result.status);
}

if (result.error) {
  console.error(`Failed to run cleanup: ${result.error.message}`);
}

process.exit(1);
