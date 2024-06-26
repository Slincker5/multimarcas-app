import { ref } from "vue";
import axios from "axios";

export const useGetData = () => {
  const loading = ref(false);
  const datos = ref([]);

  async function getData(url, token) {
    try {
      loading.value = true;
      const headers = {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      };
      let { data } = await axios.get(url, {
        headers,
      });
      const filtrar = filtrarDuplicados(data);
      datos.value = filtrar;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }

  function filtrarDuplicados(data) {
    let productoUnico = data.filter(
      (
        (map) => (item) =>
          !map.has(item.descripcion) && map.set(item.descripcion, true)
      )(new Map())
    );
    return productoUnico;
  }

  return {
    getData,
    datos,
    loading,
  };
};
