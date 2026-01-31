import { describe, expect, it } from "vitest";

import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it("detects help/version flags", () => {
    expect(hasHelpOrVersion(["node", "rebootix", "--help"])).toBe(true);
    expect(hasHelpOrVersion(["node", "rebootix", "-V"])).toBe(true);
    expect(hasHelpOrVersion(["node", "rebootix", "status"])).toBe(false);
  });

  it("extracts command path ignoring flags and terminator", () => {
    expect(getCommandPath(["node", "rebootix", "status", "--json"], 2)).toEqual(["status"]);
    expect(getCommandPath(["node", "rebootix", "agents", "list"], 2)).toEqual(["agents", "list"]);
    expect(getCommandPath(["node", "rebootix", "status", "--", "ignored"], 2)).toEqual(["status"]);
  });

  it("returns primary command", () => {
    expect(getPrimaryCommand(["node", "rebootix", "agents", "list"])).toBe("agents");
    expect(getPrimaryCommand(["node", "rebootix"])).toBeNull();
  });

  it("parses boolean flags and ignores terminator", () => {
    expect(hasFlag(["node", "rebootix", "status", "--json"], "--json")).toBe(true);
    expect(hasFlag(["node", "rebootix", "--", "--json"], "--json")).toBe(false);
  });

  it("extracts flag values with equals and missing values", () => {
    expect(getFlagValue(["node", "rebootix", "status", "--timeout", "5000"], "--timeout")).toBe(
      "5000",
    );
    expect(getFlagValue(["node", "rebootix", "status", "--timeout=2500"], "--timeout")).toBe(
      "2500",
    );
    expect(getFlagValue(["node", "rebootix", "status", "--timeout"], "--timeout")).toBeNull();
    expect(getFlagValue(["node", "rebootix", "status", "--timeout", "--json"], "--timeout")).toBe(
      null,
    );
    expect(getFlagValue(["node", "rebootix", "--", "--timeout=99"], "--timeout")).toBeUndefined();
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "rebootix", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "rebootix", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "rebootix", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it("parses positive integer flag values", () => {
    expect(getPositiveIntFlagValue(["node", "rebootix", "status"], "--timeout")).toBeUndefined();
    expect(
      getPositiveIntFlagValue(["node", "rebootix", "status", "--timeout"], "--timeout"),
    ).toBeNull();
    expect(
      getPositiveIntFlagValue(["node", "rebootix", "status", "--timeout", "5000"], "--timeout"),
    ).toBe(5000);
    expect(
      getPositiveIntFlagValue(["node", "rebootix", "status", "--timeout", "nope"], "--timeout"),
    ).toBeUndefined();
  });

  it("builds parse argv from raw args", () => {
    const nodeArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["node", "rebootix", "status"],
    });
    expect(nodeArgv).toEqual(["node", "rebootix", "status"]);

    const versionedNodeArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["node-22", "rebootix", "status"],
    });
    expect(versionedNodeArgv).toEqual(["node-22", "rebootix", "status"]);

    const versionedNodeWindowsArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["node-22.2.0.exe", "rebootix", "status"],
    });
    expect(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "rebootix", "status"]);

    const versionedNodePatchlessArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["node-22.2", "rebootix", "status"],
    });
    expect(versionedNodePatchlessArgv).toEqual(["node-22.2", "rebootix", "status"]);

    const versionedNodeWindowsPatchlessArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["node-22.2.exe", "rebootix", "status"],
    });
    expect(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "rebootix", "status"]);

    const versionedNodeWithPathArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["/usr/bin/node-22.2.0", "rebootix", "status"],
    });
    expect(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "rebootix", "status"]);

    const nodejsArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["nodejs", "rebootix", "status"],
    });
    expect(nodejsArgv).toEqual(["nodejs", "rebootix", "status"]);

    const nonVersionedNodeArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["node-dev", "rebootix", "status"],
    });
    expect(nonVersionedNodeArgv).toEqual(["node", "rebootix", "node-dev", "rebootix", "status"]);

    const directArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["rebootix", "status"],
    });
    expect(directArgv).toEqual(["node", "rebootix", "status"]);

    const bunArgv = buildParseArgv({
      programName: "rebootix",
      rawArgs: ["bun", "src/entry.ts", "status"],
    });
    expect(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "rebootix",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "rebootix", "status"]);
  });

  it("decides when to migrate state", () => {
    expect(shouldMigrateState(["node", "rebootix", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "rebootix", "health"])).toBe(false);
    expect(shouldMigrateState(["node", "rebootix", "sessions"])).toBe(false);
    expect(shouldMigrateState(["node", "rebootix", "memory", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "rebootix", "agent", "--message", "hi"])).toBe(false);
    expect(shouldMigrateState(["node", "rebootix", "agents", "list"])).toBe(true);
    expect(shouldMigrateState(["node", "rebootix", "message", "send"])).toBe(true);
  });

  it("reuses command path for migrate state decisions", () => {
    expect(shouldMigrateStateFromPath(["status"])).toBe(false);
    expect(shouldMigrateStateFromPath(["agents", "list"])).toBe(true);
  });
});
