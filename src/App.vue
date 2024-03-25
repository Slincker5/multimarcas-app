<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { RouterLink, RouterView } from "vue-router";
import { storeToRefs } from "pinia";
import { useNavBar } from "@/store/menu";
import Footer from "@/components/Footer.vue";
import MenuPrincipal from "@/components/menu/MenuPrincipal.vue";
import NavbarPrincipal from "@/components/menu/NavbarPrincipal.vue";
import CanjearCupon from "@/components/menu/CanjearCupon.vue";
import FinSuscripcion from "@/components/menu/FinSuscripcion.vue";
import CrearCupon from "@/components/menu/CrearCupon.vue";
import { useNavBarMain } from "@/composables/navBarMain";
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
const { userNoPhoto, userStat, canjearCupon, generarCupon, crearCupon } =
  useGetRoutes();
const footerStore = useFooterStore();
const { isFooterVisible } = storeToRefs(footerStore);
const { showFooter, hideFooter } = footerStore;
const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/" || newPath === "/crear-cintillos" || newPath === '/login' || newPath === '/crear-enlace') {
      hideFooter();
    } else {
      showFooter();
    }
  },
  { immediate: true }
);

if (token.value !== null) getUserData(userStat);
</script>

<template>
  <div
    class="grid h-screen overflow-y-scroll bg-white grid-rows-auto-1fr-auto grid-cols-auto-1fr contenedor-sin-scrollbar"
  >
    <MenuPrincipal
      :token="token"
      @openMenu="openMenu"
      style="grid-column-start: 2; grid-column-end: 3; grid-row-start: 1"
    ></MenuPrincipal>
    <NavbarPrincipal
      v-if="userData"
      :userNoPhoto="userNoPhoto"
      :options="options"
      :userData="userData"
      :finallySub="
        dayjs(userData.profile[0].fin_suscripcion).format('D [de] MMMM')
      "
      @openCupon="openCupon"
      @openCrearCupon="openCrearCupon"
      @closeMenu="closeMenu"
      @logout="logout"
      style="
        grid-row-start: 1;
        grid-row-end: 4;
        grid-column-start: 1;
        grid-column-end: 2;
      "
    ></NavbarPrincipal>
    <RouterView
      style="grid-column-start: 2; grid-column-end: 3; grid-row-start: 2"
    />
    <Footer
      v-if="isFooterVisible"
      style="grid-row-start: 3; grid-column-start: 2; grid-column-end: 3"
    ></Footer>
  </div>

  <!-- funciones fuera del layout -->
  <CrearCupon
    :classCrearCupon="classCrearCupon"
    :loading="loading"
    :message="message"
    :urlGenCupon="generarCupon"
    :urlAgregarCupon="crearCupon"
    v-model:nCupon="nCupon"
    v-model:nUsos="nUsos"
    @closeCrearCupon="closeCrearCupon"
    @genCupon="genCupon"
    @agregarCupon="agregarCupon"
  >
  </CrearCupon>
  <CanjearCupon
    :classCupon="classCupon"
    :vipModal="vipModal"
    :loading="loading"
    :message="message"
    :codigoLength="codigoLength"
    :url="canjearCupon"
    v-model:codigo="codigo"
    @closeCupon="closeCupon"
    @canjeCupon="canjeCupon"
  ></CanjearCupon>
  <FinSuscripcion
    v-if="
      userData &&
      token &&
      userData.profile[0].suscripcion === 0 &&
      userData.profile[0].fin_suscripcion !== null
    "
    :userData="userData"
    :vencio="
      dayjs(userData.profile[0].fin_suscripcion)
        .locale('es')
        .format('DD [de] MMMM [del] YYYY')
    "
    @openCupon="openCupon"
  ></FinSuscripcion>
</template>
<style>
.bgheader {
  background: linear-gradient(
    60deg,
    rgba(84, 58, 183, 1) 0%,
    rgba(0, 172, 193, 1) 100%
  );
}
.migrilla {
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
}
.contenedor-sin-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
