<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useNavBar } from "@/store/menu";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useGetRoutes } from "@/composables/getRoutes";
import CargandoFrom from "@/components/globales/CargandoForm.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const token = ref(localStorage.getItem("token"));
const user_uuid = ref(localStorage.getItem("user_uuid"));
const { searchLabel, posterSmallCreate, posterSmallList } = useGetRoutes();
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


const useNavBarStore = useNavBar();
const { getUserData } = useNavBarStore;
const { userData } = storeToRefs(useNavBarStore);
const modalPagos = ref("top-[-100%]");
const modalTuto = ref("top-[-100%]");

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

// variables reactivas del escaner
const codeReader = new BrowserMultiFormatReader();
let selectedDeviceId;
const scan = ref(false);
const encontrado = ref(false);

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
          } else {
            encontrado.value = false;
            descripcion.value = formatearDescription(data[0].descripcion);
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



getUserData()


const abrirModalPagos = () => {
  modalPagos.value = "top-0";
};
const cerrarModalPagos = () => {
  modalPagos.value = "top-[-100%]";
};

const abrirModalTuto = () => {
  modalTuto.value = "block";
};
const cerrarModalTuto = () => {
  modalTuto.value = "hidden";
  videoTuto.pause();
};
const reproducir = () => {
  videoTuto.play();
};
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2">
    <div
      class="fixed top-0 left-0 z-50 w-full h-full p-4 overflow-hidden transition-all bg-white"
      :class="`${modalTuto}`"
    >
      <div class="flex items-center justify-between py-4">
        <button
          class="inline-block px-5 py-2 text-sm text-white bg-green-500 rounded-md shadow-md"
          @click.prevent="reproducir"
        >
          Reproducir
        </button>
        <button
          class="inline-block px-5 py-2 text-sm text-white rounded-md shadow-md bg-amber-500"
          @click.prevent="cerrarModalTuto"
        >
          Volver a mi compra
        </button>
      </div>
      <video
        controls
        class="block m-auto w-[90%] sm:w-[150px] md:w-[300px]"
        id="videoTuto"
      >
        <source src="../../public/tutorial.mp4" type="video/mp4" />
      </video>
    </div>
    <div
      class="fixed left-0 z-40 w-full h-full p-4 transition-all bg-white"
      :class="`${modalPagos}`"
    >
      <h3 class="flex items-center justify-between pb-4 font-medium text-black">
        PAGOS
        <button @click.prevent="cerrarModalPagos">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </h3>
      <div
        class="flex items-center justify-between p-4 text-sm font-medium rounded-md text-neutral-700 bg-amber-100"
      >
        ¿Como pagar?
        <button
          class="px-4 py-1 text-sm text-white bg-blue-500 rounded-md"
          @click.prevent="abrirModalTuto"
        >
          Ver tutorial
        </button>
      </div>
      <p class="p-4 text-sm font-light text-gray-500">
        Todas las transacciones son seguras y estan encriptadas.
      </p>
      <div>
        <div
          class="border border-b-0 border-solid border-[#ddd] p-4 flex items-center justify-between"
        >
          <div class="text-sm font-light">
            Suscripcion Premium<br />
            <span class="text-xs text-gray-400">(Duracion por 30 dias)</span>
          </div>
          <div class="text-sm font-semibold">$1.10</div>
        </div>
        <div
          class="flex items-center justify-between border border-solid border-[#ddd] p-4"
        >
          <span class="text-sm font-light">Wompi El Salvador</span>
          <div class="flex gap-1">
            <img
              src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169695890db3db16bfe.svg"
            />
            <img
              src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/5e3b05b68f3d31b87e84.svg"
            />
          </div>
        </div>
      </div>
      <div class="border border-t-0 border-solid border-[#ddd] bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-270.8 371 102 52"
          class="p-4 w-[150px] m-auto text-gray-500"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="2"
            d="M-182 404v16.8c0 .7-.4 1.2-1 1.2h-75.7c-.7 0-1.2-.6-1.2-1.2v-47.6c0-.7.6-1.2 1.2-1.2h75.7c.7 0 1 .6 1 1.2V395m-78-14h78m-17 18h27m-3.9-4.6 4.5 4.6-4.5 4.6"
          />
          <circle cx="-255.5" cy="376.5" r="1.5" fill="currentColor" />
          <circle cx="-250.5" cy="376.5" r="1.5" fill="currentColor" />
          <circle cx="-245.5" cy="376.5" r="1.5" fill="currentColor" />
        </svg>
        <p class="p-4 pt-0 text-xs font-light text-center text-gray-700">
          Luego de hacer clic en “Pagar ahora”, serás redirigido a Wompi El
          Salvador para completar tu compra de forma segura.
        </p>
        <div class="flex items-center justify-center p-4">
          <div
            class="wompi_button_widget"
            data-url-pago="https://lk.wompi.sv/ixtR"
          ></div>
        </div>
      </div>
    </div>
    <div v-if="userData">
      <div
        class="flex items-center justify-between bg-green-500 border-l-4 border-green-800 border-solid"
        v-if="userData.profile[0].suscripcion === 0"
      >
        <img
          src="../../public/premium_account2.png"
          alt="miembro premium"
          class="w-[75px] block p-4 animate-bounce"
        />
        <div class="w-full p-4 pl-0">
          <h3 class="text-sm font-medium text-white uppercase">
            Suscripcion Premium
          </h3>
          <p class="text-sm font-light text-white">
            Obten todos los beneficios de nuestra aplicacion
          </p>
          <div class="flex justify-end p-1">
            <button
              class="px-4 py-2 text-xs font-medium text-green-500 bg-white rounded-lg"
              @click.prevent="abrirModalPagos"
            >
              Comprar Suscripcion
            </button>
          </div>
        </div>
      </div>
    </div>
    <audio class="hidden" id="audioPlayer">
      <source src="../../public/beep.mp3" type="audio/mp3" />
      Tu navegador no soporta el elemento de audio.
    </audio>
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
    <h1
      class="flex items-center justify-between col-span-1 p-4 pb-4 font-medium text-gray-900"
    >
      Crear Afiches
      <router-link to="/afiches-mini" active-class="underline"
        >Afiches
        <span
          class="inline-flex items-center justify-center bg-rose-500 text-white text-xs font-medium rounded-full no-underline w-[20px] h-[20px]"
          >{{ totalRotulos }}</span
        ></router-link
      >
    </h1>

    <form
      class="w-full col-start-1 bg-gray-100 md:px-8"
      @submit.prevent="agregarAfiches"
    >
      <CargandoFrom
        :enviando="enviando"
        :textoCarga="' Agregando rotulos ..'"
      ></CargandoFrom>
      <div class="p-4">
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
            type="number"
            placeholder="CANTIDAD"
            min="1"
            max="200"
            autocomplete="off"
            v-model="cantidad"
            required
          />
        </div>
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
      <div class="w-[90%] lg:w-[85%] mx-auto sm:sticky sm:top-[70px]">
        <div class="bg-[#CEB16D] flex items-center justify-center pb-4">
          <div class="w-[85%] sm:w-[75%]">
            <div class="flex items-start justify-center w-full bg-[#9c564c]">
              <img
                src="../../public/logos.png"
                alt="marca"
                class="block w-[25px]"
              />
            </div>
            <div class="relative w-full bg-[#9c564c] px-4 pt-2 pb-7">
              <h2
                class="block w-full text-3xl font-black text-center text-white"
              >
                SÚPER
              </h2>
              <div
                class="absolute left-1/2 transform -translate-x-1/2 px-8 py-2 bottom-[-35px] inline oferta bg-[#c08256] text-4xl text-[#9c564c] tracking-widest"
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
</template>
<style>
@font-face {
    font-family: 'oferta';
    src: url('../../public/oferta.ttf') format('truetype');
}

.oferta {
    font-family: 'oferta', sans-serif;
}

</style>