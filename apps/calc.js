import { makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "電卓",
  icon: "🧮",
  desc: "シンプルな電卓アプリ"
};

// container を受け取る形に変更
export function main(container) {
  container.innerHTML = `
    <input id="calc-input" type="text" style="width:90%">
    <button id="calc-eval">=</button>
    <div id="calc-result"></div>
  `;

  container.querySelector('#calc-eval').onclick = () => {
    try {
      const val = eval(container.querySelector('#calc-input').value);
      container.querySelector('#calc-result').textContent = val;
    } catch {
      container.querySelector('#calc-result').textContent = "エラー";
    }
  };
}
