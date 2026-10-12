// Desenvolvimento: sem cache. Reativar estratégia offline no fechamento do app.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{event.respondWith(fetch(event.request,{cache:'no-store'}))});
