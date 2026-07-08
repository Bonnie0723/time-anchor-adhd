// 时锚 service worker —— 离线缓存
var CACHE = "time-anchor-v10";
var ASSETS = ["./index.html?v=v10", "./icon.svg", "./icon.png", "./manifest.json", "./sw.js"];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
      .then(function(){ self.skipWaiting(); })
      .catch(function(){})
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function(r){
      if (r) return r;
      return fetch(e.request).then(function(resp){
        return resp;
      }).catch(function(){
        return caches.match("./index.html?v=v10");
      });
    })
  );
});
