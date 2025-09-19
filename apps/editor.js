
import { readFile, writeFile } from "../core/vfs.js";

export const meta = {
  name: "テキストエディタ",
  icon: "📝", // 画像URLから絵文字へ
  desc: "テキストファイルの編集"
};

export function main() {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="window-title">テキストエディタ</div>
    <div class="window-body">
      <input id="editor-filename" type="text" placeholder="ファイル名" style="width:90%">
      <textarea id="editor-content" style="width:98%;height:180px;"></textarea>
      <div>
        <button id="editor-load">開く</button>
        <button id="editor-save">保存</button>
      </div>
      <div id="editor-msg"></div>
    </div>
    <button class="window-close">×</button>
  `;
  document.getElementById('desktop').appendChild(win);
  win.querySelector('.window-close').onclick = () => win.remove();

  win.querySelector('#editor-load').onclick = () => {
    const fn = win.querySelector('#editor-filename').value;
    const data = readFile(fn);
    win.querySelector('#editor-content').value = data || "";
    win.querySelector('#editor-msg').textContent = data ? "読み込み成功" : "ファイルなし";
  };
  win.querySelector('#editor-save').onclick = () => {
    const fn = win.querySelector('#editor-filename').value;
    const data = win.querySelector('#editor-content').value;
    writeFile(fn, data);
    win.querySelector('#editor-msg').textContent = "保存しました";
  };
}
