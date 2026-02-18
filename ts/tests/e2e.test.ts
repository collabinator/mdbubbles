/**
 * End-to-end tests for the mdbub CLI.
 *
 * These tests execute the actual CLI as a child process, validating:
 * - Every subcommand works correctly
 * - All output modes (formatted, --json, --plain) produce correct output
 * - Exit codes follow clig.dev conventions (0 success, 1 user error)
 * - stdout/stderr separation (data vs messages)
 * - Error messages are empathetic and include suggestions
 * - Global flags (--no-color, --quiet, --version, --help)
 * - Deep link argument parsing
 * - Each example mindmap file works
 */

import { describe, it, expect } from "vitest";
import { runCli, fixture } from "./helpers/run-cli.js";

// ── Fixture paths ────────────────────────────────────────────────────

const SIMPLEMAP = fixture("examples/mindmaps/simplemap.md");
const SIMPLEMAP2 = fixture("examples/mindmaps/simplemap2.md");
const LINK_EXAMPLE = fixture("examples/mindmaps/link_example.md");
const TECH_IDEA_MAP = fixture("examples/mindmaps/mdbub_tech_idea_map.md");
const KV_EXAMPLE = fixture("examples/mindmaps/mdbub_kv_example.md");

// ── Help & no-args behavior ──────────────────────────────────────────

