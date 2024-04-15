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
    // Obtener la acción que se hizo clic
    const clickedAction = event.action;
  
    // Dependiendo de la acción, realizar la operación correspondiente
    switch(clickedAction) {
      case 'detalles':
        const rutaDetalles = `/cintillo/${event.notification.data.path_uuid}`;
        event.notification.close();
        event.waitUntil(clients.openWindow(rutaDetalles));
        break;
      case 'descarga':
        event.notification.close();
        event.waitUntil(clients.openWindow(event.notification.data.path_complete));
        break;
      default:
        // No hacemos nada en caso de una acción desconocida
        break;
    }
  });
  