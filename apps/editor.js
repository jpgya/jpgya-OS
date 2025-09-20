import { createAppWindow } from "../core/ui.js";

export const meta = {
  name: "テキストエディタ",
  icon: "📝",
  desc: "テキストファイルの編集"
};

export function main(container) {
  // container が指定されていない場合は新規ウィンドウを作る（安全策）
  const win = container || createAppWindow(meta.name, '');

  // コンテンツを描画
  win.innerHTML = `
    <textarea id="editor-text" style="width:98%;height:180px;font-size:16px;border-radius:8px;background:#181c20;color:#fff;border:1px solid #444;"></textarea>
    <div style="margin-top:8px;">
      <button id="editor-save">保存</button>
      <button id="editor-load">開く</button>
      <input id="editor-filename" type="text" placeholder="ファイル名" style="width:120px;">
    </div>
    <div id="editor-msg" style="margin-top:8px;color:#0af;"></div>
  `;

  // 保存ボタン
  win.querySelector('#editor-save').onclick = () => {
    const fn = win.querySelector('#editor-filename').value.trim();
    const data = win.querySelector('#editor-text').value;
    if (!fn) {
      win.querySelector('#editor-msg').textContent = "ファイル名を入力してください";
      return;
    }
    localStorage.setItem("vfs:" + fn, data);
    win.querySelector('#editor-msg').textContent = "保存しました";
  };

  // 読み込みボタン
  win.querySelector('#editor-load').onclick = () => {
    const fn = win.querySelector('#editor-filename').value.trim();
    if (!fn) {
      win.querySelector('#editor-msg').textContent = "ファイル名を入力してください";
      return;
    }
    win.querySelector('#editor-text').value = localStorage.getItem("vfs:" + fn) || "";
    win.querySelector('#editor-msg').textContent = "読み込みました";
  };
}
