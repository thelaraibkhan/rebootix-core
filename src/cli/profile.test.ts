import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "rebootix",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "rebootix", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "rebootix", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "rebootix", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "rebootix", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "rebootix", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "rebootix", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (dev first)", () => {
    const res = parseCliProfileArgs(["node", "rebootix", "--dev", "--profile", "work", "status"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (profile first)", () => {
    const res = parseCliProfileArgs(["node", "rebootix", "--profile", "work", "--dev", "status"]);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join("/home/peter", ".rebootix-dev");
    expect(env.REBOOTIX_PROFILE).toBe("dev");
    expect(env.REBOOTIX_STATE_DIR).toBe(expectedStateDir);
    expect(env.REBOOTIX_CONFIG_PATH).toBe(path.join(expectedStateDir, "rebootix.json"));
    expect(env.REBOOTIX_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      REBOOTIX_STATE_DIR: "/custom",
      REBOOTIX_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.REBOOTIX_STATE_DIR).toBe("/custom");
    expect(env.REBOOTIX_GATEWAY_PORT).toBe("19099");
    expect(env.REBOOTIX_CONFIG_PATH).toBe(path.join("/custom", "rebootix.json"));
  });
});

describe("formatCliCommand", () => {
  it("returns command unchanged when no profile is set", () => {
    expect(formatCliCommand("rebootix doctor --fix", {})).toBe("rebootix doctor --fix");
  });

  it("returns command unchanged when profile is default", () => {
    expect(formatCliCommand("rebootix doctor --fix", { REBOOTIX_PROFILE: "default" })).toBe(
      "rebootix doctor --fix",
    );
  });

  it("returns command unchanged when profile is Default (case-insensitive)", () => {
    expect(formatCliCommand("rebootix doctor --fix", { REBOOTIX_PROFILE: "Default" })).toBe(
      "rebootix doctor --fix",
    );
  });

  it("returns command unchanged when profile is invalid", () => {
    expect(formatCliCommand("rebootix doctor --fix", { REBOOTIX_PROFILE: "bad profile" })).toBe(
      "rebootix doctor --fix",
    );
  });

  it("returns command unchanged when --profile is already present", () => {
    expect(
      formatCliCommand("rebootix --profile work doctor --fix", { REBOOTIX_PROFILE: "work" }),
    ).toBe("rebootix --profile work doctor --fix");
  });

  it("returns command unchanged when --dev is already present", () => {
    expect(formatCliCommand("rebootix --dev doctor", { REBOOTIX_PROFILE: "dev" })).toBe(
      "rebootix --dev doctor",
    );
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("rebootix doctor --fix", { REBOOTIX_PROFILE: "work" })).toBe(
      "rebootix --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("rebootix doctor --fix", { REBOOTIX_PROFILE: "  jbrebootix  " })).toBe(
      "rebootix --profile jbrebootix doctor --fix",
    );
  });

  it("handles command with no args after rebootix", () => {
    expect(formatCliCommand("rebootix", { REBOOTIX_PROFILE: "test" })).toBe(
      "rebootix --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm rebootix doctor", { REBOOTIX_PROFILE: "work" })).toBe(
      "pnpm rebootix --profile work doctor",
    );
  });
});
