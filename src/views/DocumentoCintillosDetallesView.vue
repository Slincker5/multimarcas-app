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
    <div class="flex items-center justify-between">
      <div class="p-4 bg-green-200 rounded-full">
        <img src="../../public/excel.svg" class="w-[50px]" />
      </div>
      <div class="flex-1 overflow-hidden text-ellipsis-container">
         {{ etiquetas.detalles[0].path_name }}
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