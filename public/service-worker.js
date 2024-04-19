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
        // Si hay una respuesta en cachÃ©, devolverla
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no hay respuesta en cachÃ©, intentar obtenerla de la red
        return fetch(event.request)
          .then(networkResponse => {
            // Clonar la respuesta de la red antes de almacenarla en cachÃ©
            const clonedResponse = networkResponse.clone();
            caches.open('offline-cache')
              .then(cache => {
                cache.put(event.request, clonedResponse);
              });
            return networkResponse;
          })
          .catch(error => {
            // Si la solicitud de red falla, devolver una respuesta predeterminada o una respuesta almacenada en cachÃ©
            console.log('Fetch fallido:', error);
            return caches.match('/offline.html'); // Respuesta predeterminada o pÃ¡gina offline
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
