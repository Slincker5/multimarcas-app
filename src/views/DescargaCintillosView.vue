<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useCintillosCreados } from "@/store/cintillosCreados";
import { useGetRoutes } from "@/composables/getRoutes";

const router = useRouter();
let useCantidad = useCintillosCreados();
let { resetCintillos } = useCantidad;
const { url, labelBuild } = useGetRoutes();
const token = ref(localStorage.getItem("token"));

const nombreCintillo = () => {
  const objDate = new Date();
  const objName = {
    year: objDate.getFullYear(),
    month: ("0" + (objDate.getMonth() + 1)).slice(-2),
    day: ("0" + objDate.getDate()).slice(-2),
    hour: ("0" + objDate.getHours()).slice(-2),
    minute: ("0" + objDate.getMinutes()).slice(-2),
    second: ("0" + objDate.getSeconds()).slice(-2),
  };
  const { year, month, day, hour, minute, second } = objName;
  const filename = `CINTILLOS-${year}-${month}-${day}-${hour}${minute}${second}.xlsx`;
  return filename;
};
const windowOne = ref(false);
const windowTwo = ref(false);
const modal = ref(false);
const generarDocumento = async () => {
  try {
    modal.value = true;
    windowOne.value = true;
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(labelBuild, null, { headers });

    if (data.status === "OK") {
      location.href = `${url}/${data.path_tmp_full}`;
    }
  } catch (error) {
    console.log(error);
  } finally {
    windowOne.value = false;
    windowTwo.value = true;
  }
};
const cerrarModal = () => {
  modal.value = false;
  windowOne.value = false;
  windowTwo.value = false;
  router.push("/");
  resetCintillos();
};

const show = ref(false);
const abrirModalCorreos = () => {
  show.value = true;
};
</script>

<template>
  <div>
    <div
      class="bg-black/[.5] fixed top-0 left-0 w-full h-full z-30 flex items-center justify-center"
      v-if="modal"
    >
      <div class="bg-white w-[90%] p-4" v-if="windowTwo">
        <h1 class="mb-4 text-sm font-bold text-gray-700">
          ARCHIVO GENERADO EXITOSAMENTE
        </h1>
        <p class="text-gray-700">
          <font-awesome-icon :icon="['fas', 'face-smile-beam']" />Tu documento
          ha sido descargado...<br />Gracias por usar nuestra aplicación, si te
          ha gustado compártela!!
        </p>
        <div class="flex justify-end">
          <button
            class="inline-flex items-center px-4 py-2 mt-2 font-medium rounded bg-emerald-400 hover:bg-emerald-400 text-emerald-900"
            @click="cerrarModal"
          >
            Terminar
          </button>
        </div>
      </div>
      <div class="bg-white w-[90%] p-4" v-if="windowOne">
        <h1 class="mb-4 text-sm font-bold text-gray-700">
          GENERANDO DOCUMENTO
        </h1>
        <p class="text-gray-700">
          <font-awesome-icon :icon="['fas', 'spinner']" class="mr-2 fa-pulse" />
          Espera unos segundos, estamos creando tus cintillos..
        </p>
      </div>
    </div>
    <h1
      class="flex items-center justify-between p-4 pb-0 font-medium text-gray-800"
    >
      <router-link to="/cintillos"
        ><font-awesome-icon :icon="['fas', 'chevron-left']" />
        VOLVER</router-link
      >
      <span>DESCARGAS</span>
    </h1>
    <div class="hidden p-4 border-b border-gray-400 border-dashed">
      <h1 class="pb-4 font-medium text-gray-800">
        <font-awesome-icon :icon="['fas', 'circle']" /> OPCION 1 (Descargar
        archivo)
      </h1>
      <p class="py-4 pt-0 text-gray-800">
        <font-awesome-icon :icon="['fas', 'circle-info']" /> Esta opcion guarda
        en tu dispositivo un archivo excel con todos los cintillos que has
        creado. Este lo puedes compartir posteriormente.
      </p>
      <div class="py-4 pt-0 text-sm font-medium text-black">
        <font-awesome-icon :icon="['fas', 'file-excel']" />
        {{ nombreCintillo() }}
      </div>

      <a
        href="#"
        class="inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg"
        @click.prevent="generarDocumento"
        ><span></span>
        <font-awesome-icon :icon="['fas', 'download']" class="mr-2" />
        Descargar</a
      >
    </div>
    <div class="p-4 border-b border-gray-400 border-dashed">
      <h1 class="mb-4 font-medium text-gray-800">
        <font-awesome-icon :icon="['fas', 'circle']" /> OPCION 2 (Enviar por
        correo)
      </h1>
      <p class="py-4 pt-0 text-gray-800">
        <font-awesome-icon :icon="['fas', 'circle-info']" /> Con esta opcion
        podras enviar tus cintillos directamente al operador(computo), por el
        momento el envio por correo esta disponible para
        <b class="font-extrabold text-black">77 SALAS</b>.
      </p>
      <router-link
        to="/enviar-cintillos"
        class="inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg"
        ><font-awesome-icon :icon="['fas', 'envelope']" class="mr-2" /> Enviar
        por correo</router-link
      >
    </div>

    <div class="p-4">
      <h1 class="mb-4 font-medium text-gray-800">
        <font-awesome-icon :icon="['fas', 'circle']" /> OPCION 3 (Correo
        personalizado)
      </h1>
      <p class="py-4 pt-0 text-gray-800">
        <font-awesome-icon :icon="['fas', 'circle-info']" /> Con esta opcion
        puedes mandar tus cintillos al correo que tu quieras.
      </p>
      <router-link
        to="/correo-personalizado"
        class="inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg"
        ><font-awesome-icon :icon="['fas', 'envelope']" class="mr-2" /> Correo
        personalizado</router-link
      >
    </div>
  </div>
</template>
