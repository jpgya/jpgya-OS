import * as apps from "../apps/apps.js";
import { createAppWindow, showStartMenu } from "./ui.js";

export function bootOS() {
  const desktop = document.getElementById('desktop');
  const taskbar = document.getElementById('taskbar');
  const startBtn = document.getElementById('start-btn');
  const loginCover = document.getElementById('login-cover');
  const loginId = document.getElementById('login-id');
  const loginPass = document.getElementById('login-pass');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const loginError = document.getElementById('login-error');

  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    loginCover.style.display = "none";
    showDesktop();
  } else {
    loginCover.style.display = "";
    taskbar.style.display = "none";
    desktop.style.display = "none";
  }

  loginBtn.onclick = handleLogin;
  registerBtn.onclick = handleRegister;

  function handleLogin() {
    const id = loginId.value.trim();
    const pass = loginPass.value;
    const stored = localStorage.getItem("user_" + id);

    if (stored && stored === pass) {
      localStorage.setItem("currentUser", id);
      loginCover.style.display = "none";
      showDesktop();
    } else {
      loginError.textContent = "ユーザーIDかパスワードが違います";
    }
  }

  function handleRegister() {
    const id = loginId.value.trim();
    const pass = loginPass.value;
    if (!id || !pass) return;

    if (localStorage.getItem("user_" + id)) {
      loginError.textContent = "このユーザーIDは既に存在します";
    } else {
      localStorage.setItem("user_" + id, pass);
      loginError.textContent = "登録完了！ログインしてください";
    }
  }

  function showDesktop() {
    desktop.style.display = "";
    taskbar.style.display = "";

    desktop.innerHTML = "";
    Object.keys(apps).forEach(appName => {
      const meta = apps[appName].meta;
      const icon = document.createElement('div');
      icon.className = "desktop-icon";
      icon.innerHTML = `<div class="icon-emoji">${meta.icon}</div><div>${meta.name}</div>`;
      icon.onclick = () => launchApp(appName);
      desktop.appendChild(icon);
    });

    startBtn.onclick = () => showStartMenu(apps);

    if (!window.clockInterval) {
      window.clockInterval = setInterval(() => {
        document.getElementById('clock').textContent =
          new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }, 1000);
    }
  }
}
// os.js

// インストール済みアプリを取得
export function getInstalledApps() {
  return JSON.parse(localStorage.getItem("installedApps") || "[]");
}

// アプリをインストール
export function installApp(appName) {
  const apps = getInstalledApps();
  if (!apps.includes(appName)) {
    apps.push(appName);
    localStorage.setItem("installedApps", JSON.stringify(apps));
  }
}

// アプリをアンインストール
export function uninstallApp(appName) {
  const apps = getInstalledApps().filter(a => a !== appName);
  localStorage.setItem("installedApps", JSON.stringify(apps));
}

// アプリを起動
export function launchApp(appName) {
  const app = apps[appName];
  if (!app) return;

  // main() がある場合はそれを呼ぶ
  if (app.main) {
    app.main();
  } else {
    // main() がなければ説明ウィンドウ
    createAppWindow(app.meta.name, `<p>${app.meta.desc || ""}</p>`);
  }
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
export function createAppWindow(appName, contentHTML) {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="titlebar">
      ${appName}
      <div class="window-btns">
        <button class="window-btn min">ー</button>
        <button class="window-btn max">□</button>
        <button class="window-btn close">×</button>
      </div>
    </div>
    <div class="window-body">${contentHTML}</div>
  `;
  win.style.left = "120px";
  win.style.top = "120px";
  document.getElementById('desktop').appendChild(win);
  makeWindowDraggable(win);
  makeWindowActive(win);
  addTask(appName, win);

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
