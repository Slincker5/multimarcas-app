<script setup>
import { ref, onMounted, nextTick, watch, watchEffect, computed } from "vue";
import axios from "axios";
import { useMethodLabel } from "@/composables/methodLabel";
import { useGetRoutes } from "../composables/getRoutes";
import { v4 as uuidv4 } from "uuid";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

dayjs.locale("es");
dayjs.extend(relativeTime);

const usuario = ref(localStorage.getItem("usuario"));
const token = ref(localStorage.getItem("token"));

const { formatearDescription, formatearDescriptionMinusculas } =
  useMethodLabel();
const { searchLabel, labelCreate, labelList } = useGetRoutes();

const frmCintillo = ref(null);

// variables reactivas del formulario
const codeReader = new BrowserMultiFormatReader();
let selectedDeviceId;
const scan = ref(false);
const encontrado = ref(false);
const barra = ref("");
const descripcion = ref("");
const cantidad = ref("");
const precio = ref("");
const fecha = ref("");
const total = ref("");
const estadoTexto = ref(true);
const aviso = ref(localStorage.getItem("aviso"));

const cerrarAviso = () => {
  aviso.value = localStorage.setItem("aviso", "true");
};
const toggleMayMin = () => {
  estadoTexto.value === true
    ? (estadoTexto.value = false)
    : (estadoTexto.value = true);
};

const handleInput = (e) => {
  const cursorPosition = e.target.selectionStart;
  const originalLength = descripcion.value.length;
  descripcion.value = estadoTexto.value
    ? formatearDescription(e.target.value)
    : formatearDescriptionMinusculas(e.target.value);

  // Calcula el cambio en la longitud del texto para ajustar la posición del cursor
  const newLength = descripcion.value.length;
  const lengthDiff = newLength - originalLength;

  nextTick(() => {
    e.target.setSelectionRange(
      cursorPosition + lengthDiff,
      cursorPosition + lengthDiff
    );
  });
};
watch(estadoTexto, (nuevoValor, valorAnterior) => {
  if (nuevoValor) {
    // Si `nuevoValor` es true, aplicar una transformación
    descripcion.value = formatearDescription(descripcion.value);
  } else {
    // Si `nuevoValor` es false, aplicar otra transformación
    descripcion.value = formatearDescriptionMinusculas(descripcion.value);
  }
});

onMounted(() => {
  codeReader
    .listVideoInputDevices()
    .then((videoInputDevices) => {
      selectedDeviceId =
        videoInputDevices[videoInputDevices.length - 1].deviceId;
    })
    .catch((err) => {
      console.error(err);
    });
});

const getData = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    let { data } = await axios.get(labelList, {
      headers,
    });
    console.log(data);
    total.value = data.length;
  } catch (error) {
    console.log(error);
  }
};
getData();
const startScanner = async () => {
  scan.value = true;
  codeReader.decodeFromVideoDevice(
    selectedDeviceId,
    "video",
    async (res, err) => {
      if (res) {
        resetScanner();
        try {
          const { data } = await axios.get(`${searchLabel}${res.text}`, {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          });
          audioPlayer.play();
          barra.value = res.text;
          if (data.length === 0) {
            encontrado.value = true;
            descripcion.value = "";
            precio.value = "";
            fecha.value = "";
          } else {
            encontrado.value = false;
            descripcion.value = estadoTexto.value
              ? formatearDescription(data[0].descripcion)
              : formatearDescriptionMinusculas(data[0].descripcion);
            precio.value = data[0].precio == null ? "" : data[0].precio;
            fecha.value = data[0].fecha == null ? "" : data[0].fecha;
          }
        } catch (error) {
          console.log(error);
        }
      } else if (err && !(err instanceof NotFoundException)) {
        console.log(err);
      }
    }
  );
};

const resetScanner = () => {
  scan.value = false;
  codeReader.reset();
};

