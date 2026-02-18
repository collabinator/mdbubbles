/**
 * About command — displays project information.
 *
 * clig.dev: provide a support path (GitHub link) in help/about text.
 */

import chalk from "chalk";
import { out } from "../output.js";

export function runAbout(): void {
  out("");
  out(chalk.bold.cyan("  🧠 mdbub"));
  out("");
  out("  A mindmap tool for your terminal.");
  out("  Fast. Fluid. Keyboard-native. Built for thinkers who live in the CLI.");
  out("");
  out(chalk.dim("  Homepage:  ") + chalk.underline("https://github.com/collabinator/mdbubbles"));
  out(chalk.dim("  License:   ") + "Apache-2.0");
  out(chalk.dim("  Author:    ") + "dudash");
  out(chalk.dim("  Feedback:  ") + chalk.underline("https://github.com/collabinator/mdbubbles/issues"));
  out("");
}
