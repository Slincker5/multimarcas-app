<script setup>
import { ref } from "vue";
import axios from "axios";
import { useGetRoutes } from "@/composables/getRoutes";
import CargandoFrom from "@/components/globales/CargandoForm.vue";
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

const formatearDescription = (description) => {
    // Convierte todo el texto a mayúsculas para estandarizar el formato inicialmente.
    description = description.toUpperCase();

    // Asegura espaciado entre números y unidades, incluyendo el manejo de "LITROS" y ahora "MG".
    description = description.replace(
      /(\d)(ML|MG|G|U|L|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G\.|LB|GRS?\.?|UNI\.?|UN\.?|LITROS)/g,
      "$1 $2"
    );

    // Corrige el espaciado para casos especiales como texto adyacente directamente después de unidades.
    description = description.replace(
      /(\d)\s(ML|MG|G|U|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G\.|LB|GRS?\.?|UNI\.?|UN\.?|LITROS)\s?([A-Z]+)/g,
      "$1 $2 $3"
    );

    // Nuevo paso: Manejar las unidades sin número previo convirtiéndolas a minúsculas directamente.
    description = description.replace(
      /\b(ML|MG|G|U|L|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|LB|GRS?|UNI|UN|LITROS)\b/g,
      (match) => match.toLowerCase()
    );

    // Convierte las unidades a minúsculas para estandarización final, solo cuando siguen a un número para evitar afectar otras palabras.
    description = description.replace(
      /(\d)\s(ML|MG|G|U|L|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|LB|GRS?|UNI|UN|LITROS)\b/g,
      (match, p1, p2) => {
        switch (p2) {
          case "LITROS":
            return `${p1} L`;
          case "MG":
            return `${p1} mg`; // Convierte específicamente "MG" a "mg".
          default:
            return `${p1} ${p2.toLowerCase()}`;
        }
      }
    );

    return description;
};
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
  <div class="grid grid-cols-1 md:grid-cols-2">
    <h1
      class="flex items-center justify-between col-span-1 p-4 pb-4 font-medium text-gray-900"
    >
      Crear Afiches
      <router-link to="/lista-afiches-baja-mini" active-class="underline"
        >Afiches
        <span
          class="inline-flex items-center justify-center bg-rose-500 text-[#fff] text-xs font-semibold rounded-full no-underline w-[20px] h-[20px] shadow-sm shadow-rose-700"
          >{{ totalRotulos }}</span
        ></router-link
      >
    </h1>

    <form
      class="w-full col-start-1 bg-gray-100 md:px-8"
      @submit.prevent="agregarAfiches"
    >
    <CargandoFrom :enviando="enviando" :textoCarga="' Agregando rotulos ..'"></CargandoFrom>
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
      <div class="w-[90%] lg:w-[75%] mx-auto">
        <div class="bg-[#667362] flex items-center p-4 lg:p-6">
          <img
            src="../../public/logos.png"
            alt="marca"
            class="block w-[30px] lg:w-[40px]"
          />
          <div class="ml-6">
            <div class="text-white">
              <span class="px-2 text-3xl font-extrabold tracking-tighter lg:px-2 lg:text-3xl">P</span>
              <span class="px-2 text-3xl font-extrabold tracking-tighter lg:px-2 lg:text-3xl">R</span>
              <span class="px-2 text-3xl font-extrabold tracking-tighter lg:px-2 lg:text-3xl">E</span>
              <span class="px-2 text-3xl font-extrabold tracking-tighter lg:px-2 lg:text-3xl">C</span>
              <span class="px-2 text-3xl font-extrabold tracking-tighter lg:px-2 lg:text-3xl">I</span>
              <span class="px-2 text-3xl font-extrabold tracking-tighter lg:px-2 lg:text-3xl">O</span>
            </div>
            <div class="text-[#a5ac6f]">
              <span class="px-1 text-3xl lg:px-1 lg:text-3xl">s</span>
              <span class="px-1 text-3xl lg:px-1 lg:text-3xl">e</span>
              <span class="px-1 text-3xl lg:px-1 lg:text-3xl">l</span>
              <span class="px-1 text-3xl lg:px-1 lg:text-3xl">e</span>
              <span class="px-1 text-3xl lg:px-1 lg:text-3xl">c</span>
              <span class="px-1 text-3xl lg:px-1 lg:text-3xl">t</span>
              <span class="px-1 text-3xl lg:px-1 lg:text-3xl">o</span>
              <span class="px-1 text-3xl lg:px-1 lg:text-3xl">s</span>
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
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap");
.logo {
  font-family: "Caveat Brush", cursive;

  left: 50%;
  transform: translateX(-50%);
}
</style>
