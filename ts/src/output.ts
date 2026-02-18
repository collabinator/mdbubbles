/**
 * Output utilities — shared formatting, color control, and output mode helpers.
 *
 * Follows clig.dev guidelines:
 * - stdout for data, stderr for messages/errors
 * - Disable color when not a TTY, when NO_COLOR is set, or --no-color is passed
 * - Support --json for machine-readable output
 * - Support --plain for pipe-friendly text
 */

import chalk, { type ChalkInstance } from "chalk";

export type OutputMode = "formatted" | "json" | "plain";

/** Global output options, set from CLI flags. */
export interface OutputOptions {
  mode: OutputMode;
  noColor: boolean;
  quiet: boolean;
}

let _options: OutputOptions = {
  mode: "formatted",
  noColor: false,
  quiet: false,
};

/** Configure global output options from CLI flags. */
export function setOutputOptions(opts: Partial<OutputOptions>): void {
  _options = { ..._options, ...opts };
  applyColorSettings();
}

export function getOutputOptions(): OutputOptions {
  return _options;
}

/** Apply color settings based on TTY detection, NO_COLOR env, and --no-color flag. */
function applyColorSettings(): void {
  const forceNoColor =
    _options.noColor ||
    !!process.env["NO_COLOR"] ||
    process.env["TERM"] === "dumb" ||
    !process.stdout.isTTY;

  if (forceNoColor) {
    chalk.level = 0;
  }
}

/**
 * Write data to stdout. This is the primary output channel.
 * Use for all data that could be piped to another program.
 */
export function out(text: string): void {
  process.stdout.write(text + "\n");
}

/**
 * Write a message to stderr. Use for informational messages, hints, and errors.
 * These are visible to the user but don't interfere with piped data.
 */
export function msg(text: string): void {
  if (!_options.quiet) {
    process.stderr.write(text + "\n");
  }
}

/**
 * Write an error to stderr with helpful formatting.
 * Follows clig.dev: empathetic, actionable error messages.
 */
export function err(message: string, hint?: string): void {
  const c = chalk as ChalkInstance;
  process.stderr.write(c.red("Error: ") + message + "\n");
  if (hint) {
    process.stderr.write("\n" + c.dim(hint) + "\n");
  }
}

/**
 * Write JSON to stdout (for --json mode).
 */
export function outJson(data: unknown): void {
  process.stdout.write(JSON.stringify(data, null, 2) + "\n");
}

/**
 * Write plain tab-separated text to stdout (for --plain mode).
 * Each row is an array of field values.
 */
export function outPlain(headers: string[], rows: string[][]): void {
  out(headers.join("\t"));
  for (const row of rows) {
    out(row.join("\t"));
  }
}
