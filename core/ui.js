import { getInstalledApps, installApp, uninstallApp, launchApp } from "./os.js";
import * as apps from "../apps/apps.js";

// デスクトップ表示
export function showDesktop() {
  const desktop = document.getElementById('desktop');
  desktop.innerHTML = "";
  const installed = getInstalledApps();
  installed.forEach(appName => {
    let meta, launchFunc;
    if (apps[appName]?.meta) {
      meta = apps[appName].meta;
      launchFunc = () => launchApp(appName);
    } else if (localStorage.getItem("devapp:" + appName)) {
      // 自作アプリ
      meta = { name: appName, icon: "🧩", desc: "ユーザー作成アプリ" };
      launchFunc = async () => {
        const code = localStorage.getItem("devapp:" + appName);
        const blob = new Blob([code], { type: "text/javascript" });
        const url = URL.createObjectURL(blob);
        const mod = await import(url);
        if (mod.main) mod.main();
        URL.revokeObjectURL(url);
      };
    } else {
      return;
    }
    const icon = document.createElement('div');
    icon.className = "desktop-icon";
    icon.innerHTML = `<div class="icon-emoji">${meta.icon}</div><div>${meta.name}</div>`;
    icon.onclick = launchFunc;
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
  storeWin.innerHTML = `
    <div class="window-title">jpgyaStore</div>
    <button class="window-close" style="top:10px;right:10px;">×</button>
    <div class="window-body" id="store-list"></div>
  `;
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
      <div class="icon-emoji">${meta.icon}</div>
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

  makeWindowDraggable(storeWin);
}

let topZ = 100;
let tasks = [];

export function makeWindowDraggable(win) {
  const title = win.querySelector('.titlebar, .window-title');
  if (!title) return;
  let offsetX = 0, offsetY = 0, dragging = false;

  title.onmousedown = function(e) {
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.body.style.userSelect = "none";
    makeWindowActive(win);
  };
  document.onmousemove = function(e) {
    if (!dragging) return;
    win.style.left = (e.clientX - offsetX) + "px";
    win.style.top = (e.clientY - offsetY) + "px";
  };
  document.onmouseup = function() {
    dragging = false;
    document.body.style.userSelect = "";
  };
}

export function makeWindowActive(win) {
  topZ++;
  win.style.zIndex = topZ;
  document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
  win.classList.add('active');
}

export function addTask(appName, win) {
  tasks.push({ appName, win });
  updateTaskbar();
}

function updateTaskbar() {
  const tasksDiv = document.getElementById('tasks');
  if (!tasksDiv) return;
  tasksDiv.innerHTML = "";
  tasks.forEach(({ appName, win }, i) => {
    const btn = document.createElement('button');
    btn.className = "task";
    btn.textContent = appName;
    btn.onclick = () => {
      win.style.display = "";
      makeWindowActive(win);
    };
    tasksDiv.appendChild(btn);
  });
}

// ウィンドウ生成時の例
export function createAppWindow(appName, contentHTMLOrAppMain) {
  const win = document.createElement('div');
  win.className = "window";
  win.style.left = "120px";
  win.style.top = "120px";

  // contentHTMLOrAppMain が関数なら main() を呼ぶ
  if (typeof contentHTMLOrAppMain === "function") {
  // 一旦空のウィンドウ生成
  win.innerHTML = `
    <div class="titlebar">
      ${appName}
      <div class="window-btns">
        <button class="window-btn min">ー</button>
        <button class="window-btn max">□</button>
        <button class="window-btn close">×</button>
      </div>
    </div>
    <div class="window-body"></div>
  `;
  document.getElementById('desktop').appendChild(win);
  makeWindowDraggable(win);
  makeWindowActive(win);
  addTask(appName, win);

  // アプリの main() を呼ぶ
  contentHTMLOrAppMain(win.querySelector('.window-body'), win);

} else {
  // 普通の HTML を表示する場合
  win.innerHTML = `
    <div class="titlebar">
      ${appName}
      <div class="window-btns">
        <button class="window-btn min">ー</button>
        <button class="window-btn max">□</button>
        <button class="window-btn close">×</button>
      </div>
    </div>
    <div class="window-body"></div>
  `;
  document.getElementById('desktop').appendChild(win);
  makeWindowDraggable(win);
  makeWindowActive(win);
  addTask(appName, win);

  // ←ここを追加することで文字列HTMLも innerHTML に挿入される
  win.querySelector('.window-body').innerHTML = contentHTMLOrAppMain;
}


  // 最小化
  win.querySelector('.window-btn.min').onclick = () => win.style.display = "none";

  // 最大化/元に戻す
  win.querySelector('.window-btn.max').onclick = () => {
    if (win.classList.contains('maxed')) {
      win.classList.remove('maxed');
      win.style.left = win.dataset.oldLeft;
      win.style.top = win.dataset.oldTop;
      win.style.width = win.dataset.oldWidth;
      win.style.height = win.dataset.oldHeight;
    } else {
      win.dataset.oldLeft = win.style.left;
      win.dataset.oldTop = win.style.top;
      win.dataset.oldWidth = win.style.width;
      win.dataset.oldHeight = win.style.height;
      win.classList.add('maxed');
      win.style.left = "0";
      win.style.top = "0";
      win.style.width = "100vw";
      win.style.height = "100vh";
    }
    makeWindowActive(win);
  };

  // 閉じる
  win.querySelector('.window-btn.close').onclick = () => {
    win.remove();
    tasks = tasks.filter(t => t.win !== win);
    updateTaskbar();
  };

  // アクティブ化
  win.onmousedown = () => makeWindowActive(win);

  return win;
}
