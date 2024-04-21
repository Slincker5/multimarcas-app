<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Estado para controlar si el prompt de instalación debe mostrarse
const eventoDiferido = ref(null);
const mostrarBotonInstalar = ref(false);

const esPWAInstalada = () =>
  window.navigator.standalone ||
  window.matchMedia("(display-mode: standalone)").matches;

// Manejador del evento `beforeinstallprompt`
const capturarEventoInstalacion = (e) => {
  if (!esPWAInstalada()) {
    // Prevenir el comportamiento por defecto y guardar el evento
    e.preventDefault();
    eventoDiferido.value = e;
    mostrarBotonInstalar.value = true;
  }
};

// Función para invocar el prompt de instalación
const instalarPWA = async () => {
  if (eventoDiferido.value) {
    eventoDiferido.value.prompt();
    const resultado = await eventoDiferido.value.userChoice;
    if (resultado.outcome === "accepted") {
      console.log("El usuario aceptó la instalación");
    } else {
      console.log("El usuario rechazó la instalación");
    }
    eventoDiferido.value = null;
    mostrarBotonInstalar.value = false;
  }
};

onMounted(() => {
  window.addEventListener("beforeinstallprompt", capturarEventoInstalacion);
});
</script>

<template>
  <div
    class="flex items-center justify-between bg-black"
    v-if="mostrarBotonInstalar"
  >
    <img
      src="../../public/install.png"
      alt="atención al cliente"
      class="w-[75px] block p-4"
    />
    <div class="w-full p-4 pl-0">
      <h3 class="font-medium text-white uppercase">MULTIMARCAS APP</h3>
      <p class="text-sm font-light text-white">
        Ahora ya puedes instalar nuestra app.
      </p>
    </div>
    <div class="flex justify-end p-2">
      <button
        class="px-4 py-2 text-xs font-medium text-black bg-white rounded-lg"
        @click="instalarPWA"
      >
        Instalar
      </button>
    </div>
  </div>
</template>
