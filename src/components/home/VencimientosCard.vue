<script setup>
import { ref, watchEffect, computed } from "vue";

defineProps(['usuario'])
// Definir las diapositivas y el índice actual
const slides = [
  "Escanea para capturar datos automáticamente.",
  "Recibe alertas 30 y 15 días antes del vencimiento.",
  // Añade más textos según necesites
];
const currentSlideIndex = ref(0);

// Computar la diapositiva actual basada en el índice
const currentSlide = computed(() => slides[currentSlideIndex.value]);

// Función para actualizar la diapositiva actual
const updateSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length;
};

// Establecer el intervalo para cambiar de diapositiva
watchEffect((onInvalidate) => {
  const interval = setInterval(updateSlide, 3000);
  onInvalidate(() => clearInterval(interval));
});
</script>
<template>
  <div class="p-4" v-if="usuario == 'Multimarcas'">
    <h2 class="font-medium text-sm flex items-center justify-between">GESTOR FECHAS DE VENCIMIENTO
      <span
        class="z-20 text-[9px] font-semibold text-white bg-rose-500 px-1 py-[0.1rem] shadow-md shadow-black/30 rounded-md">NUEVO</span>

    </h2>
    <h3 class="text-xs text-gray-500">¡Gestiona tus productos con facilidad y precisión!</h3>
    <div class=" text-black py-2 flex items-center justify-between">
      
      <Transition name="slide-fade" mode="out-in">
        <p class="text-sm" :key="currentSlideIndex">{{ currentSlide }}</p>
      </Transition>
      <router-link to="/" class="text-sm font-medium text-black border border-solid border-gray-600 py-1 px-3 rounded-sm shadow-md shadow-black/30">Usar</router-link>
    </div>
  </div>
</template>
<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>