const reestablecerFormulario = () => {
  frmCintillo.value.reset();
  barra.value = "";
  descripcion.value = "";
  cantidad.value = "";
  precio.value = "";
};
const enviando = ref(false);
const agregarCintillos = async () => {
  try {
    enviando.value = true;
    const dataCintillo = {
      barra: barra.value,
      descripcion: estadoTexto.value
        ? formatearDescription(descripcion.value)
        : formatearDescriptionMinusculas(descripcion.value),
      cantidad: cantidad.value,
      precio: precio.value,
      username: usuario.value,
      uuid: uuidv4(),
    };
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };

    let { data } = await axios.post(labelCreate, dataCintillo, { headers });
    if (data.status === "error") {
      toast.error(data.message, {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    } else {
      getData();
      reestablecerFormulario();
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

// Definir las diapositivas y el índice actual
const slides = [
  "Revisa que el gramaje de las descipciones no quede solo.",
  "Revisa que la descripcion no lleve factor de empaque.",
  "Recuerda mantener una descripcion bien redactada.",
  "Los precios de nuestra app son un aproximado a los actuales, revisa siempre que sean correctos.",
  // Añade más textos según necesites
];
const currentSlideIndex = ref(0);

// Computar la diapositiva actual basada en el índice
const currentSlide = computed(() => slides[currentSlideIndex.value]);

// Función para actualizar la diapositiva actual
const updateSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.length;
};

// Establecer el intervalo para cambiar de diapositiva
watchEffect((onInvalidate) => {
  const interval = setInterval(updateSlide, 5000);
  onInvalidate(() => clearInterval(interval));
});

</script>
<template>
  <div class="w-full max-w-md m-auto">
    <div class="p-4 text-black recomendaciones">
      <b class="block mb-2 text-sm font-medium">RECOMENDACIONES</b>
      <Transition name="fade" mode="out-in">
        <p class="text-xs" :key="currentSlideIndex">{{ currentSlide }}</p>
      </Transition>
    </div>
    <div
      class="grid py-6 overflow-scroll bg-black place-items-center">
      <div
        class="flex items-center justify-between w-[340px] h-[150px] bg-white"
      >
        <div
          class="border border-solid border-red-500 h-[150px] bg-white w-[151px] text-center text-[16px] font-semibold text-black grid place-items-center"
        >
          <span
            class="p-2 block w-[153px] break-words whitespace-pre-wrap tipoFuente"
            >{{ descripcion }}</span
          >
        </div>
        <div
          class="border border-solid border-red-500 h-[150px] bg-gray-400 w-[41px]"
        ></div>
        <div
          class="border border-solid border-red-500 h-[150px] bg-black font-semibold flex items-center justify-end p-3 text-right text-white text-3xl w-[148px] tipoFuente"
        >
          $ {{ precio === "" ? "0.00" : precio }}
        </div>
      </div>
    </div>
    <audio class="hidden" id="audioPlayer">
      <source src="../../public/beep.mp3" type="audio/mp3" />
      Tu navegador no soporta el elemento de audio.
    </audio>
    <div class="p-4 m-auto">
      <h1
        class="flex items-center justify-between pb-4 font-medium text-gray-900"
      >
        <span>Agregar Cintillos</span>
        <div>
          <router-link
            to="/cintillos"
            class="text-[#e67d22c7]"
            active-class="underline"
            >Cintillos ({{ total }})</router-link
          >
        </div>
      </h1>

      <div class="p-2 my-2 text-sm bg-red-100" v-if="encontrado">
        El producto no se encuentra en nuestra base de datos, pero te escaneamos
        el codigo
      </div>
    </div>

    <div
      class="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
      v-if="scan"
    >
      <div class="relative p-4 bg-white">
        <div class="flex items-center justify-between pb-4">
          <h2 class="text-xl">Escanear Producto</h2>
          <button @click.prevent="resetScanner">
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>
        </div>
        <video id="video" width="300" height="200"></video>
      </div>
    </div>

    <form
      class="w-full p-4 pt-0"
      @submit.prevent="agregarCintillos"
      ref="frmCintillo"
    >
      <div class="mb-6">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="barra"
        >
          CODIGO DE BARRA:
        </label>

        <div
          class="flex items-stretch justify-between border border-solid border-[#ddd] focus:border-gray-500"
        >
          <input
            class="flex-grow px-4 py-3 leading-tight text-gray-700 border-0 rounded-l appearance-none focus:outline-none focus:bg-white"
            id="barra"
            type="text"
            placeholder="Ej. 1234567890123"
            autocomplete="off"
            v-model="barra"
          />
          <div>
            <a
              class="flex items-center justify-center h-full px-4 leading-tight text-gray-700 bg-gray-300 border rounded-r"
              @click.prevent="startScanner"
            >
              <img src="../../public/barcode.png" class="w-[25px] block" />
            </a>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <label
          class="flex items-center justify-between mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="descripcion"
        >
          DESCRIPCIÓN DEL PRODUCTO:
          <button
            class="text-sm"
            :class="
              estadoTexto
                ? 'text-sky-600 font-medium'
                : 'text-gray-400  font-normal'
            "
            @click.prevent="toggleMayMin"
          >
            May.
          </button>
        </label>
        <textarea
          class="block w-full px-4 py-3 leading-tight text-gray-700 border border-solid border-[#ddd] rounded appearance-none focus:outline-none focus:border-gray-500"
          id="descripcion"
          placeholder="DESCRIPCIÓN COMPLETA"
          autocomplete="off"
          v-model="descripcion"
          @input="handleInput"
          required
        ></textarea>
      </div>

      <div class="mb-6">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="cantidad"
        >
          CANTIDAD:
        </label>
        <input
          class="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          id="cantidad"
          type="number"
          placeholder="CANTIDAD"
          autocomplete="off"
          v-model="cantidad"
          required
        />
      </div>

      <div class="">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
          for="grid-password"
        >
          PRECIO DEL PRODUCTO:
        </label>
        <div
          class="pb-3 text-xs font-light text-gray-600"
          v-if="fecha.length > 0"
        >
          <font-awesome-icon :icon="['fas', 'bell']" /> Precio usado ultima vez
          el
          {{ dayjs(fecha).format("dddd, D [de] MMMM [de] YYYY") }}
        </div>
        <input
          class="block w-full px-4 py-3 leading-tight text-gray-700 border border-solid border-[#ddd] rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-password"
          type="text"
          placeholder="PRECIO"
          autocomplete="off"
          inputmode="numeric"
          v-model="precio"
          required
        />
      </div>
      <p class="block mt-2 mb-6 text-sm font-normal text-gray-400 lowercase">
        (No es necesario el signo de dolar)
      </p>
      <input
        type="submit"
        class="w-full px-4 py-2 font-bold text-white border rounded bg-[#383E42] hover:bg-[#1b2024] border-[#1b2024] shadow-md"
        value="AGREGAR CINTILLO"
      />
    </form>
    <div
      class="fixed w-full h-full flex items-center justify-center text-white bg-[#263238] p-4 text-xl top-0 left-0 z-50"
      v-if="enviando"
    >
      <font-awesome-icon :icon="['fas', 'spinner']" class="fa-pulse" />
      Agregando Cintillos...
    </div>
    <div
      class="fixed top-0 left-0 z-50 grid w-full h-full bg-white grid-custom-rows"
      v-if="aviso === null"
    >
      <h3
        class="px-4 py-6 font-medium text-center uppercase text-normal text-neutral-900"
      >
        Actualizacion importante
      </h3>
      <div class="px-4 overflow-y-auto info">
        <p class="my-4">
          Estamos emocionados de anunciar que hemos realizado una actualización
          significativa en nuestro módulo para la creación de cintillos. Nuestro
          equipo ha trabajado incansablemente para mejorar la funcionalidad y
          eficacia de este módulo, especialmente en lo que respecta al
          tratamiento de las descripciones de los productos.
        </p>
        <p class="mb-4">
          <b>¿Qué hay de nuevo?</b><br />

          Con esta actualización, nuestro módulo ahora tiene la capacidad de
          corregir y formatear las descripciones en el 100% de los casos,
          asegurando una presentación más clara y profesional de tus productos.
          Nos hemos enfocado en perfeccionar el proceso de formateo automático
          para que las descripciones sean consistentes y estén libres de errores
          comunes, tales como problemas con el espaciado, la capitalización y el
          uso de unidades de medida.
          <br />
          <br />
          <b>Lista de correcciones automáticas:</b><br /><br />

          <b>ML</b> pasa a ml<br />
          <b>U</b> pasa a u<br />
          <b>KG</b> pasa a kg<br />
          <b>CÁPSULAS, CAPSULAS</b> pasa a cápsulas<br />
          <b>TABLETAS</b> pasa a tabletas<br />
          <b>PIEZAS</b> pasa a piezas<br />
          <b>G., GRS, GRS., GR, G</b> pasa a g<br />
          <b>LB</b> pasa a lb<br />
        </p>
        <p class="mb-4">
          El corrector automático en nuestra app es una herramienta de soporte
          diseñada para facilitar la estandarización y corrección de
          descripciones de productos. Es importante destacar que su función es
          meramente auxiliar; la responsabilidad de verificar la exactitud y
          calidad de las descripciones recae en el usuario. Aunque el corrector
          busca optimizar el proceso de edición, la revisión manual sigue siendo
          esencial para garantizar la precisión del contenido. Te animamos a
          usar el corrector como un complemento en tu flujo de trabajo,
          recordando siempre realizar una revisión final.
        </p>
      </div>
      <div class="flex items-center justify-end p-6">
        <button class="font-medium text-sky-600" @click="cerrarAviso">
          CONTINUAR
        </button>
      </div>
    </div>
  </div>
</template>
<style>
.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 133.33%; /* Para un aspect ratio de 3:4, 4/3 = 1.3333 */
  overflow: hidden;
}

.responsive-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.responsive-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.grid-custom-rows {
  grid-template-rows: auto 1fr auto;
}

.recomendaciones {
  background: rgb(255, 242, 165);
  background: linear-gradient(
    114deg,
    rgba(255, 242, 165, 1) 36%,
    rgba(252, 255, 231, 1) 100%
  );
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.info {
  position: relative;
}
.info::after {
  content: "";
  position: sticky;
  display: block;
  bottom: 0;
  right: 0;
  height: 50px;
  width: 100%;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 10%,
    rgba(254, 255, 248, 1) 100%
  );
}

.tipoFuente {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
