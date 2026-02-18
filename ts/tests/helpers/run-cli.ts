/**
 * E2E test helper — executes the mdbub CLI as a child process.
 *
 * This provides a realistic test harness that:
 * - Spawns the CLI via `tsx src/cli.tsx` (exactly as a user would run it)
 * - Captures stdout and stderr separately (validates clig.dev compliance)
 * - Returns the exit code
 * - Supports environment variable overrides (e.g., NO_COLOR)
 */

import { execFile } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Result of running the CLI as a subprocess. */
export interface CliResult {
  /** Process exit code (0 = success, 1 = user error, 2 = internal error). */
  exitCode: number;
  /** Data written to stdout. */
  stdout: string;
  /** Messages/errors written to stderr. */
  stderr: string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Root of the ts/ directory. */
const TS_ROOT = resolve(__dirname, "../..");

/** Path to the CLI entry point. */
const CLI_ENTRY = resolve(TS_ROOT, "src/cli.tsx");

/** Resolve a path relative to the repository root (parent of ts/). */
export function fixture(relativePath: string): string {
  return resolve(TS_ROOT, "..", relativePath);
}

/**
 * Run the mdbub CLI with the given arguments.
 *
 * @param args - CLI arguments (e.g., ["tags", "file.md", "--json"])
 * @param env - Additional environment variables to set
 * @returns Promise<CliResult> with stdout, stderr, and exit code
 */
export function runCli(
  args: string[],
  env?: Record<string, string>,
): Promise<CliResult> {
  return new Promise((resolve) => {
    execFile(
      "npx",
      ["tsx", CLI_ENTRY, ...args],
      {
        cwd: TS_ROOT,
        env: {
          ...process.env,
          // Force no color in tests for deterministic output
          NO_COLOR: "1",
          ...env,
        },
        timeout: 15_000,
      },
      (error, stdout, stderr) => {
        resolve({
          exitCode:
            error && "code" in error && typeof error.code === "number"
              ? error.code
              : error
                ? 1
                : 0,
          stdout: stdout.toString(),
          stderr: stderr.toString(),
        });
      },
    );
  });
}
