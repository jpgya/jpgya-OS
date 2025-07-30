export function createBrowser() {
  return {
    id: "browser",
    name: "Webビューア",
    icon: "🌐",
    createWindow: () => {
      const el = document.createElement("div");
      el.className = "window";
      el.innerHTML = `
        <div class="titlebar">🌐 Webビューア <button class="close">×</button></div>
        <div class="content">
          <input class="url" value="https://www.example.com" style="width:80%">
          <button class="go">開く</button>
          <iframe class="webview" src="https://www.example.com" style="width:98%;height:100px;border:1px solid #aaa;"></iframe>
        </div>`;
      el.querySelector(".close").onclick = () => window.OS.closeWin(win);
      el.querySelector(".go").onclick = () => {
        let u = el.querySelector(".url").value;
        if (!u.startsWith("http")) u = "https://" + u;
        el.querySelector(".webview").src = u;
      };
      const win = { el, title: "Webビューア" };
      return win;
    }
  };
}
