<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useGetRoutes } from "@/composables/getRoutes";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { Client } from "@pusher/push-notifications-web";
dayjs.locale("es");
dayjs.extend(relativeTime);

const router = useRouter();
const { url, userStat, userUpdateToken, labelListGenerated } = useGetRoutes();

const token = ref(localStorage.getItem("token"));
const publicacion = ref("");
const estadistica = ref(null);
const enviando = ref(false);
const modalPagos = ref("top-[-100%]");
const modalTuto = ref("top-[-100%]");
const generados = ref([]);

const updateToken = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(userUpdateToken, null, { headers });
    localStorage.setItem("token", data.token);
  } catch (error) {
    console.log(error);
  }
};

updateToken();

const getGenerados = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    let { data } = await axios.get(labelListGenerated, {
      headers,
    });
    console.log(data);
    generados.value = data;
  } catch (error) {
    console.log(error);
  }
};
getGenerados();

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

const obtenerEstadisticas = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.get(userStat, { headers });
    estadistica.value = data;
    const script = document.createElement("script");
    script.src = "https://pagos.wompi.sv/js/wompi.pagos.js";
    document.head.appendChild(script);
    const beamsClient = new Client({
      instanceId: "b963f891-0b89-4e01-84a8-698b97373219",
    });
    if (estadistica.value.profile[0].suscripcion === 1) {
      beamsClient
        .start()
        .then(() =>
          beamsClient.addDeviceInterest(
            `${estadistica.value.profile[0].user_uuid}`
          )
        )
        .then(() => console.log("Successfully registered and subscribed!"))
        .catch(console.error);
    }
  } catch (error) {
    console.log(error);
  }
};
obtenerEstadisticas();

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Codigo copiado al portapapeles.", {
      theme: "colored",
      autoClose: 1500,
      position: toast.POSITION.BOTTOM_LEFT,
      transition: toast.TRANSITIONS.ZOOM,
    });
  } catch (err) {
    console.error("No se pudo copiar el texto:", err);
  }
}

