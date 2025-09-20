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

  // ログイン状態チェック
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    loginCover.style.display = "none";
    showDesktop();
  } else {
    loginCover.style.display = "";
    taskbar.style.display = "none";
    desktop.style.display = "none";
  }

  // ログインボタン
  loginBtn.onclick = () => {
    const id = loginId.value.trim();
    const pass = loginPass.value;
    const stored = localStorage.getItem("user_" + id);

    if (stored && stored === pass) {
      localStorage.setItem("currentUser", id); // ログイン状態保持
      loginCover.style.display = "none";
      showDesktop();
    } else {
      loginError.textContent = "ユーザーIDかパスワードが違います";
    }
  };

  // 新規登録ボタン
  registerBtn.onclick = () => {
    const id = loginId.value.trim();
    const pass = loginPass.value;
    if (!id || !pass) return;

    if (localStorage.getItem("user_" + id)) {
      loginError.textContent = "このユーザーIDは既に存在します";
    } else {
      localStorage.setItem("user_" + id, pass);
      loginError.textContent = "登録完了！ログインしてください";
    }
  };

  // デスクトップを表示する関数
  function showDesktop() {
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
}
