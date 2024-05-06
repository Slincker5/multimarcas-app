<script setup>
defineProps(["token"])
const emit = defineEmits(["openMenu"])
</script>
<template>
    <header
      v-if="token !== null"
      class="sticky top-0 flex items-center justify-between px-4 py-5 bgheader text-[#ECF0F1] z-30 shadow-lg shadow-black/10"
    >
      <router-link
        to="/"
        class="text-[#ECF0F1] font-medium"
        style="font-family: Fjalla One"
        >MULTIMARCAS APP</router-link
      >
      <nav class="flex gap-2">
        <router-link to="/buscar-musica" class="relative text-white">
          <div
            class="absolute top-[-3px] right-[-6px]">
            <span class="relative flex w-2 h-2">
  <span class="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
  <span class="relative inline-flex w-2 h-2 bg-red-500 rounded-full"></span>
</span>
          </div>
          <font-awesome-icon :icon="['fas', 'music']" />
        </router-link>
        <button
          class="relative pl-4 pr-2 md:hidden"
          active-class="underline"
          @click="$emit('openMenu')"
        >
          <font-awesome-icon :icon="['fas', 'bars']" />
        </button>
      </nav>
    </header>
</template>