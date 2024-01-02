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

calcularDiferencia();

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
    audioPlayer.play()
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
</script>
<template>
  <div>
    <div class="flex p-4 text-white bg-red-400"><font-awesome-icon :icon="['fas', 'bell']" class="mr-2 text-sm"/><div class="text-sm font-light text-white" id="cuentaRegresiva"></div></div>
    <audio class="hidden" id="audioPlayer">
      <source src="../../public/tap-like.mp3" type="audio/mp3" />
      Tu navegador no soporta el elemento de audio.
    </audio>
    <div
      class="flex items-stretch w-full gap-1 p-4 overflow-x-auto bg-gray-100 whitespace-nowrap acciones border-b border-solid border-[#ddd]"
    >
      <router-link
        to="/buscador"
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/dairy-products.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Buscar Internos</span>
      </router-link>

      <router-link
        to="crear-cintillos"
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/price-tag.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Crear Cintillos</span>
      </router-link>

      <router-link
        to="/crear-afiches"
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/rotulo-uno.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Crear Afiches</span>
      </router-link>

      <router-link
        to="/crear-afiches-mini"
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/rotulo-dos.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Crear Afiches</span>
      </router-link>

      <router-link
        to="/crear-afiches-baja-mini"
        class="py-3 rounded-lg border border-solid border-[#e4e3e3] b bg-[#383E42]"
      >
        <div class="flex justify-center px-2 py-4">
          <img src="../../public/precio_bajo.png" class="block w-[40px]" />
        </div>
        <span class="p-2 pt-0 text-xs text-white">Crear Afiches</span>
      </router-link>
    </div>

    <form class="p-4" @submit.prevent="crearPublicacion">
      <h3 class="pb-4 font-medium">
        PUBLICACIONES
      </h3>
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

          <span class="text-sm text-gray-600 text-light"
            >{{ post.num_likes }} Me gusta</span
          >
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
</style>
