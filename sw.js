// Aalam : fonctionne hors ligne. La page est toujours redemandée au réseau d'abord
// (pour recevoir les mises à jour), puis servie depuis le cache si le réseau manque.
const CACHE = "aalam-v11";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const url = new URL(r.url);
  if (r.mode === "navigate" || (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname))){
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return res; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  // bibliothèques, polices, icônes : cache d'abord
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if (res.ok || res.type === "opaque"){ const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); }
    return res;
  })));
});

// Rappels : afficher la notification reçue, puis ouvrir la bonne fiche quand on la touche
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch(_){ d = {body: e.data && e.data.text()}; }
  e.waitUntil(self.registration.showNotification(d.title || "Aalam", {
    body: d.body || "", icon: "./icons/icon-192.png", badge: "./icons/icon-192.png", data: {url: d.url || "./"}
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(list => {
    for (const c of list){ if ("navigate" in c){ return c.focus().then(() => c.navigate(url)); } }
    return self.clients.openWindow(url);
  }));
});
