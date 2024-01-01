<script setup>
import { ref } from "vue";
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
  userStat,
  userNoPhoto,
  userMvc,
  userUpdateToken,
  postCreate,
  postList,
} = useGetRoutes();

const token = ref(localStorage.getItem("token"));
const user_uuid = ref(localStorage.getItem("user_uuid"));
const username = ref(localStorage.getItem("usuario"));
const photo = ref(localStorage.getItem("photo"));
const email = ref(localStorage.getItem("email"));
const publicacion = ref("");
const posts = ref([]);
const estadistica = ref([]);
const enviando = ref(false);

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

const mvc = async () => {
  try {
    const param = {
      user_uuid: user_uuid.value,
    };
    const { data: verificar } = await axios.post(userMvc, param);
    if (verificar[0].mvc === null) {
      let param2;
      if (!localStorage.getItem("email") && !localStorage.getItem("photo")) {
        param2 = {
          user_uuid: user_uuid.value,
          username: username.value,
          email: null,
          photo: null,
        };
      } else {
        param2 = {
          user_uuid: user_uuid.value,
          username: username.value,
          email: email.value,
          photo: photo.value,
        };
      }
      const { data: update } = await axios.post(userUpdateToken, param2);
      localStorage.setItem("token", update.token);
      if (update.status === "OK") {
        location.reload();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

mvc();
obtenerEstadisticas();

const salir = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_uuid");
  localStorage.removeItem("usuario");
  localStorage.removeItem("photo");
  localStorage.removeItem("email");
  router.push("/login");
};

function calcularDiferencia() {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  let countDown = new Date("Jan 01, 2024 00:00:00").getTime(),
    x = setInterval(function () {
      let now = new Date().getTime(),
        distance = countDown - now;

      let dia = Math.floor(distance / day);
      let hora = Math.floor((distance % day) / hour);
      let minuto = Math.floor((distance % hour) / minute);
      let segundo = Math.floor((distance % minute) / second);
      cuentaRegresiva.innerHTML = `${hora}h, ${minuto}m, ${segundo}s para 2024`;
    }, second);
}

calcularDiferencia();

// HACER PUBLICACION

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
  }
};
getData();

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
</script>
<template>
  <div>
    <!--<div class="p-4 text-white bg-red-400" id="cuentaRegresiva"></div>-->

    <div
      class="flex items-stretch w-full gap-1 p-4 overflow-x-auto bg-gray-100 whitespace-nowrap acciones border-b border-solid border-[#ddd]"
    >
      <router-link to="/buscador" 
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/dairy-products.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Buscar Internos</span>
      </router-link>

      <router-link to="crear-cintillos"
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/price-tag.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Crear Cintillos</span>
      </router-link>

      <router-link to="/crear-afiches"
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/rotulo-uno.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Crear Afiches</span>
      </router-link>

      <router-link to="/crear-afiches-mini"
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/rotulo-dos.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Crear Afiches</span>
      </router-link>

      <router-link to="/crear-afiches-baja-mini"
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/precio_bajo.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Crear Afiches</span>
      </router-link>
    </div>

    <form class="p-4" @submit.prevent="crearPublicacion">
      <h3 class="flex items-center justify-between pb-4 font-medium">PUBLICACIONES <div class="text-sm font-light text-gray-400" id="cuentaRegresiva"></div></h3>
      <div class="flex justify-between">
        <div class="mr-2">
          <div v-if="photo !== null">
            <img :src="photo" :alt="username" class="w-[35px] rounded shadow" />
          </div>

          <div v-else>
            <img :src="userNoPhoto" :alt="username" class="w-[35px]" />
          </div>
        </div>
        <textarea
          class="flex-1 w-full h-10 px-3 py-1 text-sm border border-[#ddd] rounded-lg outline-none resize-none placeholder:text-sm"
          placeholder="Haz una publicacion"
          maxlength="2000"
          v-model="publicacion"
        ></textarea>
      </div>
      <div class="flex items-center justify-between px-4 py-2 pb-0">
        <div class="text-sm text-gray-400">
          Caracteres {{ publicacion.length }}/2000
        </div>
        <input
          type="submit"
          class="h-9 w-[120px] bg-amber-500 text-sm text-white rounded-lg transition-all cursor-pointer hover:bg-blue-600"
          value="Publicar"
        />
      </div>
    </form>

    <div class="p-4 bg-white">
      <div
        class="border border-solid border-[#ddd] mb-3"
        v-for="post in posts"
        :key="post.id"
      >
        <div class="flex items-center p-4">
          <div class="mr-2">
            <div v-if="post.photo !== null">
              <img
                :src="post.photo"
                :alt="post.username"
                class="w-[35px] rounded shadow"
              />
            </div>
            <div v-else>
              <img :src="userNoPhoto" :alt="post.username" class="w-[35px]" />
            </div>
          </div>
          <div>
            <div class="font-medium text-black">
              {{ post.username }}
            </div>
            <div class="text-xs text-gray-400">
              {{ dayjs(post.fecha).fromNow() }}
            </div>
          </div>
        </div>

        <div class="p-4 pt-0">
          {{ post.post }}
          <div v-if="post.archivo !== NULL" class="pt-2">
            <img :src="post.archivo" class="block w-full" />
          </div>
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
    <!--
    <h1
      class="flex items-center justify-between col-span-1 p-4 pb-4 font-medium text-gray-900 border-b border-solid border-[#ddd]"
    >
      MI CUENTA
      <font-awesome-icon :icon="['fas', 'user']" />
    </h1>
    <div class="flex p-4 gap-x-4">
      <div v-if="photo !== null">
        <img :src="photo" :alt="username" class="w-[50px] rounded shadow" />
      </div>

      <div v-else>
        <img :src="userNoPhoto" :alt="username" class="w-[50px]" />
      </div>
      <div>
        <span class="font-medium">{{ username }}</span
        ><br />
        <div class="text-sm font-light text-gray-700">
          <b class="text-sm"
            >Cintillos creados:
            <span v-if="estadistica['totalCintillosGenerados']">{{
              estadistica["totalCintillosGenerados"]
            }}</span>
            <font-awesome-icon v-else :icon="['fas', 'circle-notch']" spin /></b
          ><br />
          <b class="text-sm"
            >Rotulos creados:
            <span v-if="estadistica['totalRotulosGenerados']">{{
              estadistica["totalRotulosGenerados"]
            }}</span>
            <font-awesome-icon v-else :icon="['fas', 'circle-notch']" spin
          /></b>
        </div>
      </div>
      <a href="#" @click.prevent="salir" class="ml-auto text-blue-600"
        >salir <font-awesome-icon :icon="['fas', 'right-from-bracket']"
      /></a>
    </div>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2">
    <div
      class="flex items-stretch justify-between border-b border-black border-solid"
    >
      <div class="relative bg-black">
        <img
          src="../../public/market.jpg"
          class="w-[100px] h-[125px] object-cover"
        />
        <div class="absolute top-0 left-0 w-full h-full b"></div>
      </div>

      <div class="relative flex-1 p-4 text-white bg-[#383E42]">
        <h2>Crear Cintillos</h2>
        <p class="pt-2 text-xs">La posibilidad de crear hasta 448 etiquetas.</p>
        <router-link to="crear-cintillos" class="absolute bottom-0 right-0 p-4">
          Comenzar <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </router-link>
      </div>
    </div>

    <div
      class="flex items-stretch justify-between border-b border-black border-solid"
    >
      <div class="relative bg-black">
        <img
          src="../../public/afiches.jpg"
          class="w-[100px] h-[125px] object-cover"
        />
        <div class="absolute top-0 left-0 w-full h-full b"></div>
      </div>

      <div class="relative flex-1 p-4 text-white bg-[#383E42]">
        <h2>Crear Rotulos</h2>
        <p class="pt-2 text-xs">La posibilidad de crear hasta 200 rotulos.</p>
        <router-link
          to="/afiches-seleccion"
          class="absolute bottom-0 right-0 p-4"
          >Comenzar <font-awesome-icon :icon="['fas', 'arrow-right']"
        /></router-link>
      </div>
    </div>

    <div
      class="flex items-stretch justify-between border-b border-black border-solid"
    >
      <div class="relative bg-black">
        <img
          src="../../public/buscador.jpg"
          class="w-[100px] h-[125px] object-cover"
        />
        <div class="absolute top-0 left-0 w-full h-full b"></div>
      </div>

      <div class="relative flex-1 p-4 text-white bg-[#383E42]">
        <h2>Buscar Internos</h2>
        <p class="pt-2 text-xs">
          Escanea o digita la descripcion, ideal para sacar el correlativo.
        </p>
        <router-link to="/buscador" class="absolute bottom-0 right-0 p-4"
          >Comenzar <font-awesome-icon :icon="['fas', 'arrow-right']"
        /></router-link>
      </div>
    </div>
  </div>

  <div class="p-4 bg-gray-200">
    Si deseas que el correo de tu sala sea agregado a la aplicación, puedes
    compartirlo a nuestro correo para que lo agregamos.<br />
    Comparte el correo y el nombre de la sala de ventas.<br />
    <a
      href="mailto: multimarcasapp@outlook.com?subject=COMPARTO CORREO"
      class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg"
      ><font-awesome-icon :icon="['fas', 'paper-plane']" class="mr-2" />
      Enviarnos mensaje</a
    >

  --></div>
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
</style>
