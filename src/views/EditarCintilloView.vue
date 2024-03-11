<script setup>
import axios from "axios";
import { useGetRoutes } from "@/composables/getRoutes";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const route = useRoute();
const { labelEdit, labelDetails } = useGetRoutes();
const barra = ref("");
const descripcion = ref("");
const precio = ref("");
const autor = ref("");
const token = ref(localStorage.getItem("token"));

const traerDetallesCintillo = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.get(`${labelDetails}${route.params.uuid}`, {
      headers,
    });
    console.log(data);
    agregarDetallesCintillo(data);
    barra.value = cintilloDetalles.value[0].barra;
    descripcion.value = cintilloDetalles.value[0].descripcion;
    precio.value = cintilloDetalles.value[0].precio;
    autor.value = cintilloDetalles.value[0].autor;
  } catch (error) {
    console.log(error);
  }
};
traerDetallesCintillo();

const guardarDatos = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const datosFrm = {
      barra: barra.value,
      descripcion: descripcion.value,
      precio: precio.value,
      uuid: route.params.uuid,
    };
    const { data } = await axios.put(labelEdit, datosFrm, {headers});
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
</script>
<template>
  <h1 class="flex justify-between p-4 font-bold text-gray-800 align-items">
    <router-link to="/cintillos"
      ><font-awesome-icon :icon="['fas', 'chevron-left']" /> VOLVER</router-link
    >
    EDITAR CINTILLO
  </h1>

  <div class="p-4">
    <form class="w-full max-w-lg" @submit.prevent="guardarDatos">
      <div class="flex flex-wrap mb-6 -mx-3">
        <div class="w-full px-3 mb-6 md:w-1/2 md:mb-0">
          <label
            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
            for="grid-first-name"
          >
            CODIGO DE BARRA:
          </label>
          <input
            class="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
            id="grid-first-name"
            type="text"
            placeholder="Ej. 1234567890123"
            autocomplete="off"
            v-model="barra"
          />
          <p class="text-xs font-light text-gray-600">
            <font-awesome-icon :icon="['fas', 'info-circle']" />El código de
            barra es opcional
          </p>
        </div>
        <div class="w-full px-3 md:w-1/2">
          <label
            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
            for="grid-last-name"
          >
            DESCRIPCIÓN DEL PRODUCTO:
          </label>
          <input
            class="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-last-name"
            type="text"
            placeholder="DESCRIPCIÓN COMPLETA"
            autocomplete="off"
            v-model="descripcion"
            required
          />
        </div>
      </div>
      <div class="flex flex-wrap mb-6 -mx-3">
        <div class="w-full px-3">
          <label
            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
            for="grid-password"
          >
            PRECIO DEL PRODUCTO:
          </label>
          <input
            class="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-password"
            type="text"
            placeholder="PRECIO"
            autocomplete="off"
            v-model="precio"
            required
          />
          <p class="text-xs font-light text-gray-600">
            <font-awesome-icon :icon="['fas', 'info-circle']" /> Ingresá el
            precio correcto para este producto
          </p>
        </div>
      </div>

      <input
        type="submit"
        class="w-full px-4 py-2 font-bold text-white border rounded bg-emerald-500 hover:bg-emerald-700 border-emerald-700"
        value="GUARDAR INFORMACIÓN"
      />
    </form>
  </div>
</template>
