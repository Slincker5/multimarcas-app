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

dayjs.locale("es");
dayjs.extend(relativeTime);

const router = useRouter();
const {
  url,
  userNoPhoto,
  userStat,
  userUpdateToken,
  postCreate,
  postList,
  labelListGenerated,
  postRemove,
  likePost,
  likeList,
} = useGetRoutes();

const token = ref(localStorage.getItem("token"));
const user_uuid = ref(localStorage.getItem("user_uuid"));
const username = ref(localStorage.getItem("usuario"));
const photo = ref(localStorage.getItem("photo"));
const email = ref(localStorage.getItem("email"));
const rol = ref(localStorage.getItem("rol"));
const publicacion = ref("");
const posts = ref([]);
const likes = ref([]);
const estadistica = ref(null);
const enviando = ref(false);
const modalPagos = ref("top-[-100%]");
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

/*function calcularDiferencia() {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  let countDown = new Date("Jan 05, 2024 00:00:00").getTime(),
    x = setInterval(function () {
      let now = new Date().getTime(),
        distance = countDown - now;

      let dia = Math.floor(distance / day);
      let hora = Math.floor((distance % day) / hour);
      let minuto = Math.floor((distance % hour) / minute);
      let segundo = Math.floor((distance % minute) / second);
      cuentaRegresiva.innerHTML = ` En ${dia}d, ${hora}h, ${minuto}m, ${segundo}s se apaga la app`;
    }, second);
}

calcularDiferencia();*/

// HACER PUBLICACION

const getLikes = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    let { data } = await axios.get(likeList, {
      headers,
    });
    console.log(data);
    likes.value = data;
  } catch (error) {
    console.log(error);
  }
};

const getData = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    let { data } = await axios.get(postList, {
      headers,
    });
    console.log(data);
    posts.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    getLikes();
  }
};
getData();

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
const darlike = async (post_uuid) => {
  try {
    audioPlayer.play();
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };

    const param = {
      post_uuid: post_uuid,
    };

    let { data } = await axios.post(likePost, param, { headers });
    if (data.status === "OK") getData();
  } catch (error) {
    console.log(error);
  }
};

const crearPublicacion = async () => {
  try {
    enviando.value = true;
    const param = {
      message: publicacion.value,
    };
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(postCreate, param, { headers });
    if (data.status === "OK") {
      getData();
      toast.success(data.message, {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    } else {
      toast.error(data.message, {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    publicacion.value = "";
    enviando.value = false;
  }
};

const eliminarPost = async (post_uuid) => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };

    const info = {
      post_uuid: post_uuid,
    };

    let { data } = await axios.delete(postRemove, {
      headers: headers,
      data: info,
    });

    getData();
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
const abrirModalPagos = () => {
  modalPagos.value = "top-0";
};
const cerrarModalPagos = () => {
  modalPagos.value = "top-[-100%]";
};

const obtenerEstadisticas = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.get(userStat, { headers });
    estadistica.value = data;
  } catch (error) {
    console.log(error);
  }
};
obtenerEstadisticas();
onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://pagos.wompi.sv/js/wompi.pagos.js";
  document.head.appendChild(script);
});

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Enlace copiado al portapapeles.", {
      theme: "colored",
      autoClose: 1500,
      position: toast.POSITION.BOTTOM_LEFT,
      transition: toast.TRANSITIONS.ZOOM,
    });
  } catch (err) {
    console.error("No se pudo copiar el texto:", err);
  }
}
</script>
<template>
  <div>
    <!--<div class="flex p-4 text-white bg-red-400">
      <font-awesome-icon :icon="['fas', 'bell']" class="mr-2 text-sm" />
      <div class="text-sm font-light text-white" id="cuentaRegresiva"></div>
    </div>-->

    <div
      class="fixed left-0 z-50 w-full h-full p-4 transition-all bg-white"
      :class="`${modalPagos}`"
    >
      <h3 class="flex items-center justify-between pb-4 font-medium text-black">
        PAGOS
        <button @click.prevent="cerrarModalPagos">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </h3>
      <p class="pb-4 text-sm font-light text-gray-500">
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

    <h3 class="p-4 font-medium">HISTORIAL CINTILLOS</h3>
    <div class="p-4 text-sm bg-amber-50 text-neutral-800">
      Aqui encontraras los ultimos 10 archivos enviados a computo.
    </div>
    <div
      class="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 md:grid-cols-3 bg-gray-50"
      v-if="generados.length > 0"
    >
      <div
        class="bg-white border border-solid border-[#e9e8e8] mb-4"
        v-for="generado in generados"
      >
        <div class="p-4 text-sm font-light text-neutral-700">
          <img
            src="../../public/excel.png"
            class="w-[16px] inline-block align-middle"
          />
          {{ generado.path_name }}
        </div>
        <div class="border-t border-solid border-[#ddd] p-4">
          <div class="overflow-hidden">
            <b class="pr-1 text-sm font-medium">Enviado:</b
            ><span class="text-sm text-gray-500" v-if="generado.email === null">
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
              ><span class="text-sm text-green-500"> #{{ generado.code }}</span>
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
            class="block w-full px-4 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-100 rounded shadow focus:bg-gray-300 hover:bg-gray-300 ripple hover:shadow-lg hover:bg-gray-200 focus:outline-none"
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

    <div
      class="fixed w-full h-full flex items-center justify-center text-white bg-[#263238] p-4 text-xl top-0 left-0 z-50"
      v-if="enviando"
    >
      <font-awesome-icon :icon="['fas', 'spinner']" class="fa-pulse" />
      Creando Publicacion...
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
