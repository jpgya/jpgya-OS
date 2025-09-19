import { listFiles, readFile } from "../core/vfs.js";

export const meta = {
  name: "ファイル管理",
  icon: "📁", // 画像URLから絵文字へ
  desc: "仮想ファイルシステムの閲覧"
};

export function main() {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="window-title">ファイル管理</div>
    <div class="window-body">
      <ul id="explorer-list"></ul>
      <div id="explorer-content"></div>
    </div>
    <button class="window-close">×</button>
  `;
  document.getElementById('desktop').appendChild(win);
  win.querySelector('.window-close').onclick = () => win.remove();

  const list = win.querySelector('#explorer-list');
  list.innerHTML = "";
  listFiles().forEach(fn => {
    const li = document.createElement('li');
    li.textContent = fn;
    li.onclick = () => {
      win.querySelector('#explorer-content').textContent = readFile(fn);
    };
    list.appendChild(li);
  });

  const el = document.createElement("div");
  el.className = "window";
  el.innerHTML = `
    <div class="titlebar">📁 ファイルエクスプローラ <button class="close">×</button></div>
    <div class="content">
      <ul class="file-list">
        ${Object.keys(vfs.files).map(f => `<li>${f} <button data-f="${f}">編集</button></li>`).join("")}
      </ul>
      <input class="newfile" placeholder="新ファイル名">
      <button class="add">作成</button>
    </div>`;
  el.querySelector(".close").onclick = () => window.OS.closeWin(win);
  el.querySelector(".add").onclick = () => {
    const name = el.querySelector(".newfile").value.trim();
    if (name && !vfs.files[name]) { vfs.files[name] = ""; saveVFS(); window.OS.openApp("explorer"); }
  };
  el.querySelectorAll("[data-f]").forEach(btn => {
    btn.onclick = () => window.OS.openApp("editor", btn.dataset.f);
  });
  const fileWin = { el, title: "ファイル" };
}
