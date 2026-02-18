/**
 * Print links command — extracts and displays [id:...] anchors.
 *
 * Ported from Python: src/mdbub/commands/print_links.py
 */

import chalk from "chalk";
import { readFileSync } from "node:fs";
import { parseMarkdownToMindmap } from "../core/parser.js";
import type { MindMapNode } from "../core/mindmap.js";

interface LinkEntry {
  node: string;
  id: string;
}

/** Recursively collect all [id:...] links from node labels. */
function collectLinks(node: MindMapNode): LinkEntry[] {
  const entries: LinkEntry[] = [];

  function walk(n: MindMapNode): void {
    const matches = n.label.matchAll(/\[id:([\w/.-]+)\]/g);
    for (const match of matches) {
      entries.push({ node: n.label, id: match[1] });
    }
    for (const child of n.children) {
      walk(child);
    }
  }

  walk(node);
  return entries;
}

export function printLinks(filePath: string): void {
  const content = readFileSync(filePath, "utf-8");
  const root = parseMarkdownToMindmap(content);
  const entries = collectLinks(root);

  if (entries.length === 0) {
    console.log(chalk.dim("No [id:...] links found."));
    return;
  }

  console.log(chalk.bold.cyan("\n  Links\n"));
  console.log(
    chalk.dim("  " + "Node".padEnd(32) + "ID"),
  );
  console.log(chalk.dim("  " + "─".repeat(48)));

  for (const entry of entries) {
    console.log(
      `  ${chalk.white(entry.node.slice(0, 30).padEnd(32))}${chalk.yellow(entry.id)}`,
    );
  }
  console.log();
}
