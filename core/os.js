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
      icon.onclick = () => createAppWindow(meta.name, (body, win) => {
       if (typeof meta.main === "function") {
         meta.main(body, win);
       } else {
         body.innerHTML = `<p>${meta.desc || ""}</p>`;
       }
      });

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
