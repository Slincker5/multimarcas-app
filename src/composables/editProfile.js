import axios from "axios";
import { ref } from "vue";
import { useGetRoutes } from "../composables/getRoutes";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useEditProfile = () => {
  const { editProfile, editPasswordProfile, userStat } = useGetRoutes();
  const nombre = ref();
  const apellido = ref();
  const telefono = ref();
  const token = ref(localStorage.getItem("token"));
  const guardando = ref(false);

  async function getData() {
    try {
      guardando.value = true;
      const headers = {
        Authorization: "Bearer " + token.value,
        "Content-Type": "application/json",
      };
      let { data } = await axios.get(userStat, {
        headers,
      });
      nombre.value =
        data.profile[0].username === null
          ? data.profile[0].nombre
          : data.profile[0].username;
      apellido.value =
        data.profile[0].apellido === null ? "" : data.profile[0].apellido;
      telefono.value =
        data.profile[0].telefono === null ? "" : data.profile[0].telefono;
    } catch (error) {
      console.log(error);
    } finally {
      guardando.value = false;
    }
  }
  getData();

  const editarPerfil = async () => {
    try {
      const dataProfile = {
        nombre: nombre.value,
        apellido: apellido.value,
        telefono: telefono.value,
      };
      const headers = {
        Authorization: "Bearer " + token.value,
        "Content-Type": "application/json",
      };

      let { data } = await axios.post(editProfile, dataProfile, { headers });
      if (data.status === "error") {
        toast.error(data.message, {
          theme: "colored",
          autoClose: 2000,
          position: toast.POSITION.BOTTOM_LEFT,
          transition: toast.TRANSITIONS.ZOOM,
        });
      } else {
        toast.success(data.message, {
          theme: "colored",
          autoClose: 1500,
          position: toast.POSITION.BOTTOM_LEFT,
          transition: toast.TRANSITIONS.ZOOM,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return {
    nombre,
    apellido,
    telefono,
    editarPerfil,
    guardando
  };
};
