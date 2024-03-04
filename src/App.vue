<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { RouterLink, RouterView } from "vue-router";
import Footer from "@/components/Footer.vue";
import { useGetRoutes } from "@/composables/getRoutes";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("es");
dayjs.extend(relativeTime);

const token = ref(localStorage.getItem("token"));
const estadistica = ref(null);
const loading = ref("hidden");
const vipModal = ref("hidden");
const route = useRoute();
const router = useRouter();
const message = ref("");
const nCupon = ref("");
const nUsos = ref("");
const { userNoPhoto, userStat, canjearCupon, generarCupon, crearCupon } =
  useGetRoutes();

const redireccionar = (url) => {
  window.location.href = url;
};
const obtenerEstadisticas = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.get(userStat, { headers });
    estadistica.value = data;
    console.log(data);
  } catch (error) {
    const messageError = JSON.parse(error.request.response);
    if (messageError.status === "invalid") {
      localStorage.clear();
      redireccionar("/login");
    }
  }
};
if (token.value !== null) obtenerEstadisticas();
const buttonText = computed(() => {
  if (route.path === "/register") return "Inicio";
  if (route.path === "/login") return "Crear Cuenta";
});
const buttonRoute = computed(() => {
  if (route.path === "/register") return "/login";
  if (route.path === "/login") return "/register";
});

const options = ref("top-0 left-[-100%]");

const optionShow = () => {
  options.value = "top-0 left-0";
};
const optionHidden = () => {
  options.value = "left-[-100%]";
};
const cerarrSesion = () => {
  localStorage.clear();
  redireccionar("/login");
};
const codigo = ref("");
const codigoLength = computed(() => codigo.value.length);

const classCupon = ref("hidden");
const classCrearCupon = ref("hidden");
const closeCupon = () => {
  classCupon.value = "hidden";
};
const openCupon = () => {
  classCupon.value = "flex";
};
const openCrearCupon = () => {
  classCrearCupon.value = "flex";
};
const closeCrearCupon = () => {
  classCrearCupon.value = "hidden";
};

const canjeCupon = async () => {
  try {
    loading.value = "flex";
    const param = {
      cupon: codigo.value,
    };
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(canjearCupon, param, { headers });
    message.value = data;
    if (data.status === "OK") vipModal.value = "block";
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = "hidden";
  }
};

const genCupon = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.get(generarCupon, { headers });
    nCupon.value = data.cupon;
  } catch (error) {
    console.error(error);
  }
};

const agregarCupon = async () => {
  try {
    const param = {
      cupon: nCupon.value,
      limite_cupon: nUsos.value,
    };
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };

    const { data } = await axios.post(crearCupon, param, { headers });
    alert(data.message);
  } catch (error) {
    console.log(error);
  }
};
const countdownValue = computed(() => {
  // Obtenemos la fecha de fin de suscripción y la fecha actual
  const finSuscripcionStr = estadistica.value.profile[0].fin_suscripcion;
  // Ajustamos la fecha de fin de suscripción al final del día en la zona horaria local
  const finSuscripcionDate = new Date(finSuscripcionStr + "T23:59:59");

  const currentDate = new Date();

  // Calculamos la diferencia en milisegundos
  const diferencia = finSuscripcionDate - currentDate;

  // Convertimos la diferencia a segundos, minutos y horas
  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  // Ajustamos las horas y minutos para reflejar la diferencia dentro del mismo día
  const horasRestantes = horas % 24;
  const minutosRestantes = minutos % 60;

  return `${dias}d, ${horasRestantes}h, ${minutosRestantes}m`;
});
onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://pagos.wompi.sv/js/wompi.pagos.js";
  document.head.appendChild(script);
});
</script>

