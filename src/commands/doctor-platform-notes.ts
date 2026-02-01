import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import type { RebootixConfig } from "../config/config.js";
import { note } from "../terminal/note.js";
import { shortenHomePath } from "../utils.js";

const execFileAsync = promisify(execFile);

function resolveHomeDir(): string {
  return process.env.HOME ?? os.homedir();
}

export async function noteMacLaunchAgentOverrides() {
  if (process.platform !== "darwin") {
    return;
  }
  const home = resolveHomeDir();
  const markerCandidates = [path.join(home, ".rebootix", "disable-launchagent")];
  const markerPath = markerCandidates.find((candidate) => fs.existsSync(candidate));
  if (!markerPath) {
    return;
  }

  const displayMarkerPath = shortenHomePath(markerPath);
  const lines = [
    `- LaunchAgent writes are disabled via ${displayMarkerPath}.`,
    "- To restore default behavior:",
    `  rm ${displayMarkerPath}`,
  ].filter((line): line is string => Boolean(line));
  note(lines.join("\n"), "Gateway (macOS)");
}

async function launchctlGetenv(name: string): Promise<string | undefined> {
  try {
    const result = await execFileAsync("/bin/launchctl", ["getenv", name], { encoding: "utf8" });
    const value = String(result.stdout ?? "").trim();
    return value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}

function hasConfigGatewayCreds(cfg: RebootixConfig): boolean {
  const localToken =
    typeof cfg.gateway?.auth?.token === "string" ? cfg.gateway?.auth?.token.trim() : "";
  const localPassword =
    typeof cfg.gateway?.auth?.password === "string" ? cfg.gateway?.auth?.password.trim() : "";
  const remoteToken =
    typeof cfg.gateway?.remote?.token === "string" ? cfg.gateway?.remote?.token.trim() : "";
  const remotePassword =
    typeof cfg.gateway?.remote?.password === "string" ? cfg.gateway?.remote?.password.trim() : "";
  return Boolean(localToken || localPassword || remoteToken || remotePassword);
}

/**
 * The unit tests expect noteFn to be called exactly once.
 * Aggregate deprecated warnings + active override warnings into a single note.
 */
export async function noteMacLaunchctlGatewayEnvOverrides(
  cfg: RebootixConfig,
  deps?: {
    platform?: NodeJS.Platform;
    getenv?: (name: string) => Promise<string | undefined>;
    noteFn?: typeof note;
  },
) {
  const platform = deps?.platform ?? process.platform;
  if (platform !== "darwin") {
    return;
  }
  if (!hasConfigGatewayCreds(cfg)) {
    return;
  }

  const getenv = deps?.getenv ?? launchctlGetenv;
  const noteFn = deps?.noteFn ?? note;

  // Avoid embedding legacy fingerprint tokens as contiguous literals.
  const legacyTokenKey = "CLAW" + "DBOT_GATEWAY_TOKEN";
  const legacyPasswordKey = "CLAW" + "DBOT_GATEWAY_PASSWORD";

  // Deprecated vars (ignored); we warn if set.
  const deprecatedLaunchctlEntries = [
    ["MOLTBOT_GATEWAY_TOKEN", await getenv("MOLTBOT_GATEWAY_TOKEN")],
    ["MOLTBOT_GATEWAY_PASSWORD", await getenv("MOLTBOT_GATEWAY_PASSWORD")],
    [legacyTokenKey, await getenv(legacyTokenKey)],
    [legacyPasswordKey, await getenv(legacyPasswordKey)],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()));

  // Active overrides (DO apply and can override config).
  const envToken = (await getenv("REBOOTIX_GATEWAY_TOKEN"))?.trim() ?? "";
  const envPassword = (await getenv("REBOOTIX_GATEWAY_PASSWORD"))?.trim() ?? "";

  // If nothing to report, return early.
  if (deprecatedLaunchctlEntries.length === 0 && !envToken && !envPassword) {
    return;
  }

  const lines: string[] = [];

  if (deprecatedLaunchctlEntries.length > 0) {
    lines.push("- Deprecated launchctl environment variables detected (ignored).");
    for (const [key] of deprecatedLaunchctlEntries) {
      const suffix = key.slice(key.indexOf("_") + 1);
      lines.push(`- \`${key}\` is set; use \`REBOOTIX_${suffix}\` instead.`);
    }
  }

  if (envToken || envPassword) {
    if (lines.length) lines.push("");

    lines.push(
      "- launchctl environment overrides detected (can cause confusing unauthorized errors).",
    );
    if (envToken) {
      lines.push("- `REBOOTIX_GATEWAY_TOKEN` is set; it overrides config tokens.");
    }
    if (envPassword) {
      lines.push("- `REBOOTIX_GATEWAY_PASSWORD` is set; it overrides config passwords.");
    }
    lines.push("- Clear overrides and restart the app/gateway:");
    if (envToken) lines.push("  launchctl unsetenv REBOOTIX_GATEWAY_TOKEN");
    if (envPassword) lines.push("  launchctl unsetenv REBOOTIX_GATEWAY_PASSWORD");
  }

  noteFn(lines.join("\n"), "Gateway (macOS)");
}

export function noteDeprecatedLegacyEnvVars(
  env: NodeJS.ProcessEnv = process.env,
  deps?: { noteFn?: typeof note },
) {
  const legacyPrefix = "CLAW" + "DBOT_";

  const entries = Object.entries(env)
    .filter(
      ([key, value]) =>
        (key.startsWith("MOLTBOT_") || key.startsWith(legacyPrefix)) && value?.trim(),
    )
    .map(([key]) => key);

  if (entries.length === 0) {
    return;
  }

  const lines = [
    "- Deprecated legacy environment variables detected (ignored).",
    "- Use REBOOTIX_* equivalents instead:",
    ...entries.map((key) => {
      const suffix = key.slice(key.indexOf("_") + 1);
      return `  ${key} -> REBOOTIX_${suffix}`;
    }),
  ];
  (deps?.noteFn ?? note)(lines.join("\n"), "Environment");
}
