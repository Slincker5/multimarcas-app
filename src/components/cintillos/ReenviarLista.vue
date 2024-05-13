<script setup>
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import PaginateCintillos from "@/components/cintillos/PaginateCintillos.vue";
import { useBarPagination } from "@/composables/barPagination";
dayjs.locale("es");
dayjs.extend(relativeTime);
defineProps(["cintillo"]);
const { inicio, fin, siguiente, anterior } = useBarPagination();
</script>
<template>
    <h3 class="p-4 pt-0 text-sm font-medium">LISTADO DE CINTILLOS</h3>
  <div
    class="border-t border-[#dddddd] border-solid"
    v-for="producto in cintillo.slice(inicio, fin)"
    :key="producto.uuid"
  >
    <div class="flex items-start justify-between p-4">
      <span class="flex-[1]">{{ producto.descripcion }}</span>
    </div>
    <div class="flex items-center justify-between p-4 pt-0">
      <div>
        <div class="inline-block mr-2 text-sm font-medium">
          ${{ producto.precio }}
        </div>
        <div class="inline-block mr-2">
          <span class="text-sm"
            >({{
              producto.cantidad < 2
                ? `${producto.cantidad} cintillo`
                : `${producto.cantidad} cintillos`
            }})</span
          >
        </div>
      </div>

      <div class="text-sm text-gray-600">
        {{ dayjs(producto.fecha).fromNow() }}
      </div>
    </div>
  </div>

  <PaginateCintillos
    v-if="cintillo.length >= 7"
    :inicio="inicio"
    :fin="fin"
    :maxLength="cintillo.length"
    @siguiente="siguiente"
    @anterior="anterior"
  ></PaginateCintillos>
</template>
