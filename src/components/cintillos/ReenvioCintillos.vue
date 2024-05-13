<script setup>
import { ref } from "vue";
import axios from "axios";
import { useGetRoutes } from "@/composables/getRoutes";

let { toggle, documento, total } = defineProps(["toggle", "enviando", "total", "documento"]);

const emit = defineEmits([
  "formReenviarOpen",
  "formReenviarClose",
  "enviandoTrue",
  "enviandoFalse",
]);

const email = ref(
  documento.detalles[0].email === null
    ? documento.detalles[0].receptor
    : documento.detalles[0].email === "Desconocido"
    ? documento.detalles[0].email
    : documento.detalles[0].email
);
const comentario = ref(documento.detalles[0].comentario);
const cantidad = total
const modal = ref(false);
const token = ref(localStorage.getItem("token"));
const { labelDocumentReSend } = useGetRoutes();
const eliminar = () => {
  email.value = "";
};
async function resend() {
  try {
    emit("enviandoTrue");
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const dataEnvio = {
      receptor: email.value,
      email: email.value,
      path: documento.detalles[0].path,
      comentario: comentario.value,
      cantidad: cantidad,
      code: documento.detalles[0].code,
    };

    let { data } = await axios.post(labelDocumentReSend, dataEnvio, {
      headers,
    });
    console.log(data);
    if (data.status === "OK") modal.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    emit("enviandoFalse");
  }
}
const cerrar = () => {
  emit("formReenviarClose");
  modal.value = false;
};
</script>
<template>
  <Transition>
    <div
      class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-black/80"
      v-if="toggle"
    >
      <div
        class="relative bg-white w-[80%] md:w-[450px] max-w-screen-sm rounded-lg shadow-2xl"
      >
        <div
          class="absolute top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-black/80"
          v-if="modal"
        >
          <div
            class="bg-white w-[80%] md:w-[450px] py-6 px-4 max-w-screen-sm rounded-lg shadow-2xl"
          >
            <img src="../../../public/share.gif" class="w-[30%] block m-auto" />
            <h3 class="pt-4 font-medium text-center text-black uppercase">
              Documento reenviado!
            </h3>
            <div class="p-4 pt-0">
              Puedes volver a pedirlo usando el mismo codigo de referencia
            </div>
            <div class="py-4 border-y border-dashed border-[#ddd]">
              <button
                class="block px-6 py-2 mx-auto text-sm text-center border border-solid rounded-sm shadow-lg border-neutral-700"
                @click.prevent="cerrar"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
        <h3
          class="flex items-center justify-between p-4 text-sm font-medium text-black uppercase"
        >
          <button @click.prevent="emit('formReenviarClose')">
            <font-awesome-icon :icon="['fas', 'arrow-left-long']" />
          </button>
          Reenviar documento
        </h3>
        <div class="p-4 text-sm text-yellow-700 bg-yellow-200">
          Puedes editar la informacion de envio para enviarlo a otro correo o
          seguir usando el mismo destino {{  cantidad }}
        </div>
        <form class="p-4" @submit.prevent="resend">
          <div class="mb-4">
            <label
              class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
              for="barra"
            >
              <font-awesome-icon :icon="['fas', 'at']" /> CORREO ELECTRONICO:
            </label>
            <div
              class="flex items-center justify-between border border-solid border-[#ddd] focus:border-gray-500"
            >
              <input
                class="w-full px-4 py-3 leading-tight text-gray-700 border-0 rounded-l appearance-none focus:outline-none focus:bg-white"
                id="barra"
                type="text"
                placeholder="example@example.com"
                autocomplete="off"
                required
                v-model="email"
              />
              <button
                class="px-4 py-3 transition hover:bg-gray-300"
                @click.prevent="eliminar"
              >
                <font-awesome-icon :icon="['fas', 'xmark']" />
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label
              class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
              for="barra"
            >
              <font-awesome-icon :icon="['fas', 'comment']" /> COMENTARIO:
            </label>
            <textarea
              class="w-full border border-solid border-[#ddd] focus:border-gray-500 px-4 py-3 leading-tight text-gray-700 outline-none appearance-none"
              id="barra"
              type="text"
              placeholder="Escribe un comentario al contralor"
              autocomplete="off"
              v-model="comentario"
            ></textarea>
          </div>
          <input type="submit"
            class="w-full px-6 py-2 mb-4 text-sm text-center text-white bg-indigo-800 border border-indigo-900 border-solid rounded-md shadow-lg shadow-black/20"
             value="Reenviar documento"
          >
        </form>
      </div>
    </div>
  </Transition>
</template>
