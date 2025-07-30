export let vfs = JSON.parse(localStorage.getItem("vfs") || '{"files":{}}');
export function saveVFS() {
  localStorage.setItem("vfs", JSON.stringify(vfs));
}
