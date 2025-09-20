import { createAppWindow, makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "VSCode風エディタ",
  icon: "🖥️",
  desc: "VSCode風の簡易エディタ"
};

export function main() {
  const win = createAppWindow(meta.name, `
    <div class="titlebar">
      <span>${meta.icon} ${meta.name}</span>
      <div class="window-close">×</div>
    </div>
    <div class="window-body">
      <textarea id="vscode-editor" style="width:98%;height:200px;font-family:monospace;background:#1e1e1e;color:#fff;border:1px solid #444;border-radius:4px;"></textarea>
      <div style="margin-top:6px;">
        <button id="vscode-save">保存</button>
        <button id="vscode-load">開く</button>
        <input id="vscode-filename" type="text" placeholder="ファイル名" style="width:120px;">
      </div>
      <div id="vscode-msg" style="margin-top:6px;color:#0af;"></div>
    </div>
  `);

  const msg = win.querySelector('#vscode-msg');

  win.querySelector('#vscode-save').onclick = () => {
    const fn = win.querySelector('#vscode-filename').value;
    const data = win.querySelector('#vscode-editor').value;
    if (fn) {
      localStorage.setItem("vfs:" + fn, data);
      msg.textContent = "保存しました";
    } else {
      msg.textContent = "ファイル名を入力してください";
    }
  };

  win.querySelector('#vscode-load').onclick = () => {
    const fn = win.querySelector('#vscode-filename').value;
    if (fn) {
      win.querySelector('#vscode-editor').value = localStorage.getItem("vfs:" + fn) || "";
      msg.textContent = "読み込みました";
    } else {
      msg.textContent = "ファイル名を入力してください";
    }
  };

  // 閉じるボタン
  const closeBtn = win.querySelector('.window-close');
  if (closeBtn) closeBtn.onclick = () => win.remove();

  makeWindowDraggable(win);
  document.getElementById('desktop').appendChild(win);

  return win;
}
