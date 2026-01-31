import path from "node:path";

import { describe, expect, it } from "vitest";

import { resolveGatewayStateDir } from "./paths.js";

describe("resolveGatewayStateDir", () => {
  it("uses the default state dir when no overrides are set", () => {
    const env = { HOME: "/Users/test" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".rebootix"));
  });

  it("appends the profile suffix when set", () => {
    const env = { HOME: "/Users/test", REBOOTIX_PROFILE: "rescue" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".rebootix-rescue"));
  });

  it("treats default profiles as the base state dir", () => {
    const env = { HOME: "/Users/test", REBOOTIX_PROFILE: "Default" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".rebootix"));
  });

  it("uses REBOOTIX_STATE_DIR when provided", () => {
    const env = { HOME: "/Users/test", REBOOTIX_STATE_DIR: "/var/lib/rebootix" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/var/lib/rebootix"));
  });

  it("expands ~ in REBOOTIX_STATE_DIR", () => {
    const env = { HOME: "/Users/test", REBOOTIX_STATE_DIR: "~/rebootix-state" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/Users/test/rebootix-state"));
  });

  it("preserves Windows absolute paths without HOME", () => {
    const env = { REBOOTIX_STATE_DIR: "C:\\State\\rebootix" };
    expect(resolveGatewayStateDir(env)).toBe("C:\\State\\rebootix");
  });
});
