import * as apps from "../apps/apps.js";
import { createAppWindow, showStartMenu } from "./ui.js";

export function bootOS() {
  const desktop = document.getElementById('desktop');
  const taskbar = document.getElementById('taskbar');
  const startBtn = document.getElementById('start-btn');
  desktop.style.display = "";
  taskbar.style.display = "";

  // デスクトップアイコン
  desktop.innerHTML = "";
  Object.keys(apps).forEach(appName => {
    const meta = apps[appName].meta;
    const icon = document.createElement('div');
    icon.className = "desktop-icon";
    icon.innerHTML = `<div class="icon-emoji">${meta.icon}</div><div>${meta.name}</div>`;
    icon.onclick = () => apps[appName].main();
    desktop.appendChild(icon);
  });

  // スタートメニュー
  startBtn.onclick = () => showStartMenu(apps);

  // 時計
  setInterval(() => {
    const now = new Date();
    document.getElementById('clock').textContent =
      now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, 1000);
}