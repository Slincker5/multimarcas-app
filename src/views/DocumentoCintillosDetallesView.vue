<script setup>
import { useRoute } from "vue-router";
import { useBarPagination } from "@/composables/barPagination";
import { useDocumentLabel } from "@/composables/methodLabelDocument";
import ListaCintillos from "@/components/cintillos/ListaCintillos.vue";
import PaginateCintillos from "@/components/cintillos/PaginateCintillos.vue";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("es");
dayjs.extend(relativeTime);

const route = useRoute();
const { etiquetas, getData } = useDocumentLabel();
const { inicio, fin, siguiente, anterior } = useBarPagination();
getData(route.params.path_uuid);
const resend = () => {
    alert("Esta funcion estara proximamente disponible..")
}
</script>

<template>
  <div class="grid grid-cols-1">
    <div>
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
              class="block w-full px-4 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-100 rounded shadow focus:bg-gray-300 hover:bg-gray-300 ripple hover:shadow-lg focus:outline-none"
            >
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
