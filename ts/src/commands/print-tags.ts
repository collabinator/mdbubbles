/**
 * Print tags command — extracts and displays #tags from a mindmap file.
 *
 * Ported from Python: src/mdbub/commands/print_tags.py
 */

import chalk from "chalk";
import { readFileSync } from "node:fs";
import { parseMarkdownToMindmap } from "../core/parser.js";
import type { MindMapNode } from "../core/mindmap.js";

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

export function printTags(filePath: string): void {
  const content = readFileSync(filePath, "utf-8");
  const root = parseMarkdownToMindmap(content);
  const tagMap = collectTags(root);

  if (tagMap.size === 0) {
    console.log(chalk.dim("No tags found."));
    return;
  }

  console.log(chalk.bold.cyan("\n  Tags\n"));
  console.log(
    chalk.dim("  " + "Tag".padEnd(24) + "Nodes"),
  );
  console.log(chalk.dim("  " + "─".repeat(48)));

  for (const [tag, nodes] of [...tagMap.entries()].sort()) {
    console.log(
      `  ${chalk.yellow("#" + tag).padEnd(24 + 10)}${chalk.white(nodes.join(", "))}`,
    );
  }
  console.log();
}
