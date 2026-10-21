// Lernwelten 2.1 – offline first app shell; all quizzes and games are bundled in index.html.
const VERSION = 'lernwelten-app-2.1-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './app-install.js',
  './icons/favicon-32.png', './icons/apple-touch-icon.png', './icons/icon-192.png',
  './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('lernwelten-app-') && k !== VERSION).map(k => caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  // Fetch HTML afresh online (for updates) and use cached page without connection.
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok){const clone=response.clone();caches.open(VERSION).then(cache=>cache.put('./index.html',clone));}
      return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{
    if(response.ok){const clone=response.clone();caches.open(VERSION).then(cache=>cache.put(request,clone));}
    return response;
  })));
});
