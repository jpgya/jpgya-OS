import { vfs, saveVFS } from "../core/vfs.js";
export function createEditor() {
  return {
    id: "editor",
    name: "テキストエディタ",
    icon: "📝",
    createWindow: (fname) => {
      const el = document.createElement("div");
      el.className = "window";
      el.innerHTML = `
        <div class="titlebar">📝 テキストエディタ <button class="close">×</button></div>
        <div class="content">
          <div>ファイル: <b>${fname || ""}</b></div>
          <textarea style="width:96%;height:80px;">${fname ? (vfs.files[fname]||"") : ""}</textarea>
          <button class="save">保存</button>
        </div>`;
      el.querySelector(".close").onclick = () => window.OS.closeWin(win);
      el.querySelector(".save").onclick = () => {
        if (fname) {
          vfs.files[fname] = el.querySelector("textarea").value;
          saveVFS();
          alert("保存しました");
        }
      };
      const win = { el, title: "エディタ" + (fname ? `[${fname}]` : "") };
      return win;
    }
  };
}
