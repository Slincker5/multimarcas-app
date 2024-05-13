<script setup>
import { ref } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useBarPagination } from "@/composables/barPagination";
import { useReSend } from "@/store/resend";
import ReenvioCintillos from "@/components/cintillos/ReenvioCintillos.vue";
import ReenviarLista from "@/components/cintillos/ReenviarLista.vue";
import CargandoFrom from "@/components/globales/CargandoForm.vue";
import { useGetRoutes } from "@/composables/getRoutes";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("es");
dayjs.extend(relativeTime);

const route = useRoute();
const token = localStorage.getItem("token");
const { labelDocument } = useGetRoutes();
const path_uuid = route.params.path_uuid;
const documento = ref(null);

const modal = ref(false);
const useReSendStore = useReSend();
const { formReenviarOpen, formReenviarClose, enviandoTrue, enviandoFalse } =
  useReSendStore;
const { toggle, enviando } = storeToRefs(useReSendStore);

// obtener datos de los archivos
const getInfoFile = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const { data } = await axios.get(`${labelDocument}${path_uuid}`, {
      headers,
    });
    documento.value = data;
  } catch (error) {
    console.log(error);
  }
};

getInfoFile();
const { data } = documento;
const { inicio, fin, siguiente, anterior } = useBarPagination();

const closeModal = () => {
  modal.value = false;
};
</script>

<template>
  <div class="grid grid-cols-1">
    <ReenvioCintillos
      v-if="documento"
      :toggle="toggle"
      :documento="documento"
      :enviando="enviando"
      :total="documento.total[0].total"
      @formReenviarOpen="formReenviarOpen"
      @formReenviarClose="formReenviarClose"
      @enviandoFalse="enviandoFalse"
      @enviandoTrue="enviandoTrue"
    ></ReenvioCintillos>

    <div>
      <CargandoFrom
        :enviando="enviando"
        :textoCarga="' Reenviando documento ..'"
      ></CargandoFrom>

      <div
        class="flex items-center justify-between gap-4 px-4 p-2 border-b border-dashed border-[#ddd]"
      >
        <div
          class="p-4 bg-green-100 border border-green-200 border-solid rounded-full shadow-lg shadow-black/20"
        >
          <img src="../../public/excel.svg" class="w-[40px]" />
        </div>
        <div
          class="flex-1 overflow-hidden font-medium text-ellipsis-container"
          v-if="documento"
        >
          {{ documento.detalles[0].path_name }}
        </div>
      </div>

      <div
        class="flex items-center w-full p-4 overflow-hidden overflow-x-auto gap-x-2 whitespace-nowrap eliminarBarraScroll"
      >
        <div
          class="inline-flex items-center px-3 py-1 text-sm text-gray-800 bg-gray-200 rounded-md"
          v-if="documento"
        >
          <font-awesome-icon :icon="['fas', 'at']" class="pr-1" />{{
            documento.detalles[0].receptor === "Desconocido"
              ? documento.detalles[0].email
              : documento.detalles[0].receptor
          }}
        </div>
        <div
          class="inline-flex items-center px-3 py-1 text-sm text-gray-800 uppercase bg-gray-200 border rounded-md"
          v-if="documento"
        >
          <font-awesome-icon
            :icon="
              documento.total[0].total <= 1 ? ['fas', 'tag'] : ['fas', 'tags']
            "
            class="pr-1"
          />{{
            documento.total[0].total <= 1
              ? `${documento.total[0].total} cintillo`
              : `${documento.total[0].total} cintillos`
          }}
        </div>
        <div
          class="inline-flex items-center px-3 py-1 text-sm text-gray-800 uppercase bg-gray-200 rounded-md"
          v-if="documento"
        >
          <font-awesome-icon :icon="['fas', 'calendar']" class="pr-2" />
          {{ dayjs(documento.detalles[0].fecha).fromNow() }}
        </div>
      </div>
      <div
        class="flex items-center justify-between p-4 pt-0 gap-x-4"
        v-if="documento"
      >
        <a
          :href="`https://api.multimarcas.app/${documento.detalles[0].path}`"
          download
          class="block w-full px-4 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-100 rounded shadow focus:bg-gray-300 hover:bg-gray-300 ripple hover:shadow-lg focus:outline-none"
        >
          DESCARGAR
        </a>
        <button
          @click="formReenviarOpen"
          class="relative block w-full px-4 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-100 rounded shadow focus:bg-gray-300 hover:bg-gray-300 ripple hover:shadow-lg focus:outline-none"
        >
          <span
            class="absolute top-[0px] right-[0px] inline-flex w-2 h-2 font-black rounded-full opacity-75 animate-ping bg-rose-700"
          ></span>
          REENVIAR
        </button>
      </div>
      <div class="p-4 pt-0" v-if="documento">
        <div class="pb-2 text-sm">
          <b class="font-medium">Codigo de referencia: </b> #{{
            documento.detalles[0].code
          }}
        </div>
        <div class="pb-2 text-sm">
          <b class="font-medium">Comentario:</b>
          {{ documento.detalles[0].comentario }}
        </div>
      </div>

      <ReenviarLista
        v-if="documento"
        :cintillo="documento.cintillos"
      ></ReenviarLista>
    </div>
  </div>
</template>
<style>
.text-ellipsis-container {
  white-space: nowrap; /* Asegura que el texto se muestre en una sola línea */
  overflow: hidden; /* Oculta el texto que excede el contenedor */
  text-overflow: ellipsis; /* Añade puntos suspensivos al final del texto visible */
}
.eliminarBarraScroll::-webkit-scrollbar {
  display: none;
}
</style>
