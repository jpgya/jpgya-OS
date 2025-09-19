import { showDesktop, showStartMenu, showStore } from "./ui.js";
import * as apps from "../apps/apps.js";

export function bootOS() {
  const loginCover = document.getElementById('login-cover');
  const desktop = document.getElementById('desktop');
  const taskbar = document.getElementById('taskbar');
  const startBtn = document.getElementById('start-btn');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const loginError = document.getElementById('login-error');

  // ユーザー情報取得
  function getUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }

  // ログイン処理
  loginBtn.onclick = () => {
    const id = document.getElementById('login-id').value.trim();
    const pass = document.getElementById('login-pass').value;
    const savedUser = getUser();
    if (!savedUser) {
      loginError.textContent = 'ユーザーが登録されていません。新規登録してください。';
      return;
    }
    if (id === savedUser.id && pass === savedUser.pass) {
      loginError.textContent = '';
      loginCover.style.display = 'none';
      desktop.style.display = '';
      taskbar.style.display = '';
      showDesktop();
    } else {
      loginError.textContent = 'ユーザーIDまたはパスワードが違います';
    }
  };

  // 新規登録処理
  registerBtn.onclick = () => {
    const id = document.getElementById('login-id').value.trim();
    const pass = document.getElementById('login-pass').value;
    if (!id || !pass) {
      loginError.textContent = 'ユーザーIDとパスワードを入力してください';
      return;
    }
    localStorage.setItem('user', JSON.stringify({ id, pass }));
    loginError.textContent = '登録が完了しました。ログインしてください。';
  };

  // 自動ログイン（すでにユーザーが登録されている場合のみ）
  const savedUser = getUser();
  if (savedUser) {
    loginCover.style.display = 'none';
    desktop.style.display = '';
    taskbar.style.display = '';
    showDesktop();
  } else {
    loginCover.style.display = '';
    desktop.style.display = 'none';
    taskbar.style.display = 'none';
  }

  // スタートボタン
  startBtn.onclick = () => {
    showStartMenu();
  };

  // 時計
  setInterval(() => {
    const now = new Date();
    document.getElementById('clock').textContent =
      now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, 1000);
}

// アプリ管理
export function getInstalledApps() {
  return JSON.parse(localStorage.getItem('installedApps') || '[]');
}
export function installApp(appName) {
  const apps = getInstalledApps();
  if (!apps.includes(appName)) {
    apps.push(appName);
    localStorage.setItem('installedApps', JSON.stringify(apps));
  }
}
export function uninstallApp(appName) {
  let apps = getInstalledApps();
  apps = apps.filter(a => a !== appName);
  localStorage.setItem('installedApps', JSON.stringify(apps));
}

// アプリ起動
export function launchApp(appName) {
  if (apps[appName] && typeof apps[appName].main === "function") {
    apps[appName].main();
  } else {
    alert("アプリが見つかりません: " + appName);
  }
}