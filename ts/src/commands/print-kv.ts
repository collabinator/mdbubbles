/**
 * KV command — extracts and displays @key:value metadata from a mindmap file.
 *
 * Subcommand: mdbub kv <file> [--json] [--plain]
 *
 * clig.dev: stdout for data, stderr for messages, --json/--plain for composability.
 * Supports both @key:value and @key=value formats.
 */

import chalk from "chalk";
import { readFileSync } from "node:fs";
import { out, outJson, outPlain, msg, getOutputOptions } from "../output.js";

interface KvEntry {
  line: number;
  label: string;
  kvs: Record<string, string>;
}

/**
 * Extract @key:value metadata directly from file lines.
 * Supports both @key:value and @key=value formats.
 */
function extractKvFromFile(filePath: string): {
  entries: KvEntry[];
  allKeys: Set<string>;
} {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const kvPattern = /@(\w+)[=:]([^\s]+)/g;
  const entries: KvEntry[] = [];
  const allKeys = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kvs: Record<string, string> = {};
    let match: RegExpExecArray | null;

    kvPattern.lastIndex = 0;
    while ((match = kvPattern.exec(line)) !== null) {
      const key = match[1];
      const value = match[2];
      kvs[key] = value;
      allKeys.add(key);
    }

    if (Object.keys(kvs).length > 0) {
      const label = line.trim().split("@")[0].trim().replace(/^-\s*/, "");
      entries.push({ line: i + 1, label, kvs });
    }
  }

  return { entries, allKeys };
}

// Column widths for formatted table output
const LINE_COL_WIDTH = 6;
const NODE_COL_WIDTH = 24;
const NODE_MAX_DISPLAY = 22;
const VALUE_COL_WIDTH = 16;

export function runKv(filePath: string): void {
  const { entries, allKeys } = extractKvFromFile(filePath);
  const { mode } = getOutputOptions();

  if (entries.length === 0) {
    msg("No @key:value metadata found.");
    return;
  }

  const keys = [...allKeys].sort();

  if (mode === "json") {
    outJson(
      entries.map((e) => ({ line: e.line, node: e.label, ...e.kvs })),
    );
    return;
  }

  if (mode === "plain") {
    outPlain(
      ["line", "node", ...keys],
      entries.map((e) => [
        String(e.line),
        e.label,
        ...keys.map((k) => e.kvs[k] ?? ""),
      ]),
    );
    return;
  }

  out(chalk.bold("METADATA") + chalk.dim(` (${filePath})`));
  out("");
  out(
    chalk.dim(
      "  " +
        "Line".padEnd(LINE_COL_WIDTH) +
        "Node".padEnd(NODE_COL_WIDTH) +
        keys.map((k) => `@${k}`.padEnd(VALUE_COL_WIDTH)).join(""),
    ),
  );
  out(chalk.dim("  " + "─".repeat(LINE_COL_WIDTH + NODE_COL_WIDTH + keys.length * VALUE_COL_WIDTH)));

  for (const entry of entries) {
    const values = keys.map((k) => (entry.kvs[k] ?? "").padEnd(VALUE_COL_WIDTH));
    out(
      `  ${chalk.dim(String(entry.line).padEnd(LINE_COL_WIDTH))}${chalk.cyan(entry.label.slice(0, NODE_MAX_DISPLAY).padEnd(NODE_COL_WIDTH))}${values.map((v) => chalk.magenta(v)).join("")}`,
    );
  }
  out("");
}
