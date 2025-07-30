import { vfs } from "../core/vfs.js";
export function createTerminal() {
  return {
    id: "terminal",
    name: "ターミナル",
    icon: "💻",
    createWindow: () => {
      const el = document.createElement("div");
      el.className = "window";
      el.innerHTML = `
        <div class="titlebar">💻 ターミナル <button class="close">×</button></div>
        <div class="content">
          <div class="termout" style="font-family:monospace;background:#222;color:#0f0;padding:8px;min-height:50px;"></div>
          <input class="termcmd" placeholder="help でコマンド一覧">
          <button class="exec">実行</button>
        </div>`;
      const out = el.querySelector(".termout");
      el.querySelector(".close").onclick = () => window.OS.closeWin(win);
      el.querySelector(".exec").onclick = () => {
        const cmd = el.querySelector(".termcmd").value.trim();
        let res = "";
        if (cmd === "help") res = "help, echo, ls, cat [file], time";
        else if (cmd === "ls") res = Object.keys(vfs.files).join(", ");
        else if (cmd.startsWith("cat ")) res = vfs.files[cmd.slice(4)] || "なし";
        else if (cmd === "time") res = new Date().toLocaleString();
        else if (cmd.startsWith("echo ")) res = cmd.slice(5);
        else res = "未定義コマンド";
        out.innerHTML += `$ ${cmd}<br>${res}<br>`;
        out.scrollTop = 99999;
      };
      const win = { el, title: "ターミナル" };
      return win;
    }
  };
}
