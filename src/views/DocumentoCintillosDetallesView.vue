<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { useBarPagination } from "@/composables/barPagination";
import { useDocumentLabel } from "@/composables/methodLabelDocument";
import ListaCintillos from "@/components/cintillos/ListaCintillos.vue";
import CargandoFrom from "@/components/globales/CargandoForm.vue";
import PaginateCintillos from "@/components/cintillos/PaginateCintillos.vue";
import { useGetRoutes } from "@/composables/getRoutes";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("es");
dayjs.extend(relativeTime);

const { labelDocumentReSend } = useGetRoutes();
const route = useRoute();
const token = ref(localStorage.getItem("token"));
const modal = ref(false);
const enviando = ref(false);
const { detalles, etiquetas, getData } = useDocumentLabel();
const { inicio, fin, siguiente, anterior } = useBarPagination();
getData(route.params.path_uuid);

const closeModal = () => {
  modal.value = false;
};

const resend = async () => {
  try {
    enviando.value = true;
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const dataEnvio = {
      receptor: detalles._rawValue[0].receptor,
      email: detalles._rawValue[0].email,
      path: detalles._rawValue[0].path,
      comentario: detalles._rawValue[0].comentario,
      cantidad: detalles._rawValue[0].cantidad,
      code: detalles._rawValue[0].code,
    };

    let { data } = await axios.post(labelDocumentReSend, dataEnvio, {
      headers,
    });
    console.log(data);
    if (data.status === "OK") {
      modal.value = true;
    }
  } catch (error) {
    console.log(error);
  } finally {
    enviando.value = false;
  }
};
</script>

<template>
  <div class="grid grid-cols-1">
    <div>
      <CargandoFrom
        :enviando="enviando"
        :textoCarga="' Reenviando documento ..'"
      ></CargandoFrom>
      <div
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-black/80"
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
              @click.prevent="closeModal"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
      <div
        class="flex items-center justify-between gap-4 px-4 p-2 border-b border-dashed border-[#ddd]"
      >
        <div
          class="p-4 bg-green-100 border border-green-200 border-solid rounded-full shadow-lg shadow-black/20"
        >
          <img src="../../public/excel.svg" class="w-[40px]" />
        </div>
        <div class="flex-1 overflow-hidden font-medium text-ellipsis-container">
          {{ etiquetas.detalles[0].path_name }}
        </div>
      </div>

      <div
        class="flex items-center w-full p-4 overflow-hidden overflow-x-auto gap-x-2 whitespace-nowrap eliminarBarraScroll"
      >
        <div
          class="inline-flex items-center px-3 py-1 text-sm text-gray-800 bg-gray-200 rounded-md"
        >
          <font-awesome-icon :icon="['fas', 'at']" class="pr-1" />{{
            etiquetas.detalles[0].receptor === "Desconocido"
              ? etiquetas.detalles[0].email
              : etiquetas.detalles[0].receptor
          }}
        </div>
        <div
          class="inline-flex items-center px-3 py-1 text-sm text-gray-800 uppercase bg-gray-200 border rounded-md"
        >
          <font-awesome-icon
            :icon="
              etiquetas.total[0].total <= 1 ? ['fas', 'tag'] : ['fas', 'tags']
            "
            class="pr-1"
          />{{
            etiquetas.total[0].total <= 1
              ? `${etiquetas.total[0].total} cintillo`
              : `${etiquetas.total[0].total} cintillos`
          }}
        </div>
        <div
          class="inline-flex items-center px-3 py-1 text-sm text-gray-800 uppercase bg-gray-200 rounded-md"
        >
          <font-awesome-icon :icon="['fas', 'calendar']" class="pr-2" />
          {{ dayjs(etiquetas.detalles[0].fecha).fromNow() }}
        </div>
      </div>
      <div class="flex items-center justify-between p-4 pt-0 gap-x-4">
        <a
          :href="`https://api.multimarcas.app/${etiquetas.detalles[0].path}`"
          download
          class="block w-full px-4 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-100 rounded shadow focus:bg-gray-300 hover:bg-gray-300 ripple hover:shadow-lg focus:outline-none"
        >
          DESCARGAR
        </a>
        <button
          @click="resend"
          class="relative block w-full px-4 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-100 rounded shadow focus:bg-gray-300 hover:bg-gray-300 ripple hover:shadow-lg focus:outline-none"
        >
          <span
            class="absolute top-[0px] right-[0px] inline-flex w-2 h-2 font-black rounded-full opacity-75 animate-ping bg-rose-700"
          ></span>
          REENVIAR
        </button>
      </div>
      <div class="p-4 pt-0">
        <div class="pb-2 text-sm">
          <b class="font-medium">Codigo de referencia: </b> #{{
            etiquetas.detalles[0].code
          }}
        </div>
        <div class="pb-2 text-sm">
          <b class="font-medium">Comentario:</b>
          {{ etiquetas.detalles[0].comentario }}
        </div>
      </div>

      <ListaCintillos
        v-if="etiquetas"
        v-for="producto in etiquetas.cintillos.slice(inicio, fin)"
        :key="producto.uuid"
        :uuid="producto.uuid"
        :descripcion="producto.descripcion"
        :precio="producto.precio"
        :cantidad="producto.cantidad"
        :fecha="dayjs(producto.fecha).fromNow()"
        :loading="loading"
        :urlRemoveLabel="labelRemove"
        :token="token"
        :mostrar="false"
        @eliminar="eliminar"
      ></ListaCintillos>

      <PaginateCintillos
        v-if="etiquetas.cintillos.length >= 7"
        :inicio="inicio"
        :fin="fin"
        :maxLength="etiquetas.cintillos.length"
        @siguiente="siguiente"
        @anterior="anterior"
      ></PaginateCintillos>
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
