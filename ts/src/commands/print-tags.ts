/**
 * Tags command — extracts and displays #tags from a mindmap file.
 *
 * Subcommand: mdbub tags <file> [--json] [--plain]
 *
 * clig.dev: stdout for data, stderr for messages, --json/--plain for composability.
 */

import chalk from "chalk";
import { readFileSync } from "node:fs";
import { parseMarkdownToMindmap } from "../core/parser.js";
import type { MindMapNode } from "../core/mindmap.js";
import { out, outJson, outPlain, msg, getOutputOptions } from "../output.js";

/** Recursively collect all tags from a mindmap tree. */
function collectTags(node: MindMapNode): Map<string, string[]> {
  const tagMap = new Map<string, string[]>();

  function walk(n: MindMapNode): void {
    for (const tag of n.getTags()) {
      const nodes = tagMap.get(tag) ?? [];
      nodes.push(n.label);
      tagMap.set(tag, nodes);
    }
    for (const child of n.children) {
      walk(child);
    }
  }

  walk(node);
  return tagMap;
}

// Column widths for formatted table output
const TAG_COL_WIDTH = 24;
// chalk.yellow adds ~10 chars of ANSI escape codes, so pad to TAG_COL_WIDTH + 10
const TAG_COL_PAD = TAG_COL_WIDTH + 10;

export function runTags(filePath: string): void {
  const content = readFileSync(filePath, "utf-8");
  const root = parseMarkdownToMindmap(content);
  const tagMap = collectTags(root);
  const { mode } = getOutputOptions();

  if (tagMap.size === 0) {
    msg("No tags found.");
    return;
  }

  const sorted = [...tagMap.entries()].sort();

  if (mode === "json") {
    outJson(sorted.map(([tag, nodes]) => ({ tag, nodes })));
    return;
  }

  if (mode === "plain") {
    outPlain(["tag", "nodes"], sorted.map(([tag, nodes]) => [tag, nodes.join(",")]));
    return;
  }

  out(chalk.bold("TAGS") + chalk.dim(` (${filePath})`));
  out("");
  out(chalk.dim("  " + "Tag".padEnd(TAG_COL_WIDTH) + "Nodes"));
  out(chalk.dim("  " + "─".repeat(56)));
  for (const [tag, nodes] of sorted) {
    out(`  ${chalk.yellow("#" + tag).padEnd(TAG_COL_PAD)}${nodes.join(", ")}`);
  }
  out("");
}
