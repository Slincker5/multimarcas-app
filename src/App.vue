<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { v4 as uuidv4 } from 'uuid';
import { RouterLink, RouterView } from "vue-router";
import { storeToRefs } from "pinia";
import { useNavBar } from "@/store/menu";
import Instalar from "@/components/Instalar.vue";
import Footer from "@/components/Footer.vue";
import MenuPrincipal from "@/components/menu/MenuPrincipal.vue";
import NavbarPrincipal from "@/components/menu/NavbarPrincipal.vue";
import CanjearCupon from "@/components/menu/CanjearCupon.vue";
import FinSuscripcion from "@/components/menu/FinSuscripcion.vue";
import CuentaCompartida from "@/components/menu/CuentaCompartida.vue";
import EditProfile from "@/components/home/EditProfile.vue";
import EditInfoProfile from "@/components/home/EditInfoProfile.vue";
import CrearCupon from "@/components/menu/CrearCupon.vue";
import { useNavBarMain } from "@/composables/navBarMain";
import { useEditProfile } from "@/composables/editProfile";
import CargarFoto from "@/components/menu/CargarFoto.vue";
import { useGetRoutes } from "@/composables/getRoutes";
import { useFooterStore } from "@/store/useFooterStore";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("es");
dayjs.extend(relativeTime);

const useNavBarStore = useNavBar();
const { getUserData } = useNavBarStore;
const { userData } = storeToRefs(useNavBarStore);

const {
  options,
  openMenu,
  closeMenu,
  logout,
  loading,
  vipModal,
  message,
  codigo,
  codigoLength,
  canjeCupon,
  token,
  classCupon,
  classCrearCupon,
  closeCupon,
  openCupon,
  openCrearCupon,
  closeCrearCupon,
  genCupon,
  agregarCupon,
  nCupon,
  nUsos,
} = useNavBarMain();
const { nombre, apellido, telefono, editarPerfil, guardando } = useEditProfile()

const { userNoPhoto, userStat, canjearCupon, generarCupon, crearCupon, verifyStaticToken } =
  useGetRoutes();
const footerStore = useFooterStore();
const { isFooterVisible } = storeToRefs(footerStore);
const { showFooter, hideFooter } = footerStore;
const route = useRoute();
const modal = ref(false)

const sendTokenDevice = async (tokenDevice) => {
  try {
    const dataCintillo = {
      staticTokenFcm: tokenDevice,
    };
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };

    let { data } = await axios.post(verifyStaticToken, dataCintillo, { headers });
    if (data.status === "error") {
      console.log(data)
    } else {
      console.log(data)
    }
  } catch (error) {
    console.log(error);
  }
};
let tokenDevice = localStorage.getItem('tokenDevice')
const getTokenDevice = () => {
  if (!tokenDevice) {
    localStorage.setItem('tokenDevice', uuidv4())
    tokenDevice = localStorage.getItem('tokenDevice')
  }
  console.log(token.value)
  sendTokenDevice(tokenDevice)
}

getTokenDevice()

const abrirModal = () => {
  modal.value = true
}
const cerrarModal = () => {
  modal.value = false
}
watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/" || newPath === "/crear-cintillos" || newPath === '/login' || newPath === '/crear-enlace' || newPath === '/create-notification') {
      hideFooter();
    } else {
      showFooter();
    }
  },
  { immediate: true }
);

if (token.value !== null) getUserData(userStat);

const offline = ref(null)
window.addEventListener("offline", (e) => {
  offline.value = true
});

window.addEventListener("online", (e) => {
  offline.value = false
});


// funciones para editar perfil

const modalProfile = ref(false)

const modalEditProfileInfo = ref(false)

const atrasPerfil = () => {
  modalProfile.value = false
}

const abrirEditarPerfil = () => {
  modalProfile.value = true
}

const backEditProfileInfo = () => {
  modalEditProfileInfo.value = false
}

