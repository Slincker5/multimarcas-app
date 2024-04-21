<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Estado para controlar si el prompt de instalación debe mostrarse
const eventoDiferido = ref(null);
const mostrarBotonInstalar = ref(false);

const esPWAInstalada = () => window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

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
    if (resultado.outcome === 'accepted') {
      console.log('El usuario aceptó la instalación');
    } else {
      console.log('El usuario rechazó la instalación');
    }
    eventoDiferido.value = null;
    mostrarBotonInstalar.value = false;
  }
};

onMounted(() => {
  window.addEventListener('beforeinstallprompt', capturarEventoInstalacion);
});


</script>
<template>
<div class="p-8">
    <div
        class="flex items-start justify-between bg-neutral-800" v-if="mostrarBotonInstalar"
      >
        <img
          src="../../public/install.png"
          alt="atención al cliente"
          class="w-[75px] block p-4"
        />
        <div class="w-full p-4 pl-0">
          <h3 class="text-sm font-medium text-white uppercase">
            MULTIMARCAS APP
          </h3>
          <p class="text-sm font-light text-white">
            Ahora ya puedes instalar nuestra app.
          </p>
          <div class="flex justify-end p-2">
            <button 
              class="px-4 py-2 text-xs font-medium text-black bg-white rounded-lg"  @click="instalarPWA"
            >
              Instalar 
            </button>
          </div>
        </div>
      </div>
    <div class="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[400px] w-[200px]">
    <div class="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
    <div class="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
    <div class="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
    <div class="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
    <div class="rounded-[2rem] overflow-hidden w-[175px] h-[375px] bg-white dark:bg-gray-800">
        <img src="../../public/screenshot_uno.jpg" class="w-full dark:hidden" alt="">
        <img src="../../public/screenshot_uno.jpg" class="hidden w-full dark:block" alt="">
    </div>
</div>
</div>
</template>
