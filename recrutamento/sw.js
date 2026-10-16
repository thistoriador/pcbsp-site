// Recrutamento PCB-SP: não armazenar cadastros, respostas autenticadas ou APIs em cache.
const CACHE_NAME = 'pcbsp-recrutamento-shell-v3';
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('pcbsp-recrutamento-')).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  // Todo conteúdo permanece online, incluindo HTML e chamadas autenticadas.
  return;
});
