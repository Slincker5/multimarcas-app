import { ref } from "vue";
import axios from "axios";
import { useGetRoutes } from "@/composables/getRoutes";

const { labelDocument } = useGetRoutes();

export const useDocumentLabel = () => {
  const token = ref(localStorage.getItem("token"));

  const etiquetas = ref(null);

  const getData = async (param) => {
    try {
      const { data } = await axios.get(`${labelDocument}${param}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      etiquetas.value = data;
    } catch (error) {
      console.log(error);
    }
  };
  return {
    etiquetas,
    getData,
  };
};