const openEditProfileInfo = () => {
  modalEditProfileInfo.value = true
}


</script>

<template>
  <Instalar></Instalar>
  <div
    class="grid h-screen overflow-y-scroll bg-white grid-rows-auto-1fr-auto grid-cols-auto-1fr contenedor-sin-scrollbar">

    <MenuPrincipal v-if="userData" :token="token" :userNoPhoto="userNoPhoto" :userData="userData" @abrirEditarPerfil="abrirEditarPerfil" @openMenu="openMenu"
      style="grid-column-start: 2; grid-column-end: 3; grid-row-start: 1"></MenuPrincipal>
    <NavbarPrincipal v-if="userData" :userNoPhoto="userNoPhoto" :options="options" :userData="userData" :finallySub="dayjs(userData.profile[0].fin_suscripcion).format('D [de] MMMM')
      " @openCupon="openCupon" @openCrearCupon="openCrearCupon" @closeMenu="closeMenu" @cambiarFoto="abrirModal"
      @logout="logout" style="
        grid-row-start: 1;
        grid-row-end: 4;
        grid-column-start: 1;
        grid-column-end: 2;
      "></NavbarPrincipal>
    <RouterView style="grid-column-start: 2; grid-column-end: 3; grid-row-start: 2" />
    <Footer v-if="isFooterVisible" style="grid-row-start: 3; grid-column-start: 2; grid-column-end: 3"></Footer>
  </div>

  <!-- funciones fuera del layout -->
  <CrearCupon :classCrearCupon="classCrearCupon" :loading="loading" :message="message" :urlGenCupon="generarCupon"
    :urlAgregarCupon="crearCupon" v-model:nCupon="nCupon" v-model:nUsos="nUsos" @closeCrearCupon="closeCrearCupon"
    @genCupon="genCupon" @agregarCupon="agregarCupon">
  </CrearCupon>
  <CanjearCupon :classCupon="classCupon" :vipModal="vipModal" :loading="loading" :message="message"
    :codigoLength="codigoLength" :url="canjearCupon" v-model:codigo="codigo" @closeCupon="closeCupon"
    @canjeCupon="canjeCupon"></CanjearCupon>

  <FinSuscripcion v-if="
    userData &&
    token &&
    userData.profile[0].suscripcion === 0 &&
    userData.profile[0].fin_suscripcion !== null
  " :userData="userData" :vencio="dayjs(userData.profile[0].fin_suscripcion)
    .locale('es')
    .format('DD [de] MMMM [del] YYYY')
    " @openCupon="openCupon"></FinSuscripcion>
  <CuentaCompartida v-if="userData && token" :userData="userData" :tokenDevice="tokenDevice"
    @logout="logout"></CuentaCompartida>
  <CargarFoto v-if="userData" :modal="modal" @cerrarModal="cerrarModal"></CargarFoto>
  <EditInfoProfile v-if="userData" :userData="userData" :modalEditProfileInfo="modalEditProfileInfo" :guardando="guardando" v-model:nombre="nombre" v-model:apellido="apellido" v-model:telefono="telefono" @editarPerfil="editarPerfil" @backEditProfileInfo="backEditProfileInfo"></EditInfoProfile>
  <EditProfile  :modalProfile="modalProfile" @atrasPerfil="atrasPerfil" @cambiarFoto="abrirModal" @openEditProfileInfo="openEditProfileInfo"></EditProfile>
  <Transition>
    <div class="sticky bottom-0 p-4 font-medium text-white bg-red-500" v-if="offline"><font-awesome-icon
        :icon="['fas', 'wifi']" /> Sin conexion a internet</div>
  </Transition>
</template>
<style>
.bgheader {
  background: linear-gradient(60deg,
      rgba(84, 58, 183, 1) 0%,
      rgba(0, 172, 193, 1) 100%);
}

.migrilla {
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
}

.contenedor-sin-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
