import { ref, computed } from "vue";
import axios from "axios";

export const useNavBarMain = () => {
  const token = ref(localStorage.getItem("token"));

  // variables del form canje cupon
  const loading = ref("hidden");
  const vipModal = ref("hidden");
  const message = ref("");
  const codigo = ref("");
  const options = ref("left-[-100%]");
  const nCupon = ref("");
  const nUsos = ref("");
  // funciones del form canje cupon
  const codigoLength = computed(() => codigo.value.length);

  const openMenu = () => {
    options.value = "left-0";
  };

  const closeMenu = () => {
    options.value = "left-[-100%]";
  };

  const canjeCupon = async (url) => {
    try {
      loading.value = "flex";
      const param = {
        cupon: codigo.value,
      };
      const headers = {
        Authorization: "Bearer " + token.value,
        "Content-Type": "application/json",
      };
      const { data } = await axios.post(url, param, { headers });
      message.value = data;
      if (data.status === "OK") vipModal.value = "block";
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = "hidden";
    }
  };

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
  // Opcion de cerrar sesion
  const logout = () => {
    localStorage.removeItem("user_uuid");
    localStorage.removeItem("usuario");
    localStorage.removeItem("photo");
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    redireccionar("/login");
  };

  const redireccionar = (url) => {
    window.location.href = url;
  };

  // variables del from crear cupon

  const genCupon = async (url) => {
    try {
      const headers = {
        Authorization: "Bearer " + token.value,
        "Content-Type": "application/json",
      };
      const { data } = await axios.get(url, { headers });
      nCupon.value = data.cupon;
    } catch (error) {
      console.error(error);
    }
  };

  const agregarCupon = async (url) => {
    try {
      const param = {
        cupon: nCupon.value,
        limite_cupon: nUsos.value,
      };
      const headers = {
        Authorization: "Bearer " + token.value,
        "Content-Type": "application/json",
      };

      const { data } = await axios.post(url, param, { headers });
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };
  return {
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
    nUsos,
    nCupon,
  };
};
