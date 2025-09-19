import { showDesktop, showStartMenu, showStore } from "./ui.js";
import * as apps from "../apps/apps.js";

// ログイン状態・ユーザー管理
export function bootOS() {
  const loginCover = document.getElementById('login-cover');
  const desktop = document.getElementById('desktop');
  const taskbar = document.getElementById('taskbar');
  const startBtn = document.getElementById('start-btn');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const loginError = document.getElementById('login-error');

  // ローカルストレージからユーザー情報取得
  let savedUser = JSON.parse(localStorage.getItem('user'));

  // ログイン処理
  loginBtn.onclick = () => {
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;
    savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser && id === savedUser.id && pass === savedUser.pass) {
      // ログイン成功
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
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;
    if (!id || !pass) {
      loginError.textContent = 'ユーザーIDとパスワードを入力してください';
      return;
    }
    if (localStorage.getItem('user')) {
      loginError.textContent = 'すでにユーザー登録されています';
      return;
    }
    localStorage.setItem('user', JSON.stringify({ id, pass }));
    loginError.textContent = '登録が完了しました。ログインしてください。';
  };

  // すでにログイン済みなら自動ログイン
  if (savedUser) {
    loginCover.style.display = 'none';
    desktop.style.display = '';
    taskbar.style.display = '';
    showDesktop();
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