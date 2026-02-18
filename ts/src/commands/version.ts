/**
 * Version command — displays version and build info.
 *
 * Ported from Python: src/mdbub/commands/version.py
 */

import chalk from "chalk";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getPackageVersion(): string {
  const pkgPath = join(__dirname, "..", "..", "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  return pkg.version ?? "unknown";
}

export function printVersion(): void {
  const version = getPackageVersion();
  console.log(chalk.bold.cyan(`mdbub`) + ` v${version}`);
  console.log(chalk.dim(`Runtime: TypeScript + Ink (React for CLI)`));
  console.log(chalk.dim(`Node.js ${process.version}`));
}
