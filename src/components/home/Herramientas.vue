<script setup>
defineProps(["premium"]);
const items = [
  {
    name: "Crear Cintillos",
    href: "/crear-cintillos",
    premium: true,
    alt: "crear-cintillos",
  },
  {
    name: "Buscar Internos",
    href: "/buscador",
    premium: false,
    alt: "buscar-internos",
  },
  {
    name: "Afiches desc...",
    href: "/crear-afiches-mini-descuentos",
    premium: true,
    alt: "afiches-descuento",
  },
  {
    name: "Afiches oferta",
    href: "/crear-afiches-mini",
    premium: true,
    alt: "afiches-oferta",
  },
  {
    name: "Afiches de baja",
    href: "/crear-afiches-baja-mini",
    premium: true,
    alt: "afiches-de-baja",
  },
  {
    name: "Afiches base",
    href: "/crear-afiches",
    premium: true,
    alt: "afiches-base",
  },
];
</script>
<template>
  <div
    class="flex items-stretch w-full p-4 overflow-x-auto bg-white gap-x-4 whitespace-nowrap acciones"
  >
    <router-link
      :to="item.href"
      class="relative py-3 font-semibold rounded-lg bg"
      v-for="(item, index) in items"
      :key="index"
    >
      <div
        class="z-20 animate-bounce absolute top-[-5px] right-[-10px] text-[9px] font-medium text-white bg-green-500 px-1 py-[0.1rem] shadow-md shadow-black/30 rounded-md"
        v-if="!item.premium && premium === 0"
      >
        FREE
      </div>
      <div class="flex justify-center px-2 py-4">
        <img src="../../../public/price-tag.png" :alt="item.alt" v-if="item.alt === 'crear-cintillos'" class="shimg block w-[40px]" />
        <img src="../../../public/dairy-products.png" :alt="item.alt" v-if="item.alt === 'buscar-internos'" class="shimg block w-[40px]" />
        <img src="../../../public/descuento.png" :alt="item.alt" v-if="item.alt === 'afiches-descuento'" class="shimg block w-[40px]" />
        <img src="../../../public/rotulo-dos.png" :alt="item.alt" v-if="item.alt === 'afiches-oferta'" class="shimg block w-[40px]" />
        <img src="../../../public/precio_bajo.png" :alt="item.alt" v-if="item.alt === 'afiches-de-baja'" class="shimg block w-[40px]" />
        <img src="../../../public/rotulo-uno.png" :alt="item.alt" v-if="item.alt === 'afiches-base'" class="shimg block w-[40px]" />
      </div>
      <span class="p-2 pt-0 text-xs font-medium text-black">{{
        item.name
      }}</span>
    </router-link>
  </div>
</template>