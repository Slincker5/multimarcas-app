import { ref } from "vue";
import axios from "axios";
import { defineStore } from "pinia";

export const useCintilloStore = defineStore("cintillos", () => {
  const listaCintillos = ref([]);
  const loading = ref(false);

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
      listaCintillos.value = filtrar;
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

  function eliminarCintillo (uuid){
    const eliminarCintillo = listaCintillos.value.filter(producto => producto.uuid !== uuid);
    listaCintillos.value = eliminarCintillo
  }

  return { listaCintillos, loading, getData, eliminarCintillo };
});
