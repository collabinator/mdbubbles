/**
 * Version command — displays version and build info.
 *
 * clig.dev: version should go to stdout so it can be piped/captured.
 */

import chalk from "chalk";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { out, outJson, getOutputOptions } from "../output.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function getPackageVersion(): string {
  for (const rel of [
    "../package.json",
    "../../package.json",
    "../../../package.json",
  ]) {
    try {
      const pkgPath = join(__dirname, rel);
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (pkg.version) return pkg.version;
    } catch {
      continue;
    }
  }
  return "unknown";
}

export function runVersion(): void {
  const version = getPackageVersion();
  const { mode } = getOutputOptions();

  if (mode === "json") {
    outJson({ name: "mdbub", version, runtime: "node", nodeVersion: process.version });
    return;
  }

  if (mode === "plain") {
    out(version);
    return;
  }

  out(chalk.bold.cyan("mdbub") + ` ${version}`);
  out(chalk.dim(`Node.js ${process.version}`));
}
