const CACHE_NAME = 'ecotech-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Arquivos em cache');
          return cache.addAll(urlsToCache);
        })
    );
  
});
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response; // Retorna o recurso do cache
          }
          return fetch(event.request); // Faz a requisição se não estiver no cache
        })
    );
  });
  
  self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  self.addEventListener('push', function(event) {
    const data = event.data.json();
    console.log('Push recebido:', data);
    // criar a pasta images e baixe alguns ícones com os nomes abaixo da internet.
    const options = {
      body: data.body,
      icon: '/images/notification-icon.png',     
      badge: '/images/notification-badge.png',
      actions: [
        { action: 'open', title: 'Abrir App' },
        { action: 'close', title: 'Fechar Notificação' }
      ]
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  function askNotificationPermission() {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Permissão concedida para notificações');
        subscribeUserToPush();
      } else {
        console.log('Permissão negada para notificações');
      }
    });
  }
  