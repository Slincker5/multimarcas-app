// service-worker.js

// Escuchando el evento 'install', pero no realizando ninguna acción
self.addEventListener("install", function (event) {
  // No se realiza ninguna acción aquí
});

/* Escuchando el evento 'fetch' y respondiendo con la solicitud original sin almacenar en caché
self.addEventListener("fetch", function (event) {
  event.respondWith(fetch(event.request));
});*/


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.method !== 'GET') {
          // Si la solicitud no es GET, simplemente pasarla sin intentar cachearla
          return fetch(event.request);
        }

        return fetch(event.request)
          .then(networkResponse => {
            const clonedResponse = networkResponse.clone();
            caches.open('offline-cache')
              .then(cache => {
                cache.put(event.request, clonedResponse);
              });
            return networkResponse;
          })
          .catch(error => {
            console.log('Fetch fallido:', error);
            return caches.match('/offline.html');
          });
      })
  );
});

// Add event listener for notification click
self.addEventListener("notificationclick", function (event) {
  if (event.action === "detalles") {
    const ruta = `/cintillo/${event.notification.data.uuid}`
    event.notification.close();

    // Open the URL when the notification is clicked
    event.waitUntil(clients.openWindow(ruta));
  }
});
