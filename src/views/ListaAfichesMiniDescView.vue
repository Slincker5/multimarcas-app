<script setup>
import { ref } from "vue";
import axios from "axios";
import PaginateCintillos from "@/components/cintillos/PaginateCintillos.vue";
import { useGetRoutes } from "@/composables/getRoutes";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

dayjs.locale("es");
dayjs.extend(relativeTime);

const { posterSmallDescList, posterSmallDescRemoveList } = useGetRoutes();
const token = ref(localStorage.getItem("token"));
const datos = ref([]);
const total = ref(null);
const loading = ref(false);

const getData = async () => {
  try {
    loading.value = true;
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    let { data } = await axios.get(posterSmallDescList, {
      headers,
    });
    total.value = data.length;
    let uniqueItems = data.filter(
      (
        (map) => (item) =>
          !map.has(item.descripcion) && map.set(item.descripcion, true)
      )(new Map())
    );
    datos.value = uniqueItems;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
getData();

const eliminar = async (uuid) => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };

    const info = {
      uuid: uuid,
    };

    let { data } = await axios.delete(posterSmallDescRemoveList, {
      headers: headers,
      data: info,
    });

    getData();
    toast.success(data.message, {
      theme: "colored",
      autoClose: 1500,
      position: toast.POSITION.BOTTOM_LEFT,
      transition: toast.TRANSITIONS.ZOOM,
    });
  } catch (error) {
    console.log(error);
  }
};

let postXpagina = 6;
const inicio = ref(0);
const fin = ref(6);

const siguiente = () => {
  inicio.value += postXpagina;
  fin.value += postXpagina;
};
const anterior = () => {
  inicio.value -= postXpagina;
  fin.value -= postXpagina;
};
</script>
<template>
  <div>
    <div class="bg-gray-100" v-if="datos.length > 0">
      <h1
        class="flex items-center justify-between p-4 font-medium text-gray-800"
      >
        <router-link to="/crear-afiches-mini-descuentos"
          ><font-awesome-icon :icon="['fas', 'chevron-left']" /> VOLVER</router-link
        >
        <span>GENERAR DOCUMENTO</span>
      </h1>
      <div class="flex items-center justify-between p-4 pt-0">
        <div>
          <font-awesome-icon
            :icon="['fas', 'gear']"
            class="mr-1 fa-spin"
          />Llevas {{ total }}/<span class="text-black">27</span>
        </div>
        <router-link
          to="/enviar-afiches-mini-descuentos"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg"
        >
          <font-awesome-icon :icon="['fas', 'share']" class="mr-3" />
          Compartir
        </router-link>
      </div>
    </div>

    <h1
      class="flex items-center justify-between p-4 font-medium text-gray-800 border-b border-[#dddddd] border-solid"
    ><router-link to="/crear-afiches-mini-descuentos" v-if="datos.length === 0"
          ><font-awesome-icon :icon="['fas', 'chevron-left']" /> VOLVER</router-link
        >
      LISTADO DE ROTULOS
    </h1>
    <div
      class="flex items-center justify-center text-xl font-light text-gray-500 h-52"
      v-if="loading"
    >
      <font-awesome-icon :icon="['fas', 'circle-notch']" spin class="mr-2" />
      Cargando datos ...
    </div>
    <div v-else>
      <div
        class="flex items-center justify-center text-xl font-light text-gray-500 h-52"
        v-if="datos.length === 0"
      >
        <font-awesome-icon :icon="['fas', 'face-sad-cry']" /> Aun no has
        agregado datos..
      </div>
      <!-- component -->
      <div
        v-for="item in datos.slice(inicio, fin)"
        :key="item.id"
        class="border-b border-[#dddddd] border-solid"
      >
        <div class="flex items-start justify-between p-4">
          <span class="flex-[1]">{{ item.descripcion }}</span>
          <button class="text-gray-900" @click.prevent="eliminar(item.uuid)">
            <font-awesome-icon :icon="['fas', 'trash-can']" />
          </button>
        </div>
        <div class="p-4 pt-0"><b class="text-xs font-bold tracking-wide text-gray-700 uppercase">Promocion: </b> <span class="text-sm">{{ item.descuento }}</span></div>
        <div class="flex p-4 pt-0">
          <div class="flex items-center mr-2 text-sm">{{ item.precio }}</div>
          <div class="flex items-center mr-2">
            <span v-if="item.cantidad < 2" class="text-sm"
              >({{ item.cantidad }} rotulo)</span
            >
            <span v-else class="text-sm">({{ item.cantidad }} rotulos)</span>
          </div>
          <div class="text-sm text-gray-500">
            {{ dayjs(item.fecha).fromNow() }}
          </div>
        </div>
      </div>
      <!-- aqui btn -->
      <PaginateCintillos
        :inicio="inicio"
        :fin="fin"
        :maxLength="datos.length"
        @siguiente="siguiente"
        @anterior="anterior"
      ></PaginateCintillos>
    </div>
  </div>
</template>
