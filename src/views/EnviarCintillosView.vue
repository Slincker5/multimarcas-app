<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useGetRoutes } from "@/composables/getRoutes";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();
const { url, emailList, labelBuild } = useGetRoutes();

const token = ref(localStorage.getItem("token"));

const correos = ref([]);
const archivoGenerado = ref(false);
const obtenerCorreos = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.get(emailList, { headers });
    correos.value = data;
  } catch (error) {
    console.log(error);
  }
};
obtenerCorreos();

const infoSala = ref("");
const comentario = ref("");
const enviando = ref(false);

const enviar = async () => {
  try {
    if (infoSala.value === "") {
      toast.error("Debes llenar ambos campos.", {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    } else {
      enviando.value = true;
      const datos = {
        receptor: infoSala.value.correo,
        nombreReceptor: infoSala.value.sala,
        comentarios: comentario.value,
      };
      const headers = {
        Authorization: "Bearer " + token.value,
        "Content-Type": "application/json",
      };
      const { data } = await axios.post(labelBuild, datos, { headers });
      archivoGenerado.value = data;
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          var notificationData = {
            icon: "/icon.png",
            body: `📨 Correo enviado a ${infoSala.value.sala}`,
            data: { uuid: archivoGenerado.value.path_uuid },
            actions: [
              {
                action: "detalles",
                title: archivoGenerado.value.path_uuid,
              },
            ],
          };

          registration.showNotification("CINTILLOS ENVIADOS", notificationData);
        });
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    enviando.value = false;
  }
};

const volver = () => {
  router.push("/");
};
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Enlace copiado al portapapeles.", {
      theme: "colored",
      autoClose: 1500,
      position: toast.POSITION.TOP_LEFT,
      transition: toast.TRANSITIONS.ZOOM,
    });
  } catch (err) {
    console.error("No se pudo copiar el texto:", err);
  }
}
</script>
<template>
  <div class="bg-white">
    <h1 class="flex items-center justify-between p-4 font-bold text-gray-800">
      <router-link to="/cintillos"
        ><font-awesome-icon :icon="['fas', 'chevron-left']" />
        VOLVER</router-link
      >
      <span><font-awesome-icon :icon="['fas', 'at']" /> ENVIAR POR CORREO</span>
    </h1>

    <div class="p-4">
      <select
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        v-model="infoSala"
      >
        <option disabled value="">SELECCIONA UNA SALA</option>
        <option v-for="correo in correos" :value="correo">
          {{ correo.sala }}
        </option>
      </select>

      <div class="flex flex-wrap mt-4 mb-6 -mx-3">
        <div class="w-full px-3">
          <label
            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
            for="grid-password"
          >
            COMENTARIOS (opcional):
          </label>
          <input
            class="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="ESCRIBE UN COMENTARIO"
            autocomplete="off"
            v-model="comentario"
            required
          />
          <p class="text-xs font-light text-gray-600">
            <font-awesome-icon :icon="['fas', 'info-circle']" /> el contralor
            podra ver este comentario por si necesitas ayuda extra.
          </p>
        </div>
      </div>
      <button
        class="w-full px-4 py-2 font-bold text-white border rounded bg-[#455A64] hover:bg-[#37474F] border-[#303E46] shadow-md"
        @click.prevent="enviar"
      >
        ENVIAR A COMPUTO
      </button>
      <div
        class="fixed w-full h-full flex items-center justify-center text-white bg-[#263238] p-4 text-xl top-0 left-0 z-50"
        v-if="enviando"
      >
        <span>
          Enviando correo<br />
          <font-awesome-icon :icon="['fas', 'spinner']" class="fa-pulse" />
          Espera unos segundos...
        </span>
      </div>

      <div
        class="fixed top-0 left-0 z-50 w-full h-full text-xl text-black bg-white"
        v-if="archivoGenerado"
      >
        <h2
          class="flex items-center justify-between p-4 pb-0 font-medium text-gray-800 uppercase"
        >
          Correo enviado con exito<button @click="volver">
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>
        </h2>
        <div class="border-b border-solid border-[#ddd]">
          <div class="p-4 pb-0">
            <span class="font-medium text-gray-800">Archivo:</span>
            <span class="text-xs">{{ archivoGenerado.path_name }}</span>
          </div>
          <div class="p-4">
            <span class="font-medium text-gray-800"
              >Cantidad de cintillos:</span
            >
            {{ archivoGenerado.cantidad }}
          </div>
        </div>
        <div class="p-4 bg-gray-100 border-b border-solid border-[#ddd]">
          Ahora puedes pedir tus cintillos en computo usando el siguiente codigo

          <div
            class="flex items-center justify-between border border-solid border-[#ddd] p-3 bg-white"
          >
            <div class="">{{ archivoGenerado.code }}</div>
            <button @click="copyToClipboard(archivoGenerado.code)">
              <font-awesome-icon :icon="['fas', 'clipboard']" /> COPIAR
            </button>
          </div>
        </div>
        <div>
          <h2
            class="flex items-center justify-between p-4 pb-0 font-medium text-gray-800 uppercase"
          >
            guardar documento
          </h2>
          <div class="flex items-center justify-between p-4">
            <a
              :href="`${url}/${archivoGenerado.path_complete}`"
              class="inline-flex items-center px-4 py-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
            >
              <svg
                class="w-4 h-4 mr-2 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              <span>Descargar</span>
            </a>
            <button
              class="px-4 py-2 font-bold text-blue-400 uppercase"
              @click="volver"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
