<script setup>
defineProps(["token","userNoPhoto", "userData"])
const emit = defineEmits(["openMenu", "abrirEditarPerfil"])
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
        >MULTIMARCAS APP🎂</router-link
      >
      <nav class="flex gap-1">
        <div class="w-[30px] h-[30px] md:w-[40px] md:h-[40px]" @click="emit('abrirEditarPerfil')">
          <img
            :src="
              userData.profile[0].photo !== null
                ? userData.profile[0].photo
                : userNoPhoto
            "
            :alt="
              userData.profile[0].username === null
                ? userData.profile[0].nombre
                : userData.profile[0].username
            "
            class="object-cover w-full h-full align-middle rounded-full"
          />
        </div>
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
