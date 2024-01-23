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
  userNoPhoto,
  userStat,
  userUpdateToken,
  postCreate,
  postList,
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
          <div class="text-sm font-light">Suscripcion Premium<br>
          <span class="text-xs text-gray-400">(Duracion por 30 dias)</span></div>
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
    <form class="p-4" @submit.prevent="crearPublicacion">
      <h3 class="pb-4 font-medium">PUBLICACIONES</h3>
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
          class="h-9 w-[120px] bg-[#4A4878] text-sm text-white rounded-lg transition-all cursor-pointer hover:bg-blue-600"
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
          <div class="flex-1">
            <div class="font-medium text-black align-middle">
              {{ post.username }}
              <span v-if="post.username === 'Multimarcas'"
                ><img
                  src="../../public/checklist.png"
                  class="inline-block w-[15px]"
              /></span>
            </div>
            <div class="text-xs text-gray-400">
              {{ dayjs(post.fecha).fromNow() }}
            </div>
          </div>

          <button
            @click="eliminarPost(`${post.post_uuid}`)"
            v-if="post.user_uuid === user_uuid || rol === 'Admin'"
            class="text-xs text-gray-700"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
        </div>

        <div class="p-4 pt-0">
          {{ post.post }}
          <div v-if="post.archivo !== null" class="pt-2">
            <img :src="post.archivo" class="block w-full" />
          </div>
        </div>
        <div
          class="px-4 py-2 border-t border-dashed border-[#ddd] flex items-center justify-between"
        >
          <button
            class="text-sm text-light"
            :class="{
              'text-gray-600': !likes.find(
                (like) =>
                  like.post_uuid === post.post_uuid &&
                  like.user_uuid === user_uuid
              ),
              'text-[#3498db]': likes.find(
                (like) =>
                  like.post_uuid === post.post_uuid &&
                  like.user_uuid === user_uuid
              ),
            }"
            @click="darlike(post.post_uuid)"
            :disabled="
              likes.find(
                (like) =>
                  like.post_uuid === post.post_uuid &&
                  like.user_uuid === user_uuid
              )
            "
          >
            <font-awesome-icon :icon="['fas', 'thumbs-up']" />
          </button>

          <div>
            <router-link
              :to="`/publicacion/${post.post_uuid}`"
              class="mr-2 text-sm text-gray-600 underline text-light"
              >{{ post.num_comments }} Comentar</router-link
            >
            <span class="text-sm text-gray-600 text-light"
              >{{ post.num_likes }} Me gusta</span
            >
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
