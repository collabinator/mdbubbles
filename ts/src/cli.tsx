/**
 * mdbub CLI entry point.
 *
 * Ported from Python: src/mdbub/cli.py
 *
 * Uses Commander for argument parsing. The interactive quick mode will use
 * Ink (React for CLI) for the terminal UI in a subsequent phase.
 */

import { Command } from "commander";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { printVersion } from "./commands/version.js";
import { printAbout } from "./commands/about.js";
import { printTags } from "./commands/print-tags.js";
import { printKv } from "./commands/print-kv.js";
import { printLinks } from "./commands/print-links.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getPackageVersion(): string {
  // Try multiple paths: development (src/) and built (dist/)
  for (const rel of ["../package.json", "../../package.json"]) {
    try {
      const pkgPath = join(__dirname, rel);
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      return pkg.version ?? "unknown";
    } catch {
      continue;
    }
  }
  return "unknown";
}

const program = new Command();

program
  .name("mdbub")
  .description(
    "mdbub: Interactive mindmap CLI tool.\n\n" +
      "Usage examples:\n" +
      "  mdbub FILE.md\n" +
      "  mdbub --print-tags FILE.md\n" +
      "  mdbub --version\n" +
      "  mdbub --about",
  )
  .version(getPackageVersion(), "-v, --version", "Show version, build info, and config path")
  .argument("[file]", "Markdown mindmap file to open or create (append #path to deep link)")
  .option("--print-tags", "Print all #tags in the file as a table and exit")
  .option("--print-kv", "Print all @key:value metadata in the file as a table and exit")
  .option("--print-links", "Print all [id:...] anchors in the file as a table and exit")
  .option("--about", "Show about info")
  .action((file: string | undefined, options: Record<string, boolean>) => {
    if (options.about) {
      printAbout();
      return;
    }

    // Handle version flag with extended info
    if (options.version) {
      printVersion();
      return;
    }

    if (!file && (options.printTags || options.printKv || options.printLinks)) {
      console.error("Error: A file argument is required with --print-tags, --print-kv, or --print-links.");
      process.exit(1);
    }

    if (file && options.printTags) {
      printTags(file);
      return;
    }

    if (file && options.printKv) {
      printKv(file);
      return;
    }

    if (file && options.printLinks) {
      printLinks(file);
      return;
    }

    // Default: quick mode (Phase 2 — not yet implemented)
    if (file) {
      // Support deep links: filename.md#path/to/node
      let filePath = file;
      let deepLink: string | undefined;

      if (file.includes("#")) {
        const parts = file.split("#");
        filePath = parts[0];
        deepLink = parts[1]?.replace(/^\/+|\/+$/g, "") || undefined;
      }

      console.log(`Opening: ${filePath}${deepLink ? ` (deep link: ${deepLink})` : ""}`);
      console.log("Quick mode (interactive editor) is planned for Phase 2.");
      console.log("Use --print-tags, --print-kv, or --print-links to inspect files.");
    } else {
      program.help();
    }
  });

program.parse();
