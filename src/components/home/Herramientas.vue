<script setup>
defineProps(["premium"]);
const rutaBase = "../../../public";
const items = [
  {
    image: `${rutaBase}/price-tag.png`,
    name: "Crear Cintillos",
    href: "/crear-cintillos",
    premium: true,
    alt: "crear-cintillos",
  },
  {
    image: `${rutaBase}/dairy-products.png`,
    name: "Buscar Internos",
    href: "/buscador",
    premium: false,
    alt: "buscar-internos",
  },
  {
    image: `${rutaBase}/descuento.png`,
    name: "Afiches desc...",
    href: "/crear-afiches-mini-descuentos",
    premium: true,
    alt: "afiches-descuento",
  },
  {
    image: `${rutaBase}/rotulo-dos.png`,
    name: "Afiches oferta",
    href: "/crear-afiches-mini",
    premium: true,
    alt: "afiches-oferta",
  },
  {
    image: `${rutaBase}/precio_bajo.png`,
    name: "Afiches de baja",
    href: "/crear-afiches-baja-mini",
    premium: true,
    alt: "afiches-de-baja",
  },
  {
    image: `${rutaBase}/rotulo-uno.png`,
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
        <img :src="item.image" :alt="item.alt" class="shimg block w-[40px]" />
      </div>
      <span class="p-2 pt-0 text-xs font-medium text-black">{{
        item.name
      }}</span>
    </router-link>
  </div>
</template>