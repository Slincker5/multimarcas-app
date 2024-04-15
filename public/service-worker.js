// service-worker.js

// Escuchando el evento 'install', pero no realizando ninguna acción
self.addEventListener("install", function (event) {
  // No se realiza ninguna acción aquí
});

// Escuchando el evento 'fetch' y respondiendo con la solicitud original sin almacenar en caché
self.addEventListener("fetch", function (event) {
  event.respondWith(fetch(event.request));
});

self.addEventListener("notificationclick", function (event) {
  if (event.notification.actions[1] === "detalles") {
    const ruta = `/cintillo/${event.notification.data.path_uuid}`;
    event.notification.close();
    event.waitUntil(clients.openWindow(ruta));
  }
  if (event.notification.actions[0] === "descarga") {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.path_complete));
  }
});
