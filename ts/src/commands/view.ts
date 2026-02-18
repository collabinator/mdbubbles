/**
 * View command — displays a mindmap tree in the terminal.
 *
 * Subcommand: mdbub view <file> [--json] [--plain]
 *
 * clig.dev: increase information density with ASCII art.
 */

import chalk from "chalk";
import { readFileSync } from "node:fs";
import { parseMarkdownToMindmap } from "../core/parser.js";
import type { MindMapNode } from "../core/mindmap.js";
import { out, outJson, getOutputOptions } from "../output.js";

/** Render a tree as indented text lines. */
function renderTree(
  node: MindMapNode,
  prefix = "",
  isLast = true,
  isRoot = true,
): string[] {
  const lines: string[] = [];
  const connector = isRoot ? "" : isLast ? "└─ " : "├─ ";
  const childPrefix = isRoot ? "" : isLast ? "   " : "│  ";

  // Build label with inline metadata hints
  let label = node.label;
  const tags = node.getTags();
  if (tags.length > 0) {
    label += " " + tags.map((t) => chalk.yellow(`#${t}`)).join(" ");
  }

  const line = prefix + connector + label;
  lines.push(line);

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const last = i === node.children.length - 1;
    lines.push(
      ...renderTree(child, prefix + childPrefix, last, false),
    );
  }

  return lines;
}

/** Render a plain-text tree (no color). */
function renderPlainTree(
  node: MindMapNode,
  prefix = "",
  isLast = true,
  isRoot = true,
): string[] {
  const lines: string[] = [];
  const connector = isRoot ? "" : isLast ? "└─ " : "├─ ";
  const childPrefix = isRoot ? "" : isLast ? "   " : "│  ";

  let label = node.label;
  const tags = node.getTags();
  if (tags.length > 0) {
    label += " " + tags.map((t) => `#${t}`).join(" ");
  }

  lines.push(prefix + connector + label);

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const last = i === node.children.length - 1;
    lines.push(
      ...renderPlainTree(child, prefix + childPrefix, last, false),
    );
  }

  return lines;
}

export function runView(filePath: string): void {
  const content = readFileSync(filePath, "utf-8");
  const root = parseMarkdownToMindmap(content);
  const { mode } = getOutputOptions();

  if (mode === "json") {
    outJson(root.toDict());
    return;
  }

  if (mode === "plain") {
    const lines = renderPlainTree(root);
    for (const line of lines) {
      out(line);
    }
    return;
  }

  out(chalk.bold("MINDMAP") + chalk.dim(` (${filePath})`));
  out("");
  const lines = renderTree(root);
  for (const line of lines) {
    out(line);
  }
  out("");
}
