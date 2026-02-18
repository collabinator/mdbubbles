/**
 * About command — displays project information.
 *
 * Ported from Python: src/mdbub/commands/about.py
 */

import chalk from "chalk";

export function printAbout(): void {
  console.log(chalk.bold.cyan("\n  🧠 mdbub\n"));
  console.log(
    chalk.white("  A mindmap tool for your terminal."),
  );
  console.log(
    chalk.white("  Fast. Fluid. Keyboard-native. Built for thinkers who live in the CLI.\n"),
  );
  console.log(chalk.dim("  Homepage:  ") + chalk.underline("https://github.com/collabinator/mdbubbles"));
  console.log(chalk.dim("  License:   ") + "Apache-2.0");
  console.log(chalk.dim("  Author:    ") + "dudash");
  console.log();
}
