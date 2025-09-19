export const meta = {
  name: "設定",
  icon: "⚙️",
  desc: "OSの簡易設定"
};

export function main() {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="window-title">設定</div>
    <div class="window-body">
      <div>
        <label>テーマ色: </label>
        <select id="settings-theme">
          <option value="dark">ダーク</option>
          <option value="light">ライト</option>
        </select>
      </div>
      <button id="settings-apply">適用</button>
      <div id="settings-msg"></div>
    </div>
    <button class="window-close">×</button>
  `;
  document.getElementById('desktop').appendChild(win);
  win.querySelector('.window-close').onclick = () => win.remove();

  win.querySelector('#settings-apply').onclick = () => {
    const theme = win.querySelector('#settings-theme').value;
    if (theme === "light") {
      document.body.style.background = "#fff";
      document.body.style.color = "#222";
    } else {
      document.body.style.background = "#1e1e1e";
      document.body.style.color = "#eee";
    }
    win.querySelector('#settings-msg').textContent = "テーマを変更しました";
  };

  makeWindowDraggable(win);
}