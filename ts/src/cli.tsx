/**
 * mdbub CLI entry point.
 *
 * Redesigned following clig.dev (Command Line Interface Guidelines):
 * - Subcommand architecture: mdbub <command> <file> [flags]
 * - stdout for data, stderr for messages/errors
 * - --json / --plain for machine-readable output
 * - --no-color, NO_COLOR env var, TTY detection
 * - Empathetic error messages with suggestions
 * - Help text leads with examples
 * - Proper exit codes: 0 success, 1 user error, 2 internal error
 *
 * See: docs/adr/0004-cli-redesign-clig-dev.md
 */

import { Command } from "commander";
import { existsSync } from "node:fs";

import { setOutputOptions, err, type OutputMode } from "./output.js";
import { getPackageVersion, runVersion } from "./commands/version.js";
import { runAbout } from "./commands/about.js";
import { runTags } from "./commands/print-tags.js";
import { runKv } from "./commands/print-kv.js";
import { runLinks } from "./commands/print-links.js";
import { runView } from "./commands/view.js";

// ── Helpers ──────────────────────────────────────────────────────────

/** Resolve output mode from CLI flags. */
function resolveOutputMode(opts: Record<string, unknown>): OutputMode {
  if (opts.json) return "json";
  if (opts.plain) return "plain";
  return "formatted";
}

/** Apply global flags (--json, --plain, --no-color, --quiet) to output system. */
function applyGlobalFlags(opts: Record<string, unknown>): void {
  setOutputOptions({
    mode: resolveOutputMode(opts),
    noColor: !!opts.noColor,
    quiet: !!opts.quiet,
  });
}

/** Validate that a file argument was provided and exists. Returns true if valid. */
function requireFile(file: string | undefined, command: string): file is string {
  if (!file) {
    err(
      "Missing required argument: <file>",
      `  Usage: mdbub ${command} <file>\n  Example: mdbub ${command} ideas.md`,
    );
    process.exit(1);
  }
  if (!existsSync(file)) {
    err(
      `File not found: '${file}'`,
      `  Make sure the file exists, or create a new mindmap:\n  mdbub ${file}`,
    );
    process.exit(1);
  }
  return true;
}

// ── Program ──────────────────────────────────────────────────────────

const program = new Command();

program
  .name("mdbub")
  .description("A mindmap tool for your terminal")
  .version(getPackageVersion(), "-V, --version")
  .option("--json", "Output as JSON")
  .option("--plain", "Output as plain text (no formatting)")
  .option("--no-color", "Disable color output")
  .option("-q, --quiet", "Suppress non-essential output")
  .addHelpText(
    "after",
    `
Examples:
  $ mdbub ideas.md                  Open a mindmap for editing
  $ mdbub ideas.md#design/api       Jump to a node via deep link
  $ mdbub tags ideas.md             List all tags
  $ mdbub kv ideas.md --json        List metadata as JSON
  $ mdbub view ideas.md             Display the tree
  $ mdbub links ideas.md --plain    List links (pipe-friendly)

Feedback:
  https://github.com/collabinator/mdbubbles/issues`,
  );

// ── Subcommand: tags ─────────────────────────────────────────────────

program
  .command("tags")
  .description("List all #tags in a mindmap file")
  .argument("<file>", "Markdown mindmap file")
  .action((file: string) => {
    applyGlobalFlags(program.opts());
    if (requireFile(file, "tags")) {
      runTags(file);
    }
  });

// ── Subcommand: kv ───────────────────────────────────────────────────

program
  .command("kv")
  .description("List all @key:value metadata in a mindmap file")
  .argument("<file>", "Markdown mindmap file")
  .action((file: string) => {
    applyGlobalFlags(program.opts());
    if (requireFile(file, "kv")) {
      runKv(file);
    }
  });

// ── Subcommand: links ────────────────────────────────────────────────

program
  .command("links")
  .description("List all [id:...] anchors in a mindmap file")
  .argument("<file>", "Markdown mindmap file")
  .action((file: string) => {
    applyGlobalFlags(program.opts());
    if (requireFile(file, "links")) {
      runLinks(file);
    }
  });

// ── Subcommand: view ─────────────────────────────────────────────────

program
  .command("view")
  .description("Display the mindmap tree")
  .argument("<file>", "Markdown mindmap file")
  .action((file: string) => {
    applyGlobalFlags(program.opts());
    if (requireFile(file, "view")) {
      runView(file);
    }
  });

// ── Subcommand: version ──────────────────────────────────────────────

program
  .command("version")
  .description("Show version information")
  .action(() => {
    applyGlobalFlags(program.opts());
    runVersion();
  });

// ── Subcommand: about ────────────────────────────────────────────────

program
  .command("about")
  .description("Show project information")
  .action(() => {
    applyGlobalFlags(program.opts());
    runAbout();
  });

// ── Default action: open file (or show help) ─────────────────────────

program
  .argument("[file]", "Markdown mindmap file to open (append #path for deep link)")
  .action((file: string | undefined) => {
    applyGlobalFlags(program.opts());

    if (!file) {
      // clig.dev: display concise help when run with no args
      program.help();
      return;
    }

    // Support deep links: filename.md#path/to/node
    let filePath = file;
    let deepLink: string | undefined;

    if (file.includes("#")) {
      const parts = file.split("#");
      filePath = parts[0];
      deepLink = parts[1]?.replace(/^\/+|\/+$/g, "") || undefined;
    }

    // clig.dev: tell the user what's happening
    const { mode } = { mode: resolveOutputMode(program.opts()) };
    if (mode === "json") {
      // Useful for tooling to check what file/link would be opened
      process.stdout.write(
        JSON.stringify({ file: filePath, deepLink: deepLink ?? null }, null, 2) + "\n",
      );
      return;
    }

    process.stderr.write(
      `Opening: ${filePath}${deepLink ? ` → ${deepLink}` : ""}\n`,
    );
    process.stderr.write("Quick mode (interactive editor) is planned for Phase 2.\n");
    process.stderr.write(
      "Try: mdbub view " + filePath + "  or  mdbub tags " + filePath + "\n",
    );
  });

// ── Error handling ───────────────────────────────────────────────────

program.exitOverride();

try {
  program.parse();
} catch (e: unknown) {
  // Commander throws for --help / --version — let those exit cleanly
  if (e instanceof Error && "exitCode" in e) {
    const exitCode = (e as { exitCode: number }).exitCode;
    process.exit(exitCode);
  }
  // Unexpected errors
  err(
    String(e),
    "If this is a bug, please report it:\n  https://github.com/collabinator/mdbubbles/issues",
  );
  process.exit(2);
}
