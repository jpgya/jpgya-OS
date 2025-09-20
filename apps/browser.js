import { makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "ブラウザ",
  icon: "🌐",
  desc: "Webページを閲覧できます"
};

// container を受け取る形に変更
export function main(container) {
  container.innerHTML = `
    <input id="browser-url" type="text" value="https://example.com" style="width:60%">
    <button id="browser-go">移動</button>
    <button id="browser-newtab">新しいタブで開く</button>
    <div style="margin-top:8px;">
      <iframe id="browser-frame" src="https://example.com" style="width:100%;height:300px;border:1px solid #ccc;background:#fff;border-radius:8px;"></iframe>
    </div>
    <div id="browser-msg" style="color:#e74c3c;margin-top:6px;font-size:13px;"></div>
  `;

  // iframeで開けるかチェック
  function tryLoad(url) {
    const iframe = container.querySelector('#browser-frame');
    iframe.src = url;
    iframe.onload = () => {
      container.querySelector('#browser-msg').textContent = "";
    };
    iframe.onerror = () => {
      container.querySelector('#browser-msg').textContent = "このページは埋め込み表示できません。新しいタブで開いてください。";
    };
    setTimeout(() => {
      if (iframe.contentDocument && iframe.contentDocument.body && iframe.contentDocument.body.innerHTML === "") {
        container.querySelector('#browser-msg').textContent = "このページは埋め込み表示できません。新しいタブで開いてください。";
      }
    }, 1200);
  }

  container.querySelector('#browser-go').onclick = () => {
    const url = container.querySelector('#browser-url').value;
    tryLoad(url);
  };

  container.querySelector('#browser-newtab').onclick = () => {
    const url = container.querySelector('#browser-url').value;
    window.open(url, "_blank");
  };
}
