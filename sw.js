self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("my-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/page2.html",
        "/page4.html",
        "/style.css",
        "/style2.css",
        "/page5.html",
        "/suspect_players.html",
        "/1.html",
        "/results.html",
        "/main.js",
        
        "/style2.css",
        "/icon-192.png",
        "/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});