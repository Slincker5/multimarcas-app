<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const token = localStorage.getItem("token");
const route = useRoute();
const idTransaccion = route.query.idTransaccion;

const esconderLoading = ref("top-0");
const enviarTransaccion = async () => {
  try {
    const params = {
      IdTransaccion: idTransaccion,
    };

    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    const { data } = await axios.post(
      "https://api.multimarcas.app/api/pagos/after-pay",
      params,
      {
        headers,
      }
    );
    if (data.status === "OK") {
      setTimeout(() => {
        esconderLoading.value = "top-[-100%]";
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};
enviarTransaccion();
</script>
<template>
  <div
    class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-green-500"
  >
    <div>
      <img
        src="../../public/credit-card.png"
        alt="loading"
        class="w-[130px] m-auto animate-bounce"
      />
      <div class="text-2xl font-medium text-center text-white">
        Pago exitoso.
      </div>
      <div class="px-6 font-light text-center text-white">
        Gracias por comprar la menbresia, esta tiene la duracion de un mes
        empezando desde ahora.
      </div>
      <div class="flex items-center justify-center">
        <a href="/" class="px-6 py-2 mt-4 text-green-500 bg-white rounded-2xl"
          >Ir a mi cuenta</a
        >
      </div>
    </div>
  </div>
  <div
    class="fixed left-0 z-50 flex items-center justify-center w-full h-full text-2xl font-medium text-black transition-all bg-white"
    :class="`${esconderLoading}`"
  >
    <img
      src="../../public/loading.gif"
      alt="loading"
      class="w-[40px]"
    />Procesando ...
  </div>
</template>
