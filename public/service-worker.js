// service-worker.js

// Escuchando el evento 'install', pero no realizando ninguna acción
self.addEventListener("install", function (event) {
    // No se realiza ninguna acción aquí
  });
  
  // Escuchando el evento 'fetch' y respondiendo con la solicitud original sin almacenar en caché
  self.addEventListener("fetch", function (event) {
    event.respondWith(fetch(event.request));
  });
  
  // Add event listener for notification click
  self.addEventListener("notificationclick", function (event) {
    console.log(event)
    if (event.action === "detalles") {
      const ruta = `/cintillo/${event.notification.data.uuid}`
      event.notification.close();
  
      // Open the URL when the notification is clicked
      event.waitUntil(clients.openWindow(ruta));
    }
  });
  