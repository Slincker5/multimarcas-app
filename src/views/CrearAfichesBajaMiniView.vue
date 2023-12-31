<script setup>
import { ref } from "vue";
import axios from "axios";
import { useGetRoutes } from "@/composables/getRoutes";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const token = ref(localStorage.getItem("token"));
const { posterSmallBajaCreate, posterSmallBajaList } = useGetRoutes();
// variables reactivas del formulario
const enviando = ref(false);
const barra = ref("");
const descripcion = ref("");
const cantidad = ref("");
const precio = ref("");
const handleInput = (event) => {
  descripcion.value = formatearDescription(event.target.value);
};

function formatearDescription(description) {
  // Convierte todo a mayúsculas primero
  description = description.toUpperCase();

  // Añade un espacio antes de las unidades de medida si no existe
  description = description.replace(
    /(\d)(ML|G|U|L|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G.)/g,
    "$1 $2"
  );

  // Cambia las unidades de medida a minúsculas si están precedidas por un espacio o un número
  description = description.replace(
    /(\s|\d)(ML|G|U|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G.)(?=\s|$)/g,
    function (match, p1, p2) {
      return p1 + p2.toLowerCase();
    }
  );

  return description;
}
const totalRotulos = ref("");
const obtenerTotalRotulos = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.get(posterSmallBajaList, { headers });
    totalRotulos.value = data.length;
  } catch (error) {
    console.log(error);
  }
};

obtenerTotalRotulos();

