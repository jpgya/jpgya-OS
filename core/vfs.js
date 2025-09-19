export let vfs = JSON.parse(localStorage.getItem("vfs") || '{"files":{"readme.txt":"Ultimate Web OSへようこそ！"}}');
export function saveVFS() {
  localStorage.setItem("vfs", JSON.stringify(vfs));
}

// 仮想ファイルシステムの雛形（必要に応じて拡張）
export function readFile(path) {
  return localStorage.getItem("vfs:" + path);
}
export function writeFile(path, data) {
  localStorage.setItem("vfs:" + path, data);
}
export function deleteFile(path) {
  localStorage.removeItem("vfs:" + path);
}
export function listFiles(prefix = "") {
  const files = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith("vfs:" + prefix)) {
      files.push(k.slice(4));
    }
  }
  return files;
}
