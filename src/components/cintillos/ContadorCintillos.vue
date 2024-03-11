<script setup>
const prop = defineProps(["listaCintillos", "loading"]);
const porcentaje = ((prop.listaCintillos / 448) * 100).toFixed(0);
const avance = `w-[${porcentaje}%]`;
</script>
<template>
  <div class="text-white bg-zinc-800" v-if="listaCintillos > 0">
    <h3 class="p-4 pb-0 text-sm font-medium text-slate-200">
      <font-awesome-icon :icon="['fas', 'gears']" beat-fade /> PROGRESO DE
      CINTILLOS:
    </h3>
    <div class="flex items-center justify-between gap-4 p-4 pt-0">
      <div class="flex-1">
        <div
          class="relative block w-full h-4 rounded-full shadow-lg sombra bg-zinc-900"
        >
          <div
            class="absolute top-0 left-0 w-full h-4 text-xs font-medium text-center bg-transparent rounded-full text-zinc-200"
          >
            {{ listaCintillos }} de 448 cintillos.
          </div>
          <div class="h-4 rounded-full bgcontador" :style="{ width: porcentaje + '%' }"></div>
        </div>
      </div>
      <div>
        <router-link
          to="/descargas"
          class="inline-flex items-center px-4 py-1 text-sm rounded-sm text-white bgcontador hover:bg-[#37474F] shadow-lg"
        >
          Compartir {{ avance }}
        </router-link>
      </div>
    </div>
  </div>
</template>
<style>
.bgcontador {
  background: linear-gradient(
    60deg,
    rgba(84, 58, 183, 1) 0%,
    rgba(0, 172, 193, 1) 100%
  );
}
.sombra {
  box-shadow: 0px 0px 9px rgba(14, 165, 233, 0.2);
}
</style>
