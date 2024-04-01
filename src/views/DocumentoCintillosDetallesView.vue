<script setup>
import { useRoute } from "vue-router";
import { useDocumentLabel } from "@/composables/methodLabelDocument";
import ListaCintillos from "@/components/cintillos/ListaCintillos.vue";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("es");
dayjs.extend(relativeTime);

const route = useRoute();
const { etiquetas, getData } = useDocumentLabel();
getData(route.params.path_uuid);
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-4 p-2 border-b border-dashed border-[#ddd]">
      <div class="p-4 bg-green-200 rounded-full shadow-lg shadow-black/20">
        <img src="../../public/excel.svg" class="w-[40px]" />
      </div>
      <div class="flex-1 overflow-hidden font-medium text-ellipsis-container">
         {{ etiquetas.detalles[0].path_name }}
      </div>
    </div>
    <div class="p-4">
        <div class="pb-4 text-sm"><b class="font-medium">Codigo de referencia: </b> #{{ etiquetas.detalles[0].code }}</div>
        <div class="pb-4 text-sm"><b class="font-medium">Comentario:</b> {{ etiquetas.detalles[0].comentario }}</div>
        <div class="pb-0 text-sm"><b class="font-medium">Generado:</b> {{ dayjs(etiquetas.detalles[0].fecha).fromNow() }}</div>
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
      @eliminar="eliminar"
    ></ListaCintillos>
  </div>
</template>
<style>
.text-ellipsis-container {
  white-space: nowrap; /* Asegura que el texto se muestre en una sola línea */
  overflow: hidden; /* Oculta el texto que excede el contenedor */
  text-overflow: ellipsis; /* Añade puntos suspensivos al final del texto visible */
}

</style>