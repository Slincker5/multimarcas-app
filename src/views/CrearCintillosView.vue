<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useMethodLabel } from "@/composables/methodLabel";
import { useGetRoutes } from "@/composables/getRoutes";
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

const { formatearDescription } = useMethodLabel();
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
const handleInput = (event) => {
  descripcion.value = formatearDescription(event.target.value);
};

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
            descripcion.value = formatearDescription(data[0].descripcion);
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
      descripcion: formatearDescription(descripcion.value),
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
</script>
<template>
  <div class="w-full max-w-md m-auto">
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
          <router-link to="/cintillos" active-class="underline"
            >Cintillos
            <span
              class="inline-flex items-center justify-center bg-[#A2B2EE] text-[#2E3239] text-xs font-medium rounded-full no-underline w-[20px] h-[20px]"
              >{{ total }}</span
            ></router-link
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

    <div class="p-4 pt-0">
      <form
        class="w-full max-w-lg"
        @submit.prevent="agregarCintillos"
        ref="frmCintillo"
      >
        <div class="flex flex-wrap mb-6 -mx-3">
          <div class="w-full px-3 mb-6">
            <label
              class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
              for="grid-first-name"
            >
              CODIGO DE BARRA:
            </label>

            <div class="flex items-stretch justify-between">
              <input
                class="flex-grow px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border rounded-l appearance-none focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Ej. 1234567890123"
                autocomplete="off"
                v-model="barra"
              />
              <a
                class="flex items-center justify-center px-4 mb-3 leading-tight text-gray-700 bg-gray-300 border rounded-r"
                @click.prevent="startScanner"
              >
                <img
                  src="../../public/barcode.png"
                  class="w-[25px] inline-block"
                />
              </a>
            </div>

            <p class="text-xs font-light text-gray-600">
              <font-awesome-icon :icon="['fas', 'info-circle']" /> El código de
              barra es opcional
            </p>
          </div>
          <div class="w-full px-3">
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
              @input="handleInput"
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
              CANTIDAD:
            </label>
            <input
              class="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="number"
              placeholder="CANTIDAD"
              autocomplete="off"
              v-model="cantidad"
              required
            />
            <p class="text-xs font-light text-gray-600">
              <font-awesome-icon :icon="['fas', 'info-circle']" /> Ingresá la
              cantidad de cintillos que necesitas para este producto
            </p>
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
            <div
              class="pb-3 text-xs font-light text-gray-600"
              v-if="fecha.length > 0"
            >
              <font-awesome-icon :icon="['fas', 'bell']" beat /> Precio usado
              ultima vez el
              {{ dayjs(fecha).format("dddd, D [de] MMMM [de] YYYY") }}
            </div>
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
          class="w-full px-4 py-2 font-bold text-white border rounded bg-[#2E3239] hover:bg-[#37474F] border-[#303E46] shadow-md"
          value="AGREGAR CINTILLO"
        />
      </form>
    </div>
    <div
      class="fixed w-full h-full flex items-center justify-center text-white bg-[#263238] p-4 text-xl top-0 left-0 z-50"
      v-if="enviando"
    >
      <font-awesome-icon :icon="['fas', 'spinner']" class="fa-pulse" />
      Agregando Cintillos...
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
</style>
