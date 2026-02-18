/**
 * Tests for CLI commands — output module and command functions.
 *
 * Tests the data extraction logic and output formatting for
 * tags, kv, links, and view commands.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { setOutputOptions, getOutputOptions } from "../src/output.js";

describe("output module", () => {
  beforeEach(() => {
    // Reset to defaults
    setOutputOptions({ mode: "formatted", noColor: false, quiet: false });
  });

  it("sets and gets output options", () => {
    setOutputOptions({ mode: "json", quiet: true });
    const opts = getOutputOptions();
    expect(opts.mode).toBe("json");
    expect(opts.quiet).toBe(true);
  });

  it("defaults to formatted mode", () => {
    const opts = getOutputOptions();
    expect(opts.mode).toBe("formatted");
    expect(opts.noColor).toBe(false);
    expect(opts.quiet).toBe(false);
  });

  it("supports all output modes", () => {
    for (const mode of ["formatted", "json", "plain"] as const) {
      setOutputOptions({ mode });
      expect(getOutputOptions().mode).toBe(mode);
    }
  });
});

describe("version command", () => {
  it("exports getPackageVersion", async () => {
    const { getPackageVersion } = await import("../src/commands/version.js");
    const version = getPackageVersion();
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
