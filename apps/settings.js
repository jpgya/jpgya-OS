import { createAppWindow, makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "設定",
  icon: "⚙️",
  desc: "OSの簡易設定"
};

export function main() {
  // ウィンドウ生成
  const win = createAppWindow(meta.name, `
    <div class="titlebar">
      <span>${meta.icon} ${meta.name}</span>
      <div class="window-close">×</div>
    </div>
    <div class="window-body">
      <div>
        <label>テーマ色: </label>
        <select id="settings-theme">
          <option value="dark">ダーク</option>
          <option value="light">ライト</option>
        </select>
      </div>
      <button id="settings-apply">適用</button>
      <div id="settings-msg" style="margin-top:8px;color:#0af;"></div>
    </div>
  `);

  const msg = win.querySelector('#settings-msg');

  // 適用ボタン
  win.querySelector('#settings-apply').onclick = () => {
    const theme = win.querySelector('#settings-theme').value;
    if (theme === "light") {
      document.body.style.background = "#fff";
      document.body.style.color = "#222";
    } else {
      document.body.style.background = "#1e1e1e";
      document.body.style.color = "#eee";
    }
    msg.textContent = "テーマを変更しました";
  };

  // ウィンドウ閉じる
  const closeBtn = win.querySelector('.window-close');
  if (closeBtn) closeBtn.onclick = () => win.remove();

  makeWindowDraggable(win);

  // デスクトップに追加
  document.getElementById('desktop').appendChild(win);
}
