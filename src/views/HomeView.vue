<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useGetRoutes } from "@/composables/getRoutes";

const router = useRouter();
const { userStat, userNoPhoto, userMvc, userUpdateToken } = useGetRoutes();

const token = ref(localStorage.getItem("token"));
const user_uuid = ref(localStorage.getItem("user_uuid"));
const username = ref(localStorage.getItem("usuario"));
const photo = ref(localStorage.getItem("photo"));
const email = ref(localStorage.getItem("email"));

const estadistica = ref([]);

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
</script>
<template>
  <div>
    <div class="p-4 text-white bg-red-400"><img src="../../public/sled.gif" class="w-[30px] h-[30px] rounded-full align-middle inline-block mr-2 text-sm">Debido a la baja de usuarios y el coste de recursos en servidores, el mes de diciembre nuesta app estara fuera de servicio, reanudando actividades hasta enero 2024</div>
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
          <b class="text-sm uppercase">Cintillos creados:</b>
          {{ estadistica["totalCintillosGenerados"] }}
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
  </div>
</template>

<style>
.b {
  background: rgb(56, 62, 66);
  background: linear-gradient(
    90deg,
    rgba(56, 62, 66, 0.5) 0%,
    rgba(56, 62, 66, 1) 100%
  );
}
</style>
