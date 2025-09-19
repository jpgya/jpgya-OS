import { getInstalledApps, installApp, uninstallApp, launchApp } from "./os.js";
import * as apps from "../apps/apps.js";

// デスクトップ表示
export function showDesktop() {
  const desktop = document.getElementById('desktop');
  desktop.innerHTML = "";
  const installed = getInstalledApps();
  installed.forEach(appName => {
    const meta = apps[appName]?.meta;
    if (!meta) return;
    const icon = document.createElement('div');
    icon.className = "desktop-icon";
    icon.innerHTML = `<img src="${meta.icon}" alt="${meta.name}"><div>${meta.name}</div>`;
    icon.onclick = () => launchApp(appName);
    desktop.appendChild(icon);
  });
}

// スタートメニュー表示
export function showStartMenu() {
  const menu = document.getElementById('start-menu');
  menu.innerHTML = `
    <div class="start-menu-inner">
      <button id="open-store">jpgyaStore</button>
      <hr>
      <div id="start-app-list"></div>
    </div>
  `;
  menu.style.display = 'block';
  document.getElementById('open-store').onclick = () => {
    showStore();
    menu.style.display = 'none';
  };
  // インストール済みアプリ一覧
  const installed = getInstalledApps();
  const list = document.getElementById('start-app-list');
  installed.forEach(appName => {
    const meta = apps[appName]?.meta;
    if (!meta) return;
    const btn = document.createElement('button');
    btn.textContent = meta.name;
    btn.onclick = () => {
      launchApp(appName);
      menu.style.display = 'none';
    };
    list.appendChild(btn);
  });
  // メニュー外クリックで閉じる
  document.addEventListener('mousedown', function handler(e) {
    if (!menu.contains(e.target)) {
      menu.style.display = 'none';
      document.removeEventListener('mousedown', handler);
    }
  });
}

// jpgyaStore表示
export function showStore() {
  const desktop = document.getElementById('desktop');
  desktop.innerHTML = "";
  const storeWin = document.createElement('div');
  storeWin.className = "window";
  storeWin.innerHTML = `<div class="window-title">jpgyaStore</div>
    <div class="window-body" id="store-list"></div>
    <button class="window-close">×</button>`;
  desktop.appendChild(storeWin);

  storeWin.querySelector('.window-close').onclick = () => {
    showDesktop();
  };

  // ストアアプリ一覧
  const storeList = document.getElementById('store-list');
  storeList.innerHTML = "";
  Object.keys(apps).forEach(appName => {
    if (!apps[appName]?.meta) return;
    const meta = apps[appName].meta;
    const installed = getInstalledApps().includes(appName);
    const div = document.createElement('div');
    div.className = "store-app";
    div.innerHTML = `
      <img src="${meta.icon}" alt="${meta.name}">
      <div class="store-app-info">
        <div class="store-app-title">${meta.name}</div>
        <div class="store-app-desc">${meta.desc}</div>
      </div>
      <button class="store-app-btn">${installed ? "アンインストール" : "インストール"}</button>
    `;
    div.querySelector('.store-app-btn').onclick = () => {
      if (installed) {
        uninstallApp(appName);
      } else {
        installApp(appName);
      }
      showStore();
    };
    storeList.appendChild(div);
  });
}
