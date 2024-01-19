<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { RouterLink, RouterView } from "vue-router";
import Footer from "@/components/Footer.vue";
import { useGetRoutes } from "@/composables/getRoutes";
import axios from "axios";

const token = ref(localStorage.getItem("token"));
const photo = ref(localStorage.getItem("photo"));
const username = ref(localStorage.getItem("usuario"));
const estadistica = ref(null);
const route = useRoute();
const router = useRouter();
const { userNoPhoto, userStat, canjearCupon } = useGetRoutes();

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
const buttonText = computed(() => {
  if (route.path === "/register") return "Inicio";
  if (route.path === "/login") return "Crear Cuenta";
  return "Inicio"; // valor predeterminado, por si acaso
});
const buttonRoute = computed(() => {
  if (route.path === "/register") return "/login";
  if (route.path === "/login") return "/register";
  return "/"; // ruta por defecto
});

const options = ref("top-[-100%] right-[-100%]");

const optionShow = () => {
  options.value = "top-0 right-0";
};
const optionHidden = () => {
  options.value = "top-[-100%] right-[-100%]";
};
const cerarrSesion = () => {
  localStorage.clear();
  router.push("/login");
};
const codigo = ref("");
const codigoLength = computed(() => codigo.value.length);

const classCupon = ref("hidden");
const closeCupon = () => {
  classCupon.value = "hidden";
};
const openCupon = () => {
  classCupon.value = "flex";
};

const canjeCupon = async () => {
  const param = {
    cupon: codigo.value,
  };
  const headers = {
    Authorization: "Bearer " + token.value,
    "Content-Type": "application/json",
  };
  const { data } = await axios.post(canjearCupon, param, { headers });
  alert(data.message);
  console.log(data);
};
</script>

<template>
  <div
    class="fixed z-50 flex items-start justify-end w-full h-full transition-all bg-transparent"
    :class="`${options}`"
    @click="optionHidden"
  >
    <div class="inline-block bg-gray-200" v-if="estadistica">
      <div class="p-4 border-b border-solid border-[#ddd] flex items-center">
        <div>
          <div v-if="photo !== null">
            <img
              :src="photo"
              :alt="username"
              class="w-[25px] rounded-full shadow align-middle"
            />
          </div>

          <div v-else>
            <img
              :src="userNoPhoto"
              :alt="username"
              class="w-[25px] rounded-full align-middle"
            />
          </div>
        </div>
        <div
          class="flex items-center pl-1 text-sm font-medium text-black"
          v-if="estadistica"
        >
          {{ username
          }}<span v-if="estadistica.profile[0].suscripcion === 1"
            ><img src="../public/vip.gif" alt="vip"
          /></span>
        </div>
      </div>
      <div class="px-4 py-2 text-xs text-gray-500">
        Tipo de cuenta:
        <b
          class="text-xs text-green-500"
          v-if="estadistica.profile[0].suscripcion === 1"
          >Premium</b
        ><b class="text-xs text-amber-500" v-else>Basica</b>
      </div>
      <button
        class="p-4 text-sm border-t border-solid border-[#ddd] text-gray-800 w-full block"
        @click.prevent="openCupon"
        v-if="estadistica.profile[0].rol === 'Admin'"
      >
        <font-awesome-icon :icon="['fas', 'gift']" /> Generar cupon
      </button>
      <button
        class="p-4 text-sm border-t border-solid border-[#ddd] text-gray-800 w-full block"
        @click.prevent="openCupon"
      >
        <font-awesome-icon :icon="['fas', 'gift']" /> Canjear cupon
      </button>
      <button
        class="p-4 text-sm border-t border-solid border-[#ddd] text-gray-800 w-full block"
        @click.prevent="cerarrSesion"
      >
        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" /> Cerrar
        sesion
      </button>
    </div>
  </div>
  <div
    class="fixed z-50 items-center justify-center w-full h-full bg-black/25"
    :class="`${classCupon}`"
  >
    <div class="bg-white w-[90%]">
      <h2
        class="flex items-center justify-between p-4 text-sm font-medium text-black uppercase"
      >
        <span
          ><font-awesome-icon :icon="['fas', 'gift']" /> Reclamar cupon</span
        >
        <button @click.prevent="closeCupon">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </h2>
      <form class="w-full p-4 pt-0" @submit.prevent="canjeCupon">
        <div
          class="flex items-center justify-between border border-solid border-[#dd]"
        >
          <div class="px-4 py-3 text-sm text-gray-600">
            <font-awesome-icon :icon="['fas', 'ticket']" />
          </div>
          <input
            type="text"
            maxlength="8"
            placeholder="Ingresa el codigo"
            class="block w-full px-0 py-3 text-sm outline-none"
            v-model="codigo"
          />
          <div class="px-4 py-3 text-sm text-gray-400">
            {{ codigoLength }}/8
          </div>
        </div>
        <input
          type="submit"
          class="w-full h-9 mt-4 bg-[#4A4878] text-sm text-white rounded transition-all cursor-pointer"
          value="Canjear cupon"
        />
      </form>
    </div>
  </div>
  <header
    class="sticky top-0 flex items-center justify-between px-4 py-6 bg-[#4844AB] text-[#ECF0F1] z-30"
  >
    <router-link to="/" class="font-medium text-[#ECF0F1] logo"
      >MULTIMARCAS APP</router-link
    >
    <nav v-if="token !== null">
      <button class="mr-2" active-class="underline" @click.prevent="optionShow">
        <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
      </button>
    </nav>
    <nav v-else>
      <router-link
        :to="buttonRoute"
        class="p-2 rounded-md bg-[#5F7ADB] hover:bg-[#3f539c] transition-all"
        >{{ buttonText }}</router-link
      >
    </nav>
  </header>

  <RouterView />
  <Footer></Footer>
  <div class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full text-lg text-white bg-zinc-950">
   <div class="p-6 font-medium"><img src="../public/sled.gif" class="w-[30px] h-[30px] rounded-full align-middle inline-block mr-2 text-sm z-50"> App en mantenimiento<br>
  <div class="text-sm">Lamentamos las interrupciones, en breves reactivaremos el servicio.</div></div> 
  
 </div>
</template>
