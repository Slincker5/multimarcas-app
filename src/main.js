import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { fas } from '@fortawesome/free-solid-svg-icons'

if ('serviceWorker' in navigator) {
    // Obtener la referencia al Service Worker que deseas desinstalar
    navigator.serviceWorker.getRegistration('./sw.js').then(function(registration) {
      if (registration) {
        // Desinstalar el Service Worker
        registration.unregister().then(function(success) {
          console.log('Service Worker desinstalado con éxito:', registration);
        }).catch(function(error) {
          console.error('Error al desinstalar el Service Worker:', error);
        });
      } else {
        console.log('No se encontró el Service Worker para desinstalar');
      }
    });
  }
  

library.add(fas)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)



app.mount('#app')
