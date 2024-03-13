import axios from "axios";
import { useCintilloStore } from "@/store/cintillos";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useRemoveLabel = () => {
  const useCintillos = useCintilloStore();
  const { eliminarCintillo } = useCintillos;
  async function eliminar(url, uuid, token) {
    try {
      const headers = {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      };

      const info = {
        uuid: uuid,
      };

      let { data } = await axios.delete(url, {
        headers: headers,
        data: info,
      });
      eliminarCintillo(uuid)
      toast.success(data.message, {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    eliminar,
  };
};
