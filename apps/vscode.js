import { makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "VSCode風エディタ",
  icon: "🖥️",
  desc: "VSCode風の簡易エディタ"
};

export function main() {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="window-title">VSCode風エディタ</div>
    <div class="window-body">
      <textarea id="vscode-editor" style="width:98%;height:200px;font-family:monospace;background:#1e1e1e;color:#fff;border:1px solid #444;border-radius:4px;"></textarea>
      <div>
        <button id="vscode-save">保存</button>
        <button id="vscode-load">開く</button>
        <input id="vscode-filename" type="text" placeholder="ファイル名" style="width:120px;">
      </div>
      <div id="vscode-msg"></div>
    </div>
    <button class="window-close">×</button>
  `;
  document.getElementById('desktop').appendChild(win);
  win.querySelector('.window-close').onclick = () => win.remove();

  win.querySelector('#vscode-save').onclick = () => {
    const fn = win.querySelector('#vscode-filename').value;
    const data = win.querySelector('#vscode-editor').value;
    if (fn) {
      localStorage.setItem("vfs:" + fn, data);
      win.querySelector('#vscode-msg').textContent = "保存しました";
    }
  };
  win.querySelector('#vscode-load').onclick = () => {
    const fn = win.querySelector('#vscode-filename').value;
    if (fn) {
      win.querySelector('#vscode-editor').value = localStorage.getItem("vfs:" + fn) || "";
      win.querySelector('#vscode-msg').textContent = "読み込みました";
    }
  };

  makeWindowDraggable(win);
}