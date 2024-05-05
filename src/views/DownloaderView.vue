<script setup>
import { ref } from "vue";
import axios from "axios";
import CargandoFrom from "@/components/globales/CargandoForm.vue";

const busqueda = ref("");
const resultados = ref([]);
const enviando = ref(false);
const texto = ref("")

const buscar = async () => {
  try {
    enviando.value = true;
    texto.value = "Realizando busqueda ..."
    const { data } = await axios.get(
      `https://api.multimarcas.app/api/youtube/search/${busqueda.value}`
    );
    resultados.value = data.result;
  } catch (error) {
    console.log(error);
  } finally {
    enviando.value = false;
  }
};

const download = async (id, name) => {
  try {
    enviando.value = true
    texto.value = "Procesando descarga..."
    const datos = {
      id: id,
    };
    const { data } = await axios.post(
      "https://api.multimarcas.app/api/youtube/download",
      datos,
      {
        responseType: "blob", // Asegura que la respuesta es tratada como un Blob
      }
    );

    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name); // Asegúrate de darle un nombre de archivo correcto
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
  } finally {
    enviando.value = false
  }
};



const filtroTime  = (duracion) => {
    const time = duracion.split(":")
    return  parseInt(time.join(''));
}
</script>
<template>
  <div class="overflow-y-scroll">
    <CargandoFrom :enviando="enviando" :textoCarga="texto"></CargandoFrom>
    <h2 class="p-4 pb-0 font-medium text-white uppercase bg-black">
      Descarga Musica Gratis
    </h2>
    <form class="p-4 py-8 pt-5 bg-black" @submit.prevent="buscar">
      <input
        type="text"
        class="block w-full px-4 py-2 font-medium transition-all rounded-md outline-none focus:shadow-lg bg-white/70 placeholder:text-black placeholder:font-medium focus:shadow-cyan-500/20"
        placeholder="Escribe tu busqueda musical.."
        required
        v-model="busqueda"
      />
      <input
        type="submit"
        class="block w-full py-2 mt-6 text-center text-white bg-blue-700 rounded-md"
        value="Buscar cancion"
      />
    </form>

    <div class="p-4">
      <div v-for="song in resultados" :key="song.id">
        <div class="border border-solid border-[#ddd] mb-4" v-if="song.duration !== null && filtroTime(song.duration) < 1100">
          <div
            class="font-medium truncate block p-4 border-b border-dashed border-[#ddd]"
          >
            {{ song.title }}
          </div>
          <div class="flex items-center justify-between p-4">
            <div><b class="font-medium">Duracion:</b> {{ song.duration === null ? 'Desconocida' : song.duration }}</div>
            <div>
              <button @click="download(song.id, song.title)">Descargar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
