<script setup>
defineProps(["premium"]);
</script>

<template>
  <div
    class="flex items-stretch w-full gap-1 p-4 overflow-x-auto bg-gray-100 whitespace-nowrap acciones border-b border-solid border-[#ddd] gap-x-4"
  >
    <router-link to="crear-cintillos" class="py-3 rounded-lg bg">
      <div class="flex justify-center px-2 py-4">
        <img src="../../../public/price-tag.png" class="block w-[40px]" />
      </div>
      <span class="p-2 pt-0 text-xs font-semibold text-black"
        >Crear Cintillos</span
      >
    </router-link>
    <router-link to="/buscador" class="relative py-3 rounded-lg bg">
      <div
        class="z-20 animate-bounce absolute top-[-5px] right-[-10px] text-[9px] font-semibold text-white bg-rose-500 px-1 py-[0.1rem] shadow-md shadow-black/30 rounded-md"
        v-if="premium === 0"
      >
        GRATIS
      </div>
      <div class="flex justify-center px-2 py-4">
        <img src="../../../public/dairy-products.png" class="block w-[40px]" />
      </div>
      <span class="p-2 pt-0 text-xs font-semibold text-black"
        >Buscar Internos</span
      >
    </router-link>
    <router-link
      to="/crear-afiches-mini-descuentos"
      class="relative py-3 rounded-lg bg"
    >
      <div class="flex justify-center px-2 py-4">
        <img src="../../../public/descuento.png" class="block w-[40px]" />
      </div>
      <span class="p-2 pt-0 text-xs font-semibold text-black"
        >Crear Afiches</span
      >
    </router-link>
    <router-link to="/crear-afiches-mini" class="relative py-3 rounded-lg bg">
      <div class="flex justify-center px-2 py-4">
        <img src="../../../public/rotulo-dos.png" class="block w-[40px]" />
      </div>
      <span class="p-2 pt-0 text-xs font-semibold text-black"
        >Crear Afiches</span
      >
    </router-link>
    <router-link to="/crear-afiches" class="relative py-3 rounded-lg bg">
      <div class="flex justify-center px-2 py-4">
        <img src="../../../public/rotulo-uno.png" class="block w-[40px]" />
      </div>
      <span class="p-2 pt-0 text-xs font-semibold text-black"
        >Crear Afiches</span
      >
    </router-link>

    <router-link to="/crear-afiches-baja-mini" class="py-3 rounded-lg bg">
      <div class="flex justify-center px-2 py-4">
        <img src="../../../public/precio_bajo.png" class="block w-[40px]" />
      </div>
      <span class="p-2 pt-0 text-xs font-semibold text-black"
        >Crear Afiches</span
      >
    </router-link>
    <router-link to="/acortador" class="relative py-3 rounded-lg bg">
      <div
        class="z-20 animate-bounce absolute top-[-5px] right-[-10px] text-[9px] font-semibold text-white bg-rose-500 px-1 py-[0.1rem] shadow-md shadow-black/30 rounded-md"
      >
        NUEVO
      </div>
      <span
        class="absolute top-0 right-0 inline-flex w-3 h-3 font-black rounded-full opacity-75 animate-ping bg-rose-700"
      ></span>
      <div class="flex justify-center px-2 py-4">
        <img src="../../../public/http.png" class="block w-[40px]" />
      </div>
      <span class="p-2 pt-0 text-xs font-semibold text-black">Acortar URL</span>
    </router-link>
  </div>
</template>