<template>
  <div
    class="fixed z-50 flex items-start justify-start w-full h-full transition-all bg-transparent"
    :class="`${options}`"
    @click="optionHidden"
  >
    <div class="inline-block bg-gray-200 shadow-2xl shadow-black/50" v-if="estadistica">
      <div class="p-4 border-b border-solid border-[#ddd] flex items-center">
        <div>
          <div>
            <img
              :src="
                estadistica.profile[0].photo !== null
                  ? estadistica.profile[0].photo
                  : userNoPhoto
              "
              :alt="
                estadistica.profile[0].username === null
                  ? estadistica.profile[0].nombre
                  : estadistica.profile[0].username
              "
              class="w-[25px] rounded-full shadow align-middle"
            />
          </div>
        </div>
        <div
          class="flex items-center pl-1 text-sm font-medium text-black"
          v-if="estadistica"
        >
          {{
            estadistica.profile[0].username === null
              ? estadistica.profile[0].nombre +
                " " +
                estadistica.profile[0].apellido
              : estadistica.profile[0].username
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
      <div
        class="px-4 py-2 text-xs text-gray-500 border-t border-solid border-[#ddd]"
        v-if="estadistica.profile[0].suscripcion === 1"
      >
        Vence en:
        <b class="text-xs font-light text-amber-500" id="vence">{{
          countdownValue
        }}</b>
      </div>
      <button
        class="p-4 text-sm border-t border-solid border-[#ddd] text-gray-800 w-full block"
        @click.prevent="openCrearCupon"
        v-if="estadistica.profile[0].rol === 'Admin'"
      >
        <font-awesome-icon :icon="['fas', 'gift']" /> Generar cupon
      </button>
      <button
        class="p-4 text-sm border-t border-solid border-[#ddd] text-gray-800 w-full block"
        @click.prevent="openCupon"
        v-if="estadistica.profile[0].suscripcion === 0"
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
    <div class="bg-white w-[90%] relative">
      <div
        class="absolute top-0 left-0 items-center justify-center w-full h-full text-white transition-all bg-white"
        :class="`${vipModal}`"
      >
        <div class="p-4 bg-white">
          <img src="../public/canje_vip.gif" class="w-[100px] m-auto" />
          <p class="py-4 text-sm text-gray-950">
            !En hora buena! tu cuenta ahora es vip
          </p>
          <button
            to="/login"
            class="mb-4 flex justify-center items-center text-center w-full h-9 bg-[#4A4878] text-sm text-white rounded transition-all cursor-pointer"
            @click.prevent="redireccionar('/')"
          >
            Continuar navegando
          </button>
        </div>
      </div>
      <div
        class="absolute w-full h-full bg-[#4844AB] text-white flex items-center justify-center transition-all"
        :class="`${loading}`"
      >
        <font-awesome-icon :icon="['fas', 'gear']" spin spin-reverse />
        Validando codigo...
      </div>
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
          class="px-4 py-3 text-sm text-red-500"
          v-if="message.status === 'error'"
        >
          {{ message.message }}
        </div>
        <div
          class="flex items-center justify-between border border-solid border-[#dd]"
        >
          <div class="px-4 py-3 text-sm text-gray-600">
            <font-awesome-icon :icon="['fas', 'ticket']" />
          </div>
          <input
            type="text"
            maxlength="8"
            inputmode="numeric"
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

  <div
    class="fixed z-50 items-center justify-center w-full h-full bg-black/25"
    :class="`${classCrearCupon}`"
  >
    <div class="bg-white w-[90%] relative">
      <div
        class="absolute w-full h-full bg-[#4844AB] text-white flex items-center justify-center transition-all"
        :class="`${loading}`"
      >
        <font-awesome-icon :icon="['fas', 'gear']" spin spin-reverse />
        Agregando cupon...
      </div>
      <h2
        class="flex items-center justify-between p-4 text-sm font-medium text-black uppercase"
      >
        <span><font-awesome-icon :icon="['fas', 'gift']" /> Craer cupones</span>
        <button @click.prevent="closeCrearCupon">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </h2>
      <form class="w-full p-4 pt-0" @submit.prevent="agregarCupon">
        <div
          class="px-4 py-3 text-sm text-red-500"
          v-if="message.status === 'error'"
        >
          {{ message.message }}
        </div>
        <div
          class="flex items-center justify-between border border-solid border-[#dd] mb-4"
        >
          <div class="px-4 py-3 text-sm text-gray-600">
            <font-awesome-icon :icon="['fas', 'ticket']" />
          </div>
          <input
            type="text"
            maxlength="8"
            placeholder="Ingresa el codigo"
            class="block w-full px-0 py-3 text-sm outline-none"
            v-model="nCupon"
          />
          <button
            class="px-4 py-3 text-sm text-gray-400"
            @click.prevent="genCupon"
          >
            <font-awesome-icon :icon="['fas', 'arrows-rotate']" />
          </button>
        </div>

        <div
          class="flex items-center justify-between border border-solid border-[#dd]"
        >
          <div class="px-4 py-3 text-sm text-gray-600">
            <font-awesome-icon :icon="['fas', 'hashtag']" />
          </div>
          <input
            type="text"
            maxlength="8"
            placeholder="Numero de usos"
            class="block w-full px-0 py-3 text-sm outline-none"
            v-model="nUsos"
          />
        </div>
        <input
          type="submit"
          class="w-full h-9 mt-4 bg-[#4A4878] text-sm text-white rounded transition-all cursor-pointer"
          value="Agregar cupon"
        />
      </form>
    </div>
  </div>
  <div
    class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-black/80"
    v-if="
      token &&
      estadistica.profile[0].suscripcion === 0 &&
      estadistica.profile[0].fin_suscripcion !== null
    "
  >
    <div
      class="bg-white w-[80%] py-6 px-4 max-w-screen-sm rounded-lg shadow-2xl"
    >
      <img src="../public/sad.png" class="w-[30%] block m-auto" />
      <h3 class="pt-4 font-medium text-center text-black uppercase text-nomal">
        Tu membresia ha vencido!
      </h3>
      <p class="py-4 text-sm text-center text-gray-500" v-if="estadistica">
        Vencio el
        {{
          dayjs(estadistica.profile[0].fin_suscripcion)
            .locale("es")
            .format("DD [de] MMMM [del] YYYY")
        }}<br />
        <span class="text-xs">
          Puedes renovarla haciendo el pago en linea o escribiendo a atencion al
          cliente.</span
        >
      </p>
      <div class="py-4 border-y border-dashed border-[#ddd]">
        <button
          class="block px-6 py-2 mx-auto mb-4 text-sm text-center border border-solid rounded-sm shadow-lg border-neutral-700"
          @click.prevent="openCupon"
        >
          Canjear cupon
        </button>

        <div class="flex items-center justify-center">
          <div
            class="wompi_button_widget"
            data-url-pago="https://lk.wompi.sv/ixtR"
          ></div>
        </div>
      </div>
      <a
        href="https://wa.me/+50374329014"
        class="block p-4 font-semibold text-center text-sky-500"
        ><font-awesome-icon :icon="['fas', 'headset']" /> Atencion al cliente</a
      >
    </div>
  </div>
  <header
    v-if="token !== null"
    class="sticky top-0 flex items-center justify-between px-4 py-5 bgheader text-[#ECF0F1] z-30 shadow-lg shadow-black/10"
  >
    <router-link
      to="/"
      class="text-[#ECF0F1] font-medium"
      style="font-family: Fjalla One"
      >MULTIMARCAS APP</router-link
    >
    <nav class="flex gap-2">
      <button class="relative hidden text-white">
        <div class="absolute right-[-10px] top-0 inline-flex items-center justify-center bg-rose-500 text-white text-xs font-extralight rounded-full no-underline w-[14px] h-[14px]">1</div>
        <font-awesome-icon :icon="['fas', 'bell']" />
      </button>
      <button
        class="pl-4 pr-2"
        active-class="underline"
        @click.prevent="optionShow"
      >
      <font-awesome-icon :icon="['fas', 'bars']" />
      </button>
    </nav>
  </header>

  <RouterView />
  <Footer></Footer>
</template>
<style>
.bgheader {
  background: linear-gradient(
    60deg,
    rgba(84, 58, 183, 1) 0%,
    rgba(0, 172, 193, 1) 100%
  );
}
</style>
