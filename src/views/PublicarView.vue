<script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  const token = ref(localStorage.getItem('token'))
  const comentario = ref('')
  
  const publicar = async () => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + token.value,
        'Content-Type': 'application/json'
      }
      const param = {
        message: comentario.value
      }
      const { data } = await axios.post('https://procter.work/api/post/publicar', param, { headers })
      alert(data.message)
    }catch(error){
      console.log(error)
    }
    
  }
<<<<<<< HEAD
  let currentWindow;

function openAndCloseWindow() {
  // Si hay una ventana abierta, ciérrala
  if (currentWindow && !currentWindow.closed) {
    currentWindow.close();
  }

  const baseUrl = "https://potskolu.net/4/6371607";
  
  // Abre una nueva ventana
  currentWindow = window.open(baseUrl, '_blank');

  // Espera 4 segundos y luego invoca nuevamente a la función 
  // para cerrar la ventana actual y abrir la siguiente
  setTimeout(openAndCloseWindow, 5000);
}

openAndCloseWindow(); // Inicia el proceso

=======
  setInterval(function() {
  location.reload(); // Refresca la página
}, 8000);
>>>>>>> 014514af0170066b363f5fefeff39f385be78277
</script>
<template>
  <form @submit.prevent="publicar">
    <input type="text" placeholder="Escribe tu comentario " v-model="comentario">
    <input type="submit" value="Comentar">
    
  </form>
  <object data="https://www.highcpmrevenuegate.com/fb39tv3v4i?key=cf3354ad33dfc06388d6e903a61effd1"></object>

</template>