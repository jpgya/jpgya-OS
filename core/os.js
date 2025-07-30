import { vfs } from "./vfs.js";
import { renderTaskbar, renderStartMenu } from "./ui.js";
import { apps } from "../apps/apps.js";

export function bootOS() {
  window.OS = {
    wins: [],
    openApp: function(appId, arg) {
      const app = apps.find(a => a.id === appId);
      if (!app) return;
      const win = app.createWindow(arg);
      document.body.appendChild(win.el);
      this.wins.push(win);
      this.focusWin(win);
      renderTaskbar();
    },
    focusWin: function(win) {
      this.wins.forEach(w => w.el.classList.toggle("active", w === win));
      win.el.style.zIndex = 1000 + this.wins.indexOf(win);
    },
    closeWin: function(win) {
      win.el.remove();
      this.wins = this.wins.filter(w => w !== win);
      renderTaskbar();
    }
  };
  // デスクトップアイコン生成
  const desktop = document.getElementById("desktop");
  apps.forEach(app => {
    const icon = document.createElement("div");
    icon.className = "icon";
    icon.innerHTML = `<div>${app.icon}</div><div>${app.name}</div>`;
    icon.onclick = () => window.OS.openApp(app.id);
    desktop.appendChild(icon);
  });
  renderTaskbar();
  renderStartMenu();
}
