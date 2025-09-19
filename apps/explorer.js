import { listFiles, readFile, writeFile, deleteFile } from "../core/vfs.js";
import { makeWindowDraggable } from "../core/ui.js";

export const meta = {
  name: "ファイル管理",
  icon: "📁",
  desc: "仮想ファイルシステムの閲覧・ダウンロード"
};

export function main() {
  const win = document.createElement('div');
  win.className = "window";
  win.innerHTML = `
    <div class="window-title">ファイル管理</div>
    <div class="window-body">
      <div style="display:flex;gap:24px;">
        <div style="flex:1;">
          <div style="font-weight:bold;margin-bottom:8px;">ファイル一覧</div>
          <ul id="explorer-list" style="list-style:none;padding:0;margin:0;max-height:200px;overflow:auto;"></ul>
          <button id="explorer-refresh" style="margin-top:8px;">再読み込み</button>
        </div>
        <div style="flex:2;">
          <div style="font-weight:bold;margin-bottom:8px;">内容</div>
          <textarea id="explorer-content" style="width:100%;height:120px;"></textarea>
          <div style="margin-top:8px;">
            <button id="explorer-save">保存</button>
            <button id="explorer-delete">削除</button>
            <button id="explorer-download">ダウンロード</button>
          </div>
          <div id="explorer-msg" style="margin-top:8px;color:#0af;"></div>
        </div>
      </div>
      <div style="margin-top:16px;">
        <input id="explorer-newname" type="text" placeholder="新規ファイル名" style="width:160px;">
        <button id="explorer-new">新規作成</button>
        <input id="explorer-upload" type="file" style="display:none;">
        <button id="explorer-upload-btn">アップロード</button>
      </div>
    </div>
    <button class="window-close">×</button>
  `;
  document.getElementById('desktop').appendChild(win);
  win.querySelector('.window-close').onclick = () => win.remove();

  const list = win.querySelector('#explorer-list');
  const content = win.querySelector('#explorer-content');
  const msg = win.querySelector('#explorer-msg');
  let currentFile = null;

  function refreshList() {
    list.innerHTML = "";
    listFiles().forEach(fn => {
      const li = document.createElement('li');
      li.textContent = fn;
      li.style.cursor = "pointer";
      li.style.padding = "4px 0";
      li.onclick = () => {
        currentFile = fn;
        content.value = readFile(fn) || "";
        msg.textContent = fn + " を読み込みました";
      };
      list.appendChild(li);
    });
  }
  refreshList();

  win.querySelector('#explorer-refresh').onclick = refreshList;

  win.querySelector('#explorer-save').onclick = () => {
    if (!currentFile) {
      msg.textContent = "ファイルを選択してください";
      return;
    }
    writeFile(currentFile, content.value);
    msg.textContent = "保存しました";
    refreshList();
  };

  win.querySelector('#explorer-delete').onclick = () => {
    if (!currentFile) {
      msg.textContent = "ファイルを選択してください";
      return;
    }
    deleteFile(currentFile);
    msg.textContent = "削除しました";
    content.value = "";
    currentFile = null;
    refreshList();
  };

  win.querySelector('#explorer-new').onclick = () => {
    const fn = win.querySelector('#explorer-newname').value;
    if (!fn) {
      msg.textContent = "ファイル名を入力してください";
      return;
    }
    writeFile(fn, "");
    msg.textContent = "新規作成しました";
    refreshList();
  };

  // 外部ファイルのダウンロード
  win.querySelector('#explorer-download').onclick = () => {
    if (!currentFile) {
      msg.textContent = "ファイルを選択してください";
      return;
    }
    const blob = new Blob([content.value], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = currentFile;
    a.click();
    URL.revokeObjectURL(a.href);
    msg.textContent = "ダウンロードしました";
  };

  // 外部ファイルのアップロード
  win.querySelector('#explorer-upload-btn').onclick = () => {
    win.querySelector('#explorer-upload').click();
  };
  win.querySelector('#explorer-upload').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      writeFile(file.name, ev.target.result);
      msg.textContent = file.name + " をアップロードしました";
      refreshList();
    };
    reader.readAsText(file);
  };

  makeWindowDraggable(win);
}
