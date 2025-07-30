export function createCalc() {
  return {
    id: "calc",
    name: "電卓",
    icon: "🧮",
    createWindow: () => {
      const el = document.createElement("div");
      el.className = "window";
      el.innerHTML = `
        <div class="titlebar">🧮 電卓 <button class="close">×</button></div>
        <div class="content">
          <input class="calcInput" placeholder="例: 2*3+1" style="width:90%">
          <button class="calcBtn">計算</button>
          <div class="calcRes"></div>
        </div>`;
      el.querySelector(".close").onclick = () => window.OS.closeWin(win);
      el.querySelector(".calcBtn").onclick = () => {
        try {
          el.querySelector(".calcRes").innerText = eval(el.querySelector(".calcInput").value);
        } catch (e) {
          el.querySelector(".calcRes").innerText = "エラー";
        }
      };
      const win = { el, title: "電卓" };
      return win;
    }
  };
}
