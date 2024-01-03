<script setup>
import { useGetRoutes } from "@/composables/getRoutes";
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("es");
dayjs.extend(relativeTime);
const route = useRoute();

const {
  userNoPhoto,
  selectPost,
  likeList,
  likePost,
  postRemove,
  commentCreate,
  commentList,
} = useGetRoutes();

const token = ref(localStorage.getItem("token"));
const user_uuid = ref(localStorage.getItem("user_uuid"));
const rol = ref(localStorage.getItem("rol"));
const comentario = ref("");
const comments = ref([]);
const post = ref();
const likes = ref([]);
const enviando = ref(false);

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

const getComments = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    let { data } = await axios.get(`${commentList}${route.params.post_uuid}`, {
      headers,
    });
    console.log(data);
    comments.value = data;
  } catch (error) {
    console.log(error);
  }
};

const getPost = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.get(`${selectPost}${route.params.post_uuid}`, {
      headers,
    });
    post.value = data[0];
  } catch (error) {
    console.log(error);
  } finally {
    getLikes();
    getComments();
  }
};

getPost();

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
    if (data.status === "OK") getPost();
  } catch (error) {
    console.log(error);
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

const crearComentario = async () => {
  try {
    enviando.value = true;
    const param = {
      message: comentario.value,
      post_uuid: route.params.post_uuid,
    };
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(commentCreate, param, { headers });
    if (data.status === "OK") {
      getPost();
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
    comentario.value = "";
    enviando.value = false;
  }
};
</script>
<template>
  <audio class="hidden" id="audioPlayer">
    <source src="../../public/tap-like.mp3" type="audio/mp3" />
    Tu navegador no soporta el elemento de audio.
  </audio>
  <div class="p-4 bg-white" v-if="post">
    <div class="border border-solid border-[#ddd] mb-3">
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
          <span class="mr-2 text-sm text-gray-600 text-light"
            >{{ post.num_comments }} Comentarios</span
          >
          <span class="text-sm text-gray-600 text-light"
            >{{ post.num_likes }} Me gusta</span
          >
        </div>
      </div>
    </div>
  </div>

  <form class="p-4 pt-0" @submit.prevent="crearComentario">
    <h3 class="pb-4 font-medium">COMENTARIOS</h3>
    <div class="flex items-start justify-between gap-x-4">
      <textarea
        class="flex-1 w-full h-10 px-3 py-1 text-sm border border-[#ddd] rounded-lg outline-none resize-none placeholder:text-sm"
        placeholder="Escribe un comentario.."
        maxlength="2000"
        v-model="comentario"
      ></textarea>
      <input
        type="submit"
        class="px-6 py-2 text-sm text-white transition-all rounded-lg cursor-pointer bg-amber-500 hover:bg-blue-600"
        value="Comentar"
      />
    </div>
  </form>
  <div
    class="p-4 bg-gray-100 border-b border-solid border-[#ddd]"
    v-if="comments"
    v-for="comment in comments"
    :key="comment.id"
  >
    <div class="flex items-center p-4 pt-0">
      <div class="mr-2">
        <div v-if="comment.photo !== null">
          <img
            :src="comment.photo"
            :alt="comment.username"
            class="w-[25px] rounded shadow"
          />
        </div>
        <div v-else>
          <img :src="userNoPhoto" :alt="comment.username" class="w-[25px]" />
        </div>
      </div>
      <div class="flex-1">
        <div class="text-sm font-medium text-black align-middle">
          {{ comment.username }}
          <span v-if="comment.username === 'Multimarcas'"
            ><img
              src="../../public/checklist.png"
              class="inline-block w-[15px]"
          /></span>
        </div>
        <div class="text-xs text-gray-400">
          {{ dayjs(comment.fecha).fromNow() }}
        </div>
      </div>
    </div>

    <div class="p-4 py-0">
      {{ comment.post }}
      <div v-if="comment.archivo !== null" class="pt-2">
        <img :src="comment.archivo" class="block w-full" />
      </div>
    </div>
  </div>
  <div
    class="fixed w-full h-full flex items-center justify-center text-white bg-[#263238] p-4 text-xl top-0 left-0 z-50"
    v-if="enviando"
  >
    <font-awesome-icon :icon="['fas', 'spinner']" class="fa-pulse" />
    Comentando...
  </div>
</template>
