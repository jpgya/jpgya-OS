import { apps } from "../apps/apps.js";
export function renderTaskbar() {
  const taskbar = document.getElementById("taskbar");
  taskbar.innerHTML = "";
  window.OS.wins.forEach(win => {
    const btn = document.createElement("button");
    btn.className = "task";
    btn.textContent = win.title;
    btn.onclick = () => window.OS.focusWin(win);
    taskbar.appendChild(btn);
  });
}
export function renderStartMenu() {
  const startMenu = document.getElementById("start-menu");
  startMenu.innerHTML = apps.map(app =>
    `<div onclick="OS.openApp('${app.id}')">${app.icon} ${app.name}</div>`
  ).join("");
}
