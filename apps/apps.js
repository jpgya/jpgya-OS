import * as browser from "./browser.js";
import * as calc from "./calc.js";
import * as editor from "./editor.js";
import * as explorer from "./explorer.js";
import * as terminal from "./terminal.js";
import * as game from "./game.js";
import * as vscode from "./vscode.js";
import * as settings from "./settings.js";

// アプリ一覧
export {
  browser,
  calc,
  editor,
  explorer,
  terminal,
  game,
  vscode,
  settings
};

// ...ウィンドウ生成後...
makeWindowDraggable(win);
