export const meta = {
  name: "ブラウザ",
  icon: "https://cdn.jsdelivr.net/gh/jpgya/jpgya-OS/icons/browser.png",
  desc: "Webページを閲覧できます"
};

export function main() {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="window-title">ブラウザ</div>
    <div class="window-body">
      <input id="browser-url" type="text" value="https://www.bing.com" style="width:70%">
      <button id="browser-go">移動</button>
      <iframe id="browser-frame" src="https://www.bing.com" style="width:100%;height:300px;border:1px solid #ccc;margin-top:8px;"></iframe>
    </div>
    <button class="window-close">×</button>
  `;
  document.getElementById('desktop').appendChild(win);
  win.querySelector('.window-close').onclick = () => win.remove();
  win.querySelector('#browser-go').onclick = () => {
    const url = win.querySelector('#browser-url').value;
    win.querySelector('#browser-frame').src = url;
  };
}