describe("e2e: help and no-args", () => {
  it("shows help when run with no arguments", async () => {
    const result = await runCli([]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("mdbub");
    expect(result.stdout).toContain("Commands:");
    expect(result.stdout).toContain("tags");
    expect(result.stdout).toContain("view");
  });

  it("shows help with --help flag", async () => {
    const result = await runCli(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("A mindmap tool for your terminal");
    expect(result.stdout).toContain("Examples:");
    expect(result.stdout).toContain("Feedback:");
  });

  it("shows help with -h flag", async () => {
    const result = await runCli(["-h"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Commands:");
  });

  it("shows subcommand help with tags --help", async () => {
    const result = await runCli(["tags", "--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("List all #tags");
  });

  it("shows subcommand help with view --help", async () => {
    const result = await runCli(["view", "--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Display the mindmap tree");
  });
});

// ── Version ──────────────────────────────────────────────────────────

describe("e2e: version", () => {
  it("outputs version with -V flag", async () => {
    const result = await runCli(["-V"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("outputs version with version subcommand", async () => {
    const result = await runCli(["version"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("mdbub");
    expect(result.stdout).toMatch(/\d+\.\d+\.\d+/);
  });

  it("outputs version as JSON", async () => {
    const result = await runCli(["--json", "version"]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(data).toHaveProperty("name", "mdbub");
    expect(data).toHaveProperty("version");
    expect(data).toHaveProperty("runtime", "node");
    expect(data).toHaveProperty("nodeVersion");
    expect(data.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("outputs version as plain text", async () => {
    const result = await runCli(["--plain", "version"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

// ── About ────────────────────────────────────────────────────────────

describe("e2e: about", () => {
  it("displays project information", async () => {
    const result = await runCli(["about"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("mdbub");
    expect(result.stdout).toContain("mindmap");
    expect(result.stdout).toContain("Apache-2.0");
    expect(result.stdout).toContain("github.com/collabinator/mdbubbles");
  });
});

// ── Tags command ─────────────────────────────────────────────────────

describe("e2e: tags", () => {
  it("lists tags in formatted mode", async () => {
    const result = await runCli(["tags", TECH_IDEA_MAP]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("TAGS");
    expect(result.stdout).toContain("cool");
    expect(result.stdout).toContain("here");
  });

  it("lists tags as JSON", async () => {
    const result = await runCli(["--json", "tags", TECH_IDEA_MAP]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    for (const entry of data) {
      expect(entry).toHaveProperty("tag");
      expect(entry).toHaveProperty("nodes");
      expect(Array.isArray(entry.nodes)).toBe(true);
    }
  });

  it("lists tags as plain text (pipe-friendly)", async () => {
    const result = await runCli(["--plain", "tags", TECH_IDEA_MAP]);
    expect(result.exitCode).toBe(0);
    const lines = result.stdout.trim().split("\n");
    // First line is headers
    expect(lines[0]).toContain("tag");
    expect(lines[0]).toContain("nodes");
    // Data lines are tab-separated
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines.slice(1)) {
      expect(line).toContain("\t");
    }
  });

  it("shows message on stderr when no tags found", async () => {
    const result = await runCli(["tags", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain("No tags found");
    // stdout should be empty since there's no data
    expect(result.stdout.trim()).toBe("");
  });
});

// ── KV command ───────────────────────────────────────────────────────

describe("e2e: kv", () => {
  it("lists metadata in formatted mode", async () => {
    const result = await runCli(["kv", KV_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("METADATA");
    expect(result.stdout).toContain("owner");
    expect(result.stdout).toContain("priority");
  });

  it("lists metadata as JSON", async () => {
    const result = await runCli(["--json", "kv", KV_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    for (const entry of data) {
      expect(entry).toHaveProperty("line");
      expect(entry).toHaveProperty("node");
      expect(typeof entry.line).toBe("number");
    }
    // Verify some expected data
    const firstWithOwner = data.find(
      (e: Record<string, unknown>) => e.owner,
    );
    expect(firstWithOwner).toBeDefined();
  });

  it("lists metadata as plain text", async () => {
    const result = await runCli(["--plain", "kv", KV_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    const lines = result.stdout.trim().split("\n");
    expect(lines[0]).toContain("line");
    expect(lines[0]).toContain("node");
    expect(lines.length).toBeGreaterThan(1);
  });

  it("shows message on stderr when no metadata found", async () => {
    const result = await runCli(["kv", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain("No @key:value metadata found");
  });
});

// ── Links command ────────────────────────────────────────────────────

describe("e2e: links", () => {
  it("lists links in formatted mode", async () => {
    const result = await runCli(["links", LINK_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("LINKS");
    expect(result.stdout).toContain("system/architecture");
    expect(result.stdout).toContain("product/api-design");
  });

  it("lists links as JSON", async () => {
    const result = await runCli(["--json", "links", LINK_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    for (const entry of data) {
      expect(entry).toHaveProperty("node");
      expect(entry).toHaveProperty("id");
    }
    const ids = data.map((e: { id: string }) => e.id);
    expect(ids).toContain("system/architecture");
    expect(ids).toContain("product/api-design");
  });

  it("lists links as plain text", async () => {
    const result = await runCli(["--plain", "links", LINK_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    const lines = result.stdout.trim().split("\n");
    expect(lines[0]).toContain("id");
    expect(lines[0]).toContain("node");
    expect(lines.length).toBeGreaterThan(1);
  });

  it("shows message on stderr when no links found", async () => {
    const result = await runCli(["links", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain("No [id:...] links found");
  });
});

// ── View command ─────────────────────────────────────────────────────

describe("e2e: view", () => {
  it("displays tree in formatted mode", async () => {
    const result = await runCli(["view", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("MINDMAP");
    expect(result.stdout).toContain("root of things");
    // ASCII tree connectors
    expect(result.stdout).toContain("├─");
    expect(result.stdout).toContain("└─");
  });

  it("displays tree as JSON", async () => {
    const result = await runCli(["--json", "view", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(data).toHaveProperty("label");
    expect(data).toHaveProperty("children");
    expect(Array.isArray(data.children)).toBe(true);
    expect(data.children.length).toBeGreaterThan(0);
  });

  it("displays tree as plain text", async () => {
    const result = await runCli(["--plain", "view", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("root of things");
    expect(result.stdout).toContain("├─");
    expect(result.stdout).toContain("└─");
    // No header in plain mode
    expect(result.stdout).not.toContain("MINDMAP");
  });

  it("preserves tree hierarchy in output", async () => {
    const result = await runCli(["--json", "view", SIMPLEMAP]);
    const data = JSON.parse(result.stdout);
    // Check nested structure
    const child2 = data.children.find(
      (c: { label: string }) => c.label.includes("child 2"),
    );
    expect(child2).toBeDefined();
    expect(child2.children.length).toBeGreaterThan(0);
  });
});

// ── Error handling ───────────────────────────────────────────────────

describe("e2e: error handling", () => {
  it("exits with code 1 when file not found", async () => {
    const result = await runCli(["tags", "/nonexistent/file.md"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Error:");
    expect(result.stderr).toContain("File not found");
  });

  it("provides helpful suggestion when file not found", async () => {
    const result = await runCli(["view", "/nonexistent/ideas.md"]);
    expect(result.exitCode).toBe(1);
    // clig.dev: suggest what to do next
    expect(result.stderr).toContain("mdbub");
  });

  it("shows help on unknown subcommand", async () => {
    const result = await runCli(["nonexistent-command"]);
    // Commander shows help or error for unknown commands
    expect(result.stderr.length + result.stdout.length).toBeGreaterThan(0);
  });
});

// ── Global flags ─────────────────────────────────────────────────────

describe("e2e: global flags", () => {
  it("--quiet suppresses stderr messages", async () => {
    const result = await runCli(["-q", "tags", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    // The "No tags found" message should be suppressed
    expect(result.stderr).toBe("");
  });

  it("--no-color produces output without ANSI codes", async () => {
    const result = await runCli(["--no-color", "view", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    // ANSI escape codes start with \x1b[
    expect(result.stdout).not.toMatch(/\x1b\[/);
  });

  it("NO_COLOR env var disables colors", async () => {
    const result = await runCli(["view", SIMPLEMAP], { NO_COLOR: "1" });
    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toMatch(/\x1b\[/);
  });
});

// ── stdout/stderr separation ─────────────────────────────────────────

describe("e2e: stdout/stderr separation", () => {
  it("sends data to stdout in formatted mode", async () => {
    const result = await runCli(["view", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("root of things");
  });

  it("sends data to stdout in JSON mode", async () => {
    const result = await runCli(["--json", "tags", TECH_IDEA_MAP]);
    expect(result.exitCode).toBe(0);
    // stdout should be valid JSON
    expect(() => JSON.parse(result.stdout)).not.toThrow();
  });

  it("sends error messages to stderr, not stdout", async () => {
    const result = await runCli(["tags", "/nonexistent.md"]);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Error:");
    // stdout should not contain the error
    expect(result.stdout).not.toContain("Error:");
  });

  it("sends 'no data found' messages to stderr", async () => {
    const result = await runCli(["links", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toContain("No [id:...] links found");
    expect(result.stdout.trim()).toBe("");
  });
});

// ── JSON output validation ──────────────────────────────────────────

describe("e2e: JSON output is always valid", () => {
  it("tags --json produces valid JSON", async () => {
    const result = await runCli(["--json", "tags", TECH_IDEA_MAP]);
    expect(() => JSON.parse(result.stdout)).not.toThrow();
  });

  it("kv --json produces valid JSON", async () => {
    const result = await runCli(["--json", "kv", KV_EXAMPLE]);
    expect(() => JSON.parse(result.stdout)).not.toThrow();
  });

  it("links --json produces valid JSON", async () => {
    const result = await runCli(["--json", "links", LINK_EXAMPLE]);
    expect(() => JSON.parse(result.stdout)).not.toThrow();
  });

  it("view --json produces valid JSON", async () => {
    const result = await runCli(["--json", "view", SIMPLEMAP]);
    expect(() => JSON.parse(result.stdout)).not.toThrow();
  });

  it("version --json produces valid JSON", async () => {
    const result = await runCli(["--json", "version"]);
    expect(() => JSON.parse(result.stdout)).not.toThrow();
  });
});

// ── Deep link parsing ────────────────────────────────────────────────

describe("e2e: deep links", () => {
  it("parses file#path deep link in JSON mode", async () => {
    const result = await runCli([
      "--json",
      LINK_EXAMPLE + "#product/api-design",
    ]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(data).toHaveProperty("file");
    expect(data).toHaveProperty("deepLink", "product/api-design");
    expect(data.file).toContain("link_example.md");
  });

  it("handles file without deep link", async () => {
    const result = await runCli(["--json", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(data).toHaveProperty("file");
    expect(data).toHaveProperty("deepLink", null);
  });
});

// ── Example files integration ────────────────────────────────────────

describe("e2e: example mindmap files", () => {
  it("simplemap.md: view produces valid tree", async () => {
    const result = await runCli(["--json", "view", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(data.label).toContain("root of things");
    expect(data.children.length).toBe(4);
  });

  it("simplemap2.md: view produces valid tree", async () => {
    const result = await runCli(["--json", "view", SIMPLEMAP2]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(data).toHaveProperty("label");
    expect(data).toHaveProperty("children");
  });

  it("link_example.md: links command finds all anchors", async () => {
    const result = await runCli(["--json", "links", LINK_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    const ids = data.map((e: { id: string }) => e.id);
    expect(ids).toContain("system/architecture");
    expect(ids).toContain("system/cache");
    expect(ids).toContain("system/gpu");
    expect(ids).toContain("product");
    expect(ids).toContain("product/search");
    expect(ids).toContain("product/api-design");
  });

  it("mdbub_kv_example.md: kv command extracts all metadata", async () => {
    const result = await runCli(["--json", "kv", KV_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(data.length).toBe(10); // 10 nodes with metadata
    // Verify key names
    const allKeys = new Set(data.flatMap((e: Record<string, unknown>) => Object.keys(e)));
    expect(allKeys).toContain("owner");
    expect(allKeys).toContain("priority");
    expect(allKeys).toContain("status");
  });

  it("mdbub_tech_idea_map.md: tags command finds tags", async () => {
    const result = await runCli(["--json", "tags", TECH_IDEA_MAP]);
    expect(result.exitCode).toBe(0);
    const data = JSON.parse(result.stdout);
    const tags = data.map((e: { tag: string }) => e.tag);
    expect(tags).toContain("cool");
    expect(tags).toContain("here");
  });

  it("all example files: view --json produces valid output", async () => {
    for (const file of [SIMPLEMAP, SIMPLEMAP2, LINK_EXAMPLE, TECH_IDEA_MAP, KV_EXAMPLE]) {
      const result = await runCli(["--json", "view", file]);
      expect(result.exitCode).toBe(0);
      const data = JSON.parse(result.stdout);
      expect(data).toHaveProperty("label");
      expect(data).toHaveProperty("children");
    }
  });
});

// ── Plain output composability ──────────────────────────────────────

describe("e2e: plain output composability", () => {
  it("tags --plain is tab-separated with header", async () => {
    const result = await runCli(["--plain", "tags", TECH_IDEA_MAP]);
    expect(result.exitCode).toBe(0);
    const lines = result.stdout.trim().split("\n");
    const header = lines[0].split("\t");
    expect(header).toContain("tag");
    expect(header).toContain("nodes");
    // All lines have same number of columns
    const cols = header.length;
    for (const line of lines) {
      expect(line.split("\t").length).toBe(cols);
    }
  });

  it("kv --plain is tab-separated with header", async () => {
    const result = await runCli(["--plain", "kv", KV_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    const lines = result.stdout.trim().split("\n");
    const header = lines[0].split("\t");
    expect(header).toContain("line");
    expect(header).toContain("node");
  });

  it("links --plain is tab-separated with header", async () => {
    const result = await runCli(["--plain", "links", LINK_EXAMPLE]);
    expect(result.exitCode).toBe(0);
    const lines = result.stdout.trim().split("\n");
    const header = lines[0].split("\t");
    expect(header).toContain("id");
    expect(header).toContain("node");
  });

  it("plain output has no ANSI escape codes", async () => {
    const result = await runCli(["--plain", "view", SIMPLEMAP]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toMatch(/\x1b\[/);
  });
});
