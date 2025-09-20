import { createAppWindow, makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "ミニゲーム",
  icon: "🎮",
  desc: "シンプルな数字当てゲーム"
};

export function main(container) {
  const win = container || createAppWindow(meta.name, `
    <div class="window-body">
      <div>1～100の数字を当ててください</div>
      <input id="game-input" type="number" min="1" max="100">
      <button id="game-guess">判定</button>
      <div id="game-msg" style="margin-top:8px;color:#0af;"></div>
    </div>
  `);

  const msg = win.querySelector('#game-msg');
  const input = win.querySelector('#game-input');
  const answer = Math.floor(Math.random() * 100) + 1;

  win.querySelector('#game-guess').onclick = () => {
    const val = Number(input.value);
    if (!val) {
      msg.textContent = "数字を入力してください";
      return;
    }
    if (val === answer) {
      msg.textContent = "正解！ 🎉";
    } else if (val < answer) {
      msg.textContent = "もっと大きいです";
    } else {
      msg.textContent = "もっと小さいです";
    }
  };

  makeWindowDraggable(win);
  win.querySelector('.window-close').onclick = () => win.remove();
}
