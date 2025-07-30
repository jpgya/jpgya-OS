import { vfs, saveVFS } from "../core/vfs.js";
export function createExplorer() {
  return {
    id: "explorer",
    name: "ファイルエクスプローラ",
    icon: "📁",
    createWindow: () => {
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
      const win = { el, title: "ファイル" };
      return win;
    }
  };
}
