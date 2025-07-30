export let vfs = JSON.parse(localStorage.getItem("vfs") || '{"files":{"readme.txt":"Ultimate Web OSへようこそ！"}}');
export function saveVFS() {
  localStorage.setItem("vfs", JSON.stringify(vfs));
}
