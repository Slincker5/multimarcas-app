<script setup>
import { ref, watchEffect, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useGetRoutes } from "@/composables/getRoutes";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();
const { url, labelBuild } = useGetRoutes();

const token = ref(localStorage.getItem("token"));

const archivoGenerado = ref(false);

const correo = ref("");
const enviando = ref(false);

const enviar = async () => {
  try {
    if (correo.value === "") {
      toast.error("Debes llenar ambos campos.", {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    } else {
      enviando.value = true;
      const datos = {
        receptor: correo.value,
        nombreReceptor: "Desconocido",
        comentarios: "",
      };
      const headers = {
        Authorization: "Bearer " + token.value,
        "Content-Type": "application/json",
      };
      const { data } = await axios.post(labelBuild, datos, { headers });
      archivoGenerado.value = data;
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

// Definir las diapositivas y el índice actual
const slides = [
  "Redacta bien tu correo electrónico de lo contrario no se enviará.",
  "A veces los correos caen en la bandeja de spam, siempre es bueno dar un vistazo.",
  // Añade más textos según necesites
];
const currentSlideIndex = ref(0);

// Computar la diapositiva actual basada en el índice
const currentSlide = computed(() => slides[currentSlideIndex.value]);

// Función para actualizar la diapositiva actual
const updateSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length;
};

// Establecer el intervalo para cambiar de diapositiva
watchEffect((onInvalidate) => {
  const interval = setInterval(updateSlide, 5000);
  onInvalidate(() => clearInterval(interval));
});
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

    <div class="p-4 text-black recomendaciones">
      <b class="block mb-2 text-sm font-medium">RECOMENDACIONES</b>
      <Transition name="fade" mode="out-in">
        <p class="text-xs" :key="currentSlideIndex">{{ currentSlide }}</p>
      </Transition>
    </div>

    <div class="p-4">
      <div class="flex flex-wrap mt-0 mb-6 -mx-3">
        <div class="w-full px-3">
          <label
            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
            for="grid-password"
          >
            Correo personalizado:
          </label>
          <input
            class="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="ESCRIBE TU CORREO"
            autocomplete="off"
            v-model="correo"
            required
          />
          <p class="text-xs font-light text-gray-600">
            <font-awesome-icon :icon="['fas', 'info-circle']" /> Escribe el
            correo donde deseas enviar los cintillos.
          </p>
        </div>
      </div>
      <button
        class="w-full px-4 py-2 font-bold text-white border rounded bg-[#455A64] hover:bg-[#37474F] border-[#303E46] shadow-md"
        @click.prevent="enviar"
      >
        COMPARTIR CINTILLOS
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
          Para encontrar mas rapido tus cintillos en la bandeja de entrada,
          puedes buscarlos con este codigo.

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
              :href="`${url}/${archivoGenerado.path_tmp_full}`"
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
<style>
.recomendaciones {
  background: rgb(255, 242, 165);
  background: linear-gradient(
    114deg,
    rgba(255, 242, 165, 1) 36%,
    rgba(252, 255, 231, 1) 100%
  );
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
