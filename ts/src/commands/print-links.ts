/**
 * Links command — extracts and displays [id:...] anchors from a mindmap file.
 *
 * Subcommand: mdbub links <file> [--json] [--plain]
 *
 * clig.dev: stdout for data, stderr for messages, --json/--plain for composability.
 */

import chalk from "chalk";
import { readFileSync } from "node:fs";
import { parseMarkdownToMindmap } from "../core/parser.js";
import type { MindMapNode } from "../core/mindmap.js";
import { out, outJson, outPlain, msg, getOutputOptions } from "../output.js";

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

export function runLinks(filePath: string): void {
  const content = readFileSync(filePath, "utf-8");
  const root = parseMarkdownToMindmap(content);
  const entries = collectLinks(root);
  const { mode } = getOutputOptions();

  if (entries.length === 0) {
    msg("No [id:...] links found.");
    return;
  }

  if (mode === "json") {
    outJson(entries);
    return;
  }

  if (mode === "plain") {
    outPlain(["id", "node"], entries.map((e) => [e.id, e.node]));
    return;
  }

  out(chalk.bold("LINKS") + chalk.dim(` (${filePath})`));
  out("");
  out(chalk.dim("  " + "ID".padEnd(28) + "Node"));
  out(chalk.dim("  " + "─".repeat(56)));
  for (const entry of entries) {
    out(`  ${chalk.yellow(entry.id.padEnd(28))}${entry.node.slice(0, 50)}`);
  }
  out("");
}
