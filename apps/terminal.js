import { listFiles, readFile } from "../core/vfs.js";
import { createAppWindow, makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "ターミナル",
  icon: "💻",
  desc: "簡易コマンドライン"
};

export function main() {
  // ウィンドウ生成
  const win = createAppWindow(meta.name, `
    <div class="titlebar">
      <span>${meta.icon} ${meta.name}</span>
      <div class="window-close">×</div>
    </div>
    <div class="window-body">
      <div class="termout" style="font-family:monospace;background:#222;color:#0f0;padding:8px;min-height:80px;overflow:auto;"></div>
      <div style="margin-top:6px;">
        <input class="termcmd" placeholder="help でコマンド一覧" style="width:70%;">
        <button class="exec">実行</button>
      </div>
    </div>
  `);

  const out = win.querySelector(".termout");
  const input = win.querySelector(".termcmd");
  const btn = win.querySelector(".exec");

  function appendOutput(cmd, res) {
    out.innerHTML += `$ ${cmd}<br>${res}<br>`;
    out.scrollTop = out.scrollHeight;
  }

  btn.onclick = () => {
    const cmd = input.value.trim();
    let res = "";

    if (cmd === "help") res = "help, echo, ls, cat [file], time";
    else if (cmd === "ls") res = listFiles().join(", ");
    else if (cmd.startsWith("cat ")) res = readFile(cmd.slice(4)) || "なし";
    else if (cmd === "time") res = new Date().toLocaleString();
    else if (cmd.startsWith("echo ")) res = cmd.slice(5);
    else res = "未定義コマンド";

    appendOutput(cmd, res);
    input.value = "";
  };

  // 閉じるボタン
  const closeBtn = win.querySelector('.window-close');
  if (closeBtn) closeBtn.onclick = () => win.remove();

  makeWindowDraggable(win);

  // デスクトップに追加
  document.getElementById('desktop').appendChild(win);

  return win;
}
