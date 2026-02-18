/**
 * Print key-value command — extracts and displays @key:value metadata.
 *
 * Ported from Python: src/mdbub/commands/print_kv.py
 *
 * Note: The Python version scans raw file lines with @key:value regex,
 * independent of the tree parser. We replicate that approach here.
 */

import chalk from "chalk";
import { readFileSync } from "node:fs";

interface KvEntry {
  line: number;
  label: string;
  kvs: Record<string, string>;
}

/**
 * Extract @key:value metadata directly from file lines (matching Python behavior).
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

export function printKv(filePath: string): void {
  const { entries, allKeys } = extractKvFromFile(filePath);

  if (entries.length === 0) {
    console.log(chalk.dim("No @key:value metadata found."));
    return;
  }

  const keys = [...allKeys].sort();

  console.log(chalk.bold.cyan(`\n  @key:value metadata in ${filePath}\n`));
  console.log(
    chalk.dim(
      "  " +
        "Line".padEnd(6) +
        "Node".padEnd(24) +
        keys.map((k) => `@${k}`.padEnd(16)).join(""),
    ),
  );
  console.log(chalk.dim("  " + "─".repeat(30 + keys.length * 16)));

  for (const entry of entries) {
    const values = keys.map((k) => (entry.kvs[k] ?? "").padEnd(16));
    console.log(
      `  ${chalk.dim(String(entry.line).padEnd(6))}${chalk.cyan(entry.label.slice(0, 22).padEnd(24))}${values.map((v) => chalk.magenta(v)).join("")}`,
    );
  }
  console.log();
}
