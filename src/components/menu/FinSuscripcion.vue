<script setup>
import { ref } from "vue";
import CompletarOrden from "@/components/pagos/CompletarOrden.vue";
const token = ref(localStorage.getItem("token"));
defineProps(["userData", "vencio"]);
const emit = defineEmits(["openCupon"]);
</script>
<template>
  <!-- div que muestra la suscripcion vencida -->
  <div
    class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-black/80"
    v-if="
      userData &&
      token &&
      userData.profile[0].suscripcion === 0 &&
      userData.profile[0].fin_suscripcion !== null
    "
  >
    <div
      class="bg-white w-[80%] md:w-[450px] py-6 px-4 max-w-screen-sm rounded-lg shadow-2xl"
    >
      <img src="../../../public/sad.png" class="w-[30%] block m-auto" />
      <h3 class="pt-4 font-medium text-center text-black uppercase text-nomal">
        Tu membresia ha vencido!
      </h3>
      <p class="py-4 text-sm text-center text-gray-500" v-if="userData">
        Vencio el
        {{ vencio }}<br />
        <span class="text-xs">
          Puedes renovarla haciendo el pago en linea o escribiendo a atencion al
          cliente.</span
        >
      </p>
      <div class="py-4 border-y border-dashed border-[#ddd]">
        <button
          class="block px-6 py-2 mx-auto mb-4 text-sm text-center border border-solid rounded-sm shadow-lg border-neutral-700"
          @click.prevent="emit('openCupon')"
        >
          Canjear cupon
        </button>

        <div class="flex items-center justify-center">
          <CompletarOrden
            v-if="userData && userData.profile[0].suscripcion === 0"
            :btnOnly="true"
          ></CompletarOrden>
        </div>
      </div>
      <a
        href="https://wa.me/+50374329014"
        class="block p-4 font-semibold text-center text-sky-500"
        ><font-awesome-icon :icon="['fas', 'headset']" /> Atencion al cliente</a
      >
    </div>
  </div>
</template>
