export const meta = {
  name: "ミニゲーム",
  icon: "🎮",
  desc: "シンプルな数字当てゲーム"
};

export function main() {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="window-title">ミニゲーム</div>
    <div class="window-body">
      <div>1～100の数字を当ててください</div>
      <input id="game-input" type="number" min="1" max="100">
      <button id="game-guess">判定</button>
      <div id="game-msg"></div>
    </div>
    <button class="window-close">×</button>
  `;
  document.getElementById('desktop').appendChild(win);
  win.querySelector('.window-close').onclick = () => win.remove();

  const answer = Math.floor(Math.random() * 100) + 1;
  win.querySelector('#game-guess').onclick = () => {
    const val = Number(win.querySelector('#game-input').value);
    if (val === answer) {
      win.querySelector('#game-msg').textContent = "正解！";
    } else if (val < answer) {
      win.querySelector('#game-msg').textContent = "もっと大きいです";
    } else {
      win.querySelector('#game-msg').textContent = "もっと小さいです";
    }
  };

  makeWindowDraggable(win);
}