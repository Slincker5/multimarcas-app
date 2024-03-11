<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useCintilloStore } from "@/store/cintillos";
import PaginateCintillos from "@/components/cintillos/PaginateCintillos.vue";
import ListaCintillos from "@/components/cintillos/ListaCintillos.vue";
import ContadorCintillos from "@/components/cintillos/ContadorCintillos.vue";
import LoadingCintillos from "@/components/cintillos/LoadingCintillos.vue";
import { useGetRoutes } from "@/composables/getRoutes";
import { useRemoveLabel } from "@/composables/removeDataLabel";
import { useBarPagination } from "@/composables/barPagination";

import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("es");
dayjs.extend(relativeTime);

const token = ref(localStorage.getItem("token"));

const useCintillos = useCintilloStore();
const { getData } = useCintillos;
const { listaCintillos, listaCintillosReal, loading } = storeToRefs(useCintillos);

const { labelList, labelRemove } = useGetRoutes();
const { eliminar } = useRemoveLabel();
const { inicio, fin, siguiente, anterior } = useBarPagination();

getData(labelList, token.value);
</script>
<template>
  <div>
    <ContadorCintillos
      :listaCintillos="listaCintillosReal"
      :loading="loading"
    ></ContadorCintillos>

    <LoadingCintillos
      :loading="loading"
      :listaCintillos="listaCintillos.length"
    ></LoadingCintillos>
    
    <ListaCintillos
      v-if="listaCintillos"
      v-for="producto in listaCintillos.slice(inicio, fin)"
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

    <PaginateCintillos
      v-if="listaCintillos.length >= 7"
      :inicio="inicio"
      :fin="fin"
      :maxLength="listaCintillos.length"
      @siguiente="siguiente"
      @anterior="anterior"
    ></PaginateCintillos>
  </div>
</template>
