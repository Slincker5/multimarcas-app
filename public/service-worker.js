importScripts("https://js.pusher.com/beams/service-worker.js");

const CACHE_NAME = 'my-app-cache-v1';

const urlsToCache = [
  '/'
];

self.addEventListener('install', event => {
  // Realizar la instalación del Service Worker y agregar los archivos a la caché
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Intercepta las solicitudes de recursos y las maneja desde el caché si están disponibles
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si se encuentra en caché, devolver el recurso desde el caché
        if (response) {
          return response;
        }

        // Si no está en caché, realizar la solicitud de red
        return fetch(event.request);
      })
  );
});

// Manejar el evento beforeinstallprompt
self.addEventListener('beforeinstallprompt', event => {
  // Muestra la ventana de instalación predeterminada del navegador
  event.prompt();
});