const reestablecerFormulario = () => {
  barra.value = "";
  descripcion.value = "";
  precio.value = "";
  cantidad.value = "";
};
const agregarAfiches = async () => {
  try {
    enviando.value = true;
    const dataCintillo = {
      barra: barra.value,
      descripcion: formatearDescription(descripcion.value),
      precio: precio.value,
      cantidad: cantidad.value,
    };

    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };

    let { data } = await axios.post(posterSmallBajaCreate, dataCintillo, {
      headers,
    });

    if (data.status === "error") {
      toast.error(data.message, {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    } else {
      reestablecerFormulario();
      obtenerTotalRotulos();
      toast.success(data.message, {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    }
    document.documentElement.scrollTop = 0; // Para navegadores diferentes a Firefox
    document.body.scrollTop = 0;
  } catch (error) {
    console.log(error);
  } finally {
    enviando.value = false;
  }
};


const afichePreview = ref("hidden");

const abrirPreview = () => {
  afichePreview.value = "block";
};
const cerrarPreview = () => {
  afichePreview.value = "hidden";
};
</script>
<template>
  <div class="grid grid-cols-1 lg:grid-cols-2">
    <h1
      class="flex items-center justify-between col-span-1 p-4 pb-4 font-medium text-gray-900"
    >
      Crear Afiches
      <router-link to="/lista-afiches-baja-mini" active-class="underline"
        >Afiches
        <span
          class="inline-flex items-center justify-center bg-[#A2B2EE] text-[#2E3239] text-xs font-medium rounded-full no-underline w-[20px] h-[20px]"
          >{{ totalRotulos }}</span
        ></router-link
      >
    </h1>

    <form
      class="w-full col-start-1 bg-gray-100 md:px-8"
      @submit.prevent="agregarAfiches"
    >
      <div class="p-4">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="barra"
        >
          CODIGO DE BARRA:
        </label>
        <input
          class="block w-full px-4 py-3 mb-3 text-gray-700 bg-gray-200 border rounded-l appearance-none focus:outline-none focus:bg-white"
          id="barra"
          type="text"
          placeholder="Ej. 1234567890123"
          autocomplete="off"
          v-model="barra"
        />
        <p class="text-xs font-light text-gray-600">
          <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-1" />El
          código de barra es opcional
        </p>
      </div>

      <div class="p-4">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="descripcion"
        >
          DESCRIPCIÓN DEL PRODUCTO:
        </label>
        <input
          class="block w-full px-4 py-3 mb-3 text-gray-700 bg-gray-200 border rounded-l appearance-none focus:outline-none focus:bg-white"
          id="descripcion"
          type="text"
          placeholder="DESCRIPCIÓN COMPLETA"
          autocomplete="off"
          v-model="descripcion"
          @input="handleInput"
          required
        />
      </div>

      <div class="p-4">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="precio"
        >
          PRECIO DEL PRODUCTO:
        </label>
        <input
          class="block w-full px-4 py-3 mb-3 text-gray-700 bg-gray-200 border rounded-l appearance-none focus:outline-none focus:bg-white"
          id="precio"
          type="text"
          placeholder="PRECIO"
          autocomplete="off"
          v-model="precio"
          required
        />
        <p class="text-xs font-light text-gray-600">
          <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-1" />
          Ingresá el precio correcto para este producto
        </p>
      </div>

      <div class="p-4">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="cantidad"
        >
          CANTIDAD:
        </label>
        <input
          class="block w-full px-4 py-3 mb-3 text-gray-700 bg-gray-200 border rounded-l appearance-none focus:outline-none focus:bg-white"
          id="cantidad"
          type="number"
          placeholder="CANTIDAD"
          min="1"
          max="200"
          autocomplete="off"
          v-model="cantidad"
          required
        />
        <p class="text-xs font-light text-gray-600">
          <font-awesome-icon :icon="['fas', 'info-circle']" /> Ingresá la
          cantidad de rotulos que necesitas para este producto
        </p>
      </div>

      <div class="flex items-center justify-between gap-1 px-2 py-4 sm:block">
        <a
          href="#"
          class="sm:hidden text-sm sm:text-base w-full px-4 py-2 font-bold text-white border rounded bg-[#2E3239] hover:bg-[#37474F] border-[#303E46] shadow-md text-center"
          @click.prevent="abrirPreview"
          >Previsualizar</a
        >
        <input
          type="submit"
          class="text-sm sm:text-base lowercase sm:uppercase w-full px-4 py-2 font-bold text-white border rounded bg-[#2E3239] hover:bg-[#37474F] border-[#303E46] shadow-md"
          value="AGREGAR ROTULO"
        />
      </div>
    </form>

    <div
      class="fixed justify-center w-full h-full pb-4 bg-black sm:items-start sm:static sm:hidden md:flex lg:pb-8"
      :class="afichePreview"
    >
      <a
        href="#"
        class="block p-4 font-medium text-white sm:hidden"
        @click.prevent="cerrarPreview"
        ><font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-1" /> VOLVER
        A EDITAR</a
      >
      <div class="w-[90%] lg:w-[60%] mx-auto">
        <div class="bg-[#667362] flex items-center p-4 lg:p-6">
          <img
            src="../../public/logos.png"
            alt="marca"
            class="block w-[30px] lg:w-[40px]"
          />
          <div class="ml-6">
            <div class="text-white">
              <span class="px-2 text-3xl font-extrabold lg:px-3 lg:text-4xl">P</span>
              <span class="px-2 text-3xl font-extrabold lg:px-3 lg:text-4xl">R</span>
              <span class="px-2 text-3xl font-extrabold lg:px-3 lg:text-4xl">E</span>
              <span class="px-2 text-3xl font-extrabold lg:px-3 lg:text-4xl">C</span>
              <span class="px-2 text-3xl font-extrabold lg:px-3 lg:text-4xl">I</span>
              <span class="px-2 text-3xl font-extrabold lg:px-3 lg:text-4xl">O</span>
            </div>
            <div class="text-[#a5ac6f]">
              <span class="px-1 text-2xl lg:px-2 lg:text-3xl">s</span>
              <span class="px-1 text-2xl lg:px-2 lg:text-3xl">e</span>
              <span class="px-1 text-2xl lg:px-2 lg:text-3xl">l</span>
              <span class="px-1 text-2xl lg:px-2 lg:text-3xl">e</span>
              <span class="px-1 text-2xl lg:px-2 lg:text-3xl">c</span>
              <span class="px-1 text-2xl lg:px-2 lg:text-3xl">t</span>
              <span class="px-1 text-2xl lg:px-2 lg:text-3xl">o</span>
              <span class="px-1 text-2xl lg:px-2 lg:text-3xl">s</span>
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-center bg-[#a5ac6f]"
        >
          <div class="inline-block bg-black text-[#a5ac6f] px-14 py-1 tracking-wider font-semibold">NUEVO PRECIO</div>
        </div>
        <div
          class="flex items-center justify-center text-5xl lg:text-7xl font-medium bg-[#a5ac6f] pt-[50px] lg:pt-[0p7x] pb-[30px] lg:pb-[40px]"
        >
          {{ precio }}
        </div>
        <div
          class="flex items-center justify-center px-8 pb-9 text-xl font-normal text-center pt-[20px] bg-[#a5ac6f] lg:pb-10 lg:text-3xl"
        >
          {{ descripcion }}
        </div>

        <div
          classs="flex items-center justify-center pb-6 text-xs bg-[#a5ac6f] lg:text-base"
        >
          {{ barra }}
        </div>
      </div>
    </div>
  </div>

  <div
    class="fixed w-full h-full flex items-center justify-center text-white bg-[#263238] p-4 text-xl top-0 left-0 z-50"
    v-if="enviando"
  >
    <font-awesome-icon :icon="['fas', 'spinner']" class="fa-pulse" />
    Agregando Rotulos...
  </div>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap");
.logo {
  font-family: "Caveat Brush", cursive;

  left: 50%;
  transform: translateX(-50%);
}
</style>