const anuncioTmp = ref(localStorage.getItem("anuncioTmp"));
const cerrarVentana = () => {
  anuncioTmp.value = localStorage.setItem("anuncioTmp", "true");
};
</script>
<template>
  <div class="overflow-auto">
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
    <audio class="hidden" id="audioPlayer">
      <source src="../../public/tap-like.mp3" type="audio/mp3" />
      Tu navegador no soporta el elemento de audio.
    </audio>
    <div
      class="flex items-stretch w-full gap-1 p-4 overflow-x-auto bg-gray-100 whitespace-nowrap acciones border-b border-solid border-[#ddd]"
    >
      <router-link to="/buscador" class="py-3 rounded-lg bg">
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/dairy-products.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs font-medium text-black"
          >Buscar Internos</span
        >
      </router-link>

      <router-link to="crear-cintillos" class="py-3 rounded-lg bg">
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/price-tag.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs font-medium text-black"
          >Crear Cintillos</span
        >
      </router-link>

      <router-link
        to="/crear-afiches-mini-descuentos"
        class="relative py-3 rounded-lg bg"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/descuento.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs font-medium text-black"
          >Crear Afiches</span
        >
      </router-link>

      <router-link to="/crear-afiches" class="py-3 rounded-lg bg">
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/rotulo-uno.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs font-medium text-black"
          >Crear Afiches</span
        >
      </router-link>

      <router-link to="/crear-afiches-mini" class="py-3 rounded-lg bg">
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/rotulo-dos.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs font-medium text-black"
          >Crear Afiches</span
        >
      </router-link>

      <router-link to="/crear-afiches-baja-mini" class="py-3 rounded-lg bg">
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/precio_bajo.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs font-medium text-black"
          >Crear Afiches</span
        >
      </router-link>

      <router-link to="/acortador" class="relative hidden py-3 rounded-lg bg">
        <span
          class="absolute top-0 right-0 inline-flex w-3 h-3 font-black rounded-full opacity-75 animate-ping bg-rose-700"
        ></span>
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/http.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs font-medium text-black">Acortar URL</span>
      </router-link>
    </div>
    <div>
      <div
        class="flex items-start justify-between bg-indigo-400 border-l-4 border-indigo-700 border-solid"
      >
        <img
          src="../../public/support.png"
          alt="atención al cliente"
          class="w-[75px] block p-4"
        />
        <div class="w-full p-4 pl-0">
          <h3 class="text-sm font-medium text-white uppercase">
            Atención al cliente
          </h3>
          <p class="text-sm font-light text-white">
            Tienes problemas con la app puedes contactarnos.
          </p>
          <div class="flex justify-end p-1">
            <a
              href="https://wa.me/+50374329014"
              class="px-4 py-2 text-xs font-medium text-indigo-400 bg-white rounded-lg"
            >
              Escribir mensaje
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="estadistica">
      <div
        class="flex items-center justify-between bg-green-500 border-l-4 border-green-800 border-solid"
        v-if="estadistica.profile[0].suscripcion === 0"
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
    <div>
      <h3 class="p-4 font-medium">HISTORIAL CINTILLOS</h3>

      <div
        class="grid grid-cols-1 gap-1 p-4 sm:gap-2 sm:grid-cols-2 md:grid-cols-3"
        v-if="generados.length > 0"
      >
        <div
          class="bg-white border border-solid border-[#ddd] mb-4"
          v-for="generado in generados"
        >
          <div class="p-4 text-sm font-medium text-neutral-700">
            <img
              src="../../public/excel.png"
              class="w-[16px] inline-block align-middle"
            />
            {{ generado.path_name }}
          </div>
          <div class="border-t border-solid border-[#ddd] p-4">
            <div class="overflow-hidden">
              <b class="pr-1 text-sm font-medium">Enviado:</b
              ><span
                class="text-sm text-gray-500"
                v-if="generado.email === null"
              >
                {{ generado.receptor }}</span
              ><span class="text-sm text-gray-500" v-else>{{
                generado.email
              }}</span>
            </div>
          </div>
          <div class="p-4 pt-0">
            <div class="flex items-center justify-between">
              <div>
                <b class="pr-1 text-sm font-medium">Codigo ref:</b
                ><span class="text-sm text-green-500">
                  #{{ generado.code }}</span
                >
              </div>
              <button
                @click="copyToClipboard(generado.code)"
                class="text-sm text-neutral-500"
              >
                <font-awesome-icon :icon="['fas', 'clipboard']" /> COPIAR
              </button>
            </div>
          </div>
          <div class="p-4 pt-0">
            <b class="pr-1 text-sm font-medium">Generado:</b>
            <span class="text-sm text-gray-500">{{
              dayjs(generado.fecha).fromNow()
            }}</span>
          </div>
          <div class="p-4 border-t border-dashed border-[#ddd]">
            <a
              :href="`${url}/${generado.path}`"
              download
              class="block w-full px-4 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-100 rounded shadow focus:bg-gray-300 hover:bg-gray-300 ripple hover:shadow-lg focus:outline-none"
            >
              DESCARGAR
            </a>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center p-4 h-52" v-else>
        <div class="text-xl text-neutral-700">
          <img
            src="../../public/sad.gif"
            class="w-[27px] inline-block align-middle"
          />Esto parece un desierto.
        </div>
      </div>
    </div>

    <div
      class="fixed w-full h-full flex items-center justify-center text-white bg-[#263238] p-4 text-xl top-0 left-0 z-50"
      v-if="enviando"
    >
      <font-awesome-icon :icon="['fas', 'spinner']" class="fa-pulse" />
      Creando Publicacion...
    </div>

    <div
      class="fixed top-0 left-0 z-30 flex items-center justify-center w-full h-full bg-black/80"
      v-if="anuncioTmp === null"
    >
      <div
        class="bg-white w-[80%] py-6 px-4 max-w-screen-sm rounded-lg shadow-2xl"
      >
        <img src="../../public/celebrar.png" class="w-[30%] block m-auto" />
        <h3
          class="pt-4 font-medium text-center text-black uppercase text-nomal"
        >
          Nuevos Tipos de Afiches!
        </h3>
        <p class="py-4 text-sm text-center text-gray-500" v-if="estadistica">
          Nos complace anunciarte que desde ahora ya estan habilitados la
          creacion de afiches con porcentaje.
        </p>
        <div class="py-4 pb-0 border-t border-dashed border-[#ddd]">
          <button
            class="block px-6 py-2 mx-auto mb-4 text-sm text-center border border-solid rounded-sm shadow-lg border-neutral-700"
            @click.prevent="cerrarVentana"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.b {
  background: rgb(56, 62, 66);
  background: linear-gradient(
    180deg,
    rgba(56, 62, 66, 0.5) 0%,
    rgba(56, 62, 66, 1) 50%
  );
}

.acciones::-webkit-scrollbar {
  display: none; /* Oculta la barra de desplazamiento en navegadores WebKit (como Chrome/Safari) */
}

.bg {
  background-image: url("../../public/bg.png");
  background-repeat: repeat;
  background-size: contain;
  background-color: #fff;
  border: 1px solid #ddd;
  color: #000;
  transition: all ease 1s;
}

.bg:focus {
  background-image: #383e42;
}
</style>
