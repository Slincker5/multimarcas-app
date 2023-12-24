<script setup>
import { ref } from "vue";
import axios from "axios";
import { useGetRoutes } from "@/composables/getRoutes";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const token = ref(localStorage.getItem("token"));
const user_uuid = ref(localStorage.getItem("user_uuid"));
const { posterSmallCreate, posterSmallList } = useGetRoutes();
// variables reactivas del formulario
const enviando = ref(false);
const barra = ref("");
const descripcion = ref("");
const cantidad = ref("");
const precio = ref("");
const f_inicio = ref("");
const f_fin = ref("");
const f_fin_n = ref("");
const f_inicio_n = ref("");
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
    const { data } = await axios.get(posterSmallList, { headers });
    totalRotulos.value = data.length;
  } catch (error) {
    console.log(error);
  }
};

obtenerTotalRotulos();

const reestablecerFormulario = () => {
  barra.value = "";
  descripcion.value = "";
  f_inicio.value = "";
  f_fin.value = "";
  cantidad.value = "";
  precio.value = "";
  f_inicio_n.value = "";
  f_fin_n.value = "";
};
const agregarAfiches = async () => {
  try {
    enviando.value = true;
    const dataCintillo = {
      barra: barra.value,
      descripcion: formatearDescription(descripcion.value),
      precio: precio.value,
      f_inicio: f_inicio_n.value,
      f_fin: f_fin_n.value,
      cantidad: cantidad.value,
      user_uuid: user_uuid.value,
    };

    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };

    let { data } = await axios.post(posterSmallCreate, dataCintillo, {
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

const cambiarFormatoFin = () => {
  const fechaArray = f_fin.value.split("-");

  if (fechaArray.length === 3) {
    f_fin_n.value = `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}`;
  }
  return ""; // Devuelve una cadena vacía si el formato no es correcto
};
const cambiarFormatoInicio = () => {
  const fechaArray = f_inicio.value.split("-");

  if (fechaArray.length === 3) {
    f_inicio_n.value = `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}`;
  }
  return ""; // Devuelve una cadena vacía si el formato no es correcto
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
  <div class="grid grid-cols-1 sm:grid-cols-2">
    <h1
      class="flex items-center justify-between col-span-1 p-4 pb-4 font-medium text-gray-900"
    >
      Crear Afiches
      <router-link to="/afiches-mini" active-class="underline"
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
          for="f_inicio"
        >
          FECHA DE INICIO:
        </label>
        <input
          class="block w-full px-4 py-3 mb-3 text-gray-700 bg-gray-200 border rounded-l appearance-none focus:outline-none focus:bg-white"
          id="f_inicio"
          type="date"
          placeholder="INGRESA LA FECHA DE INICIO"
          autocomplete="off"
          v-model="f_inicio"
          @input="cambiarFormatoInicio"
          required
        />
        <p class="text-xs font-light text-gray-600">
          <font-awesome-icon
            :icon="['fas', 'info-circle']"
            class="mr-1"
          />Ingresa una fecha de inicio veridica.
        </p>
      </div>

      <div class="p-4">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="f_fin"
        >
          FECHA FIN:
        </label>
        <input
          class="block w-full px-4 py-3 mb-3 text-gray-700 bg-gray-200 border rounded-l appearance-none focus:outline-none focus:bg-white"
          id="f_fin"
          type="date"
          placeholder="INGRESA LA FECHA FIN"
          autocomplete="off"
          v-model="f_fin"
          @input="cambiarFormatoFin"
          required
        />
        <p class="text-xs font-light text-gray-600">
          <font-awesome-icon
            :icon="['fas', 'info-circle']"
            class="mr-1"
          />Ingresa una fecha de fin veridica.
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
      class="fixed top-0 z-50 justify-center w-full h-full pb-4 bg-black sm:items-start sm:static sm:flex lg:pb-8 sm:z-0"
      :class="afichePreview"
    >
      <a
        href="#"
        class="block p-4 font-medium text-white sm:hidden"
        @click.prevent="cerrarPreview"
        ><font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-1" /> VOLVER
        A EDITAR</a
      >
      <div class="w-[90%] lg:w-[70%] mx-auto sm:sticky sm:top-[70px]">
        <div class="bg-[#CEB16D] flex items-center justify-center pb-4">
          <div class="w-[85%] sm:w-[75%]">
            <div class="flex items-start justify-center w-full bg-[#9c564c]">
              <img
                src="../../public/logos.png"
                alt="marca"
                class="block w-[25px]"
              />
            </div>
            <div class="relative w-full bg-[#9c564c] pt-2 pb-7">
              <h2
                class="block w-full text-3xl font-black text-center text-white"
              >
                SÚPER
              </h2>
              <div
                class="absolute px-10 py-2 bottom-[-35px] inline logo bg-[#c08256] text-5xl text-[#9c564c] tracking-widest"
              >
                OFERTA
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-center text-5xl lg:text-7xl font-medium bg-[#CEB16D] pt-[70px] lg:pt-[100px] pb-[30px] lg:pb-[40px]"
        >
          {{ precio }}
        </div>
        <div
          class="flex items-center justify-center px-8 pb-5 text-xl font-normal text-center pt-[20px] bg-[#CEB16D] lg:pb-10 lg:text-3xl"
        >
          {{ descripcion }}
        </div>
        <div
          class="flex items-center justify-between px-8 py-2 bg-[#CEB16D] lg:py-4"
        >
          <div class="text-xs font-medium lg:text-base">
            INICIO: {{ f_inicio_n }}
          </div>
          <div class="text-xs font-medium lg:text-base">
            HASTA: {{ f_fin_n }}
          </div>
        </div>
        <div
          class="flex items-center justify-center pb-6 text-xs bg-[#CEB16D] lg:text-base"
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
