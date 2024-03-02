<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useGetRoutes } from "@/composables/getRoutes";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const token = ref(localStorage.getItem("token"));
const user_uuid = ref(localStorage.getItem("user_uuid"));
const { searchLabel, posterSmallDescCreate, posterSmallDescList } =
  useGetRoutes();
// variables reactivas del formulario
const enviando = ref(false);
const descripcion = ref("");
const cantidad = ref("");
const precio = ref("");
const f_fin = ref("");
const f_fin_n = ref("");
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
    const { data } = await axios.get(posterSmallDescList, { headers });
    totalRotulos.value = data.length;
  } catch (error) {
    console.log(error);
  }
};

obtenerTotalRotulos();

const reestablecerFormulario = () => {
  descripcion.value = "";
  f_fin.value = "";
  cantidad.value = "";
  precio.value = "";
  f_fin_n.value = "";
};
const agregarAfiches = async () => {
  try {
    if (selected.value !== null) {
      enviando.value = true;
      const dataCintillo = {
        descuento: items[selected.value].text,
        descripcion: formatearDescription(descripcion.value),
        precio: precio.value,
        f_fin: f_fin_n.value,
        cantidad: cantidad.value,
      };
      const headers = {
        Authorization: "Bearer " + token.value,
        "Content-Type": "application/json",
      };

      let { data } = await axios.post(posterSmallDescCreate, dataCintillo, {
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
    } else {
      toast.error("Tienes que seleccionar un tipo de rotulo.", {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    }
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
const afichePreview = ref("hidden");

const abrirPreview = () => {
  afichePreview.value = "block";
};
const cerrarPreview = () => {
  afichePreview.value = "hidden";
};

const items = [
  { text: "20% DE DESCUENTO" },
  { text: "25% DE DESCUENTO" },
  { text: "30% DE DESCUENTO" },
  { text: "35% DE DESCUENTO" },
  { text: "40% DE DESCUENTO" },
  { text: "45% DE DESCUENTO" },
  { text: "2X1" },
  { text: "DOS POR:" },
];

const selected = ref(null);

const selectItem = (index) => {
  selected.value = index;
  console.log(items[selected.value].text);
};
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2">
    <h1
      class="flex items-center justify-between col-span-1 p-4 pb-4 font-medium text-gray-900"
    >
      Crear Afiches
      <router-link to="/afiches-mini-descuentos" active-class="underline"
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
      <h3
        class="block p-4 pb-0 text-xs font-bold tracking-wide text-gray-700 uppercase"
      >
        SELECIONA TIPO DE ROTULO:
      </h3>
      <div
        class="flex w-full gap-2 p-4 overflow-auto whitespace-nowrap eliminarBarraScroll"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="{
            'text-sm inline-block px-3 py-2 font-medium text-center uppercase bg-gray-200 rounded-lg shadow-md cursor-pointer text-gray-500': true,
            'bg-sky-600 text-white': selected === index,
          }"
          @click="selectItem(index)"
        >
          {{ item.text }}
        </div>
      </div>
      <div class="p-4">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="descripcion"
        >
          DESCRIPCIÓN DEL PRODUCTO:
        </label>
        <textarea
          class="block w-full px-4 py-3 mb-3 text-gray-700 bg-gray-200 border rounded-l appearance-none focus:outline-none focus:bg-white"
          id="descripcion"
          type="text"
          placeholder="DESCRIPCIÓN COMPLETA"
          autocomplete="off"
          v-model="descripcion"
          @input="handleInput"
          required
        ></textarea>
      </div>
      <div class="flex items-center justify-between">
        <div class="w-full px-4">
          <label
            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
            for="precio"
          >
            PRECIO:
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
        </div>

        <div class="w-full px-4">
          <label
            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
            for="cantidad"
          >
            CANTIDAD:
          </label>
          <input
            class="block w-full px-4 py-3 mb-3 text-gray-700 bg-gray-200 border rounded-l appearance-none focus:outline-none focus:bg-white"
            id="cantidad"
            type="text"
            placeholder="CANTIDAD"
            inputmode="numeric"
            autocomplete="off"
            v-model="cantidad"
            required
          />
        </div>
      </div>
      <p class="px-4 text-xs font-light text-gray-600">
        <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-1" />No
        olvides agregar el signo de dolar.
      </p>

      <div class="p-4">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="f_fin"
        >
          OFERTA FINALIZA:
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
      <div class="h-[300px] flex items-center justify-center text-white p-6 text-2xl">La previsualizacion aun no esta disponible para este tipo de afiches.. (proximamente)</div>
      
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
.eliminarBarraScroll::-webkit-scrollbar {
  display: none;
}
</style>
