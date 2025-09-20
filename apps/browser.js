import { makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "ブラウザ",
  icon: "🌐",
  desc: "Webページを閲覧できます"
};

export function main() {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="titlebar">
      ブラウザ
      <div class="window-btns">
        <button class="window-btn close">×</button>
      </div>
    </div>
    <div class="window-body">
      <input id="browser-url" type="text" value="https://example.com" style="width:60%">
      <button id="browser-go">移動</button>
      <button id="browser-newtab">新しいタブで開く</button>
      <div style="margin-top:8px;">
        <iframe id="browser-frame" src="https://example.com" style="width:100%;height:300px;border:1px solid #ccc;background:#fff;border-radius:8px;"></iframe>
      </div>
      <div id="browser-msg" style="color:#e74c3c;margin-top:6px;font-size:13px;"></div>
    </div>
  `;
  document.getElementById('desktop').appendChild(win);

  // ウィンドウをドラッグ可能にする
  makeWindowDraggable(win.querySelector('.titlebar'), win);

  // 閉じるボタン
  

  // iframeで開けるかチェック
  function tryLoad(url) {
    const iframe = win.querySelector('#browser-frame');
    iframe.src = url;
    iframe.onload = () => {
      win.querySelector('#browser-msg').textContent = "";
    };
    iframe.onerror = () => {
      win.querySelector('#browser-msg').textContent = "このページは埋め込み表示できません。新しいタブで開いてください。";
    };
    // 一部サイトはonerrorが発火しないため、タイムアウトで警告
    setTimeout(() => {
      if (iframe.contentDocument && iframe.contentDocument.body && iframe.contentDocument.body.innerHTML === "") {
        win.querySelector('#browser-msg').textContent = "このページは埋め込み表示できません。新しいタブで開いてください。";
      }
    }, 1200);
  }

  win.querySelector('#browser-go').onclick = () => {
    const url = win.querySelector('#browser-url').value;
    tryLoad(url);
  };

  win.querySelector('#browser-newtab').onclick = () => {
    const url = win.querySelector('#browser-url').value;
    window.open(url, "_blank");
  };
}
