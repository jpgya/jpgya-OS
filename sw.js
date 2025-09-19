const CACHE_NAME = "webos-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style/main.css",
  "./style/window.css",
  "./style/apps.css",
  // 必要に応じてアプリやコアJSファイルも追加
  "./core/os.js",
  "./core/ui.js",
  "./core/vfs.js",
  "./apps/apps.js",
  "./apps/browser.js",
  "./apps/calc.js",
  "./apps/editor.js",
  "./apps/explorer.js",
  "./apps/terminal.js",
  "./apps/game.js",
  "./apps/vscode.js",
  "./apps/settings.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});