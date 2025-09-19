export const meta = {
  name: "電卓",
  icon: "https://cdn.jsdelivr.net/gh/jpgya/jpgya-OS/icons/calc.png",
  desc: "シンプルな電卓アプリ"
};

export function main() {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="window-title">電卓</div>
    <div class="window-body">
      <input id="calc-input" type="text" style="width:90%">
      <button id="calc-eval">=</button>
      <div id="calc-result"></div>
    </div>
    <button class="window-close">×</button>
  `;
  document.getElementById('desktop').appendChild(win);
  win.querySelector('.window-close').onclick = () => win.remove();
  win.querySelector('#calc-eval').onclick = () => {
    try {
      const val = eval(win.querySelector('#calc-input').value);
      win.querySelector('#calc-result').textContent = val;
    } catch {
      win.querySelector('#calc-result').textContent = "エラー";
    }
  };
}
