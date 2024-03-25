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
        <button class="relative hidden text-white">
          <div
            class="absolute right-[-10px] top-0 inline-flex items-center justify-center bg-rose-500 text-white text-xs font-extralight rounded-full no-underline w-[14px] h-[14px]"
          >
            1
          </div>
          <font-awesome-icon :icon="['fas', 'bell']" />
        </button>
        <button
          class="pl-4 pr-2 md:hidden"
          active-class="underline"
          @click="$emit('openMenu')"
        >
          <font-awesome-icon :icon="['fas', 'bars']" />
        </button>
      </nav>
    </header>
</template>