import { createExplorer } from "./explorer.js";
import { createEditor } from "./editor.js";
import { createTerminal } from "./terminal.js";
import { createBrowser } from "./browser.js";
import { createCalc } from "./calc.js";
export const apps = [
  createExplorer(),
  createEditor(),
  createTerminal(),
  createBrowser(),
  createCalc()
];
