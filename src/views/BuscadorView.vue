<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useBusquedasStore } from "@/stores/busquedas";
import axios from "axios";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useGetRoutes } from "@/composables/getRoutes";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
// variables iniciales
const busqueda = ref("");
const ultimaBusqueda = ref("");
const ultimaBusquedaVal = ref(false);
const scan = ref(false);
const codeReader = new BrowserMultiFormatReader();
let selectedDeviceId;
const token = ref(localStorage.getItem("token"));
const { searchLabel } = useGetRoutes();

// variables de estado
const useBusquedas = useBusquedasStore();
const { resultados } = storeToRefs(useBusquedas);
const { busquedasEncontradas } = useBusquedas;
const resultadoKey = ref(0);

watch(resultados, () => {
  // incrementa la clave cada vez que cambian los resultados
  resultadoKey.value += 1;
});

const resetSearch = () => {
  busqueda.value = "";
};

const loader = ref(false);
const buscar = async () => {
  try {
    loader.value = true;
    const { data } = await axios.get(`${searchLabel}${busqueda.value}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    busquedasEncontradas(data);
    ultimaBusqueda.value = busqueda.value;
    ultimaBusquedaVal.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    loader.value = false;
  }
};

onMounted(() => {
  codeReader
    .listVideoInputDevices()
    .then((videoInputDevices) => {
      selectedDeviceId =
        videoInputDevices[videoInputDevices.length - 1].deviceId;
    })
    .catch((err) => {
      console.error(err);
    });
});

const startScanner = async () => {
  scan.value = true;
  codeReader.decodeFromVideoDevice(
    selectedDeviceId,
    "video",
    async (res, err) => {
      if (res) {
        busqueda.value = res.text;
        resetScanner();
      } else if (err && !(err instanceof NotFoundException)) {
        console.log(err);
      }
    }
  );
};

const resetScanner = () => {
  scan.value = false;
  codeReader.reset();
};
</script>
<template>
  <div>
    <div
      class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
      v-if="scan"
    >
      <div class="relative p-4 bg-white">
        <div class="flex items-center justify-between pb-4">
          <h2 class="text-xl">Escanear Producto</h2>
          <button @click.prevent="resetScanner">
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>
        </div>
        <video id="video" width="300" height="200"></video>
      </div>
    </div>

    <h1 class="flex items-center justify-between p-4 font-medium text-gray-800">
      <router-link to="/"
        ><font-awesome-icon :icon="['fas', 'chevron-left']" />
        VOLVER</router-link
      >
      <span>BUSCADOR</span>
    </h1>

    <form class="w-full p-4 bg-gray-50" @submit.prevent="buscar">
      <div class="relative flex items-center justify-between overflow-hidden">
        <Transition>
          <div
            class="absolute transition ease-out delay-150 top-0 w-[100%] h-full p-3 font-medium bg-white text-sm text-[#5F7ADB]"
            v-if="loader"
          >
            <font-awesome-icon :icon="['fas', 'spinner']" spin-pulse />
            Procesando peticion
          </div>
        </Transition>
        <input
          type="text"
          placeholder="Ingresa tu busqueda.. "
          class="rounded-l-xl block w-full p-3 bg-white outline-none border border-solid border-[#ddd] border-r-0"
          v-model="busqueda"
          required
          maxlength="100"
        />
        <button
          type="reset"
          @click.prevent="resetSearch"
          v-if="busqueda.length > 0"
          class="border-y border-solid border-[#ddd] block p-3 bg-white border-x-0"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
        <button
          class="block p-3 bg-white border-y border-solid border-[#ddd] border-x-0"
          @click.prevent="startScanner"
        >
          <font-awesome-icon :icon="['fas', 'barcode']" />
        </button>
        <button
          type="submit"
          class="p-3 bg-[#26292B] border-y border-r border-solid border-[#26292B] text-white rounded-r-xl"
        >
          Buscar
        </button>
      </div>
    </form>
    <Transition>
      <div v-if="resultados.length" :key="resultadoKey">
        <span class="bg-[#dbfddb] block p-4 text-sm font-light"
          >Se encontraron
          <b class="text-sm font-medium">{{ resultados.length }}</b> para la
          busqueda
          <b class="text-sm font-medium">"{{ ultimaBusqueda }}"</b></span
        >

        <div
          class="border-b border-solid border-[#e6e6e6]"
          v-for="(item, index) in resultados"
          :key="item.id"
        >
          <div class="px-4 py-2 lowercase">
            <b>#{{ index + 1 }}</b> {{ item.descripcion }}
          </div>
          <div class="flex items-center justify-between px-4 py-2 bg-gray-100">
            <div class="text-sm">Interno: {{ item.interno }}</div>
            <div class="text-sm">Barra: {{ item.barra }}</div>
            <div></div>
          </div>
        </div>
      </div>
      <div v-else-if="ultimaBusquedaVal">
        <span class="bg-[#dbfddb] block p-4 text-sm font-light"
          >No se encontraron resultados para la busqueda
          <b class="text-sm font-medium">"{{ ultimaBusqueda }}"</b></span
        >
      </div>
      <div
        v-else
        class="flex items-center justify-center h-64 p-8 font-light text-gray-500"
      >
        <span
          ><font-awesome-icon :icon="['fas', 'magnifying-glass']" beat-fade />
          Puedes ingresar el codigo de barras del producto o buscar directamente
          con la descripcion o marca.</span
        >
      </div></Transition
    >
  </div>
</template>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 133.33%; /* Para un aspect ratio de 3:4, 4/3 = 1.3333 */
  overflow: hidden;
}

.responsive-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.responsive-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
