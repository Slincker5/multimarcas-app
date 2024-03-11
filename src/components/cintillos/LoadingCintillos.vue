<script setup>
import ListaCintillos from './ListaCintillos.vue';

defineProps(["loading", "listaCintillos"]);
</script>
<template>
  <div>
    
    <div
      class="flex items-center justify-center text-xl font-light text-gray-500 h-52"
      v-if="loading"
    >
      <font-awesome-icon :icon="['fas', 'circle-notch']" spin class="mr-2" />
      Cargando cintillos ...
    </div>
    <div v-else>
        <h1
      class="flex items-center justify-between p-4 font-medium text-gray-800"
    ><router-link to="/crear-cintillos"
          ><font-awesome-icon :icon="['fas', 'chevron-left']" /> VOLVER</router-link
        >
      LISTA DE CINTILLOS
    </h1>
      <div
        class="flex items-center justify-center text-xl font-light text-gray-500 h-52"
        v-if="ListaCintillos.length === 0"
      >
        <font-awesome-icon :icon="['fas', 'face-sad-cry']" class="mr-2" />
        Todavia no has creado cintillos.
      </div>
    </div>
  </div>
</template>
