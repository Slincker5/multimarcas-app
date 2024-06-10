<script setup>
import { Transition, ref } from "vue";
import axios from "axios";

defineProps(["modal"])
const emit = defineEmits(["cerrarModal"])

const fileInput = ref(null);
const fileName = ref("");
const token = ref(localStorage.getItem("token"));

function triggerFileInput() {
  fileInput.value.click();
  console.log(fileInput.value);
}

function onChange(event) {
  // Verifica si hay archivos seleccionados
  if (event.target.files.length > 0) {
    // Obtiene el nombre del primer archivo seleccionado
    fileName.value = event.target.files[0].name;
  } else {
    fileName.value = ""; // Limpia el nombre si no hay archivos
  }
}

async function uploadFile() {
  if (!fileInput.value.files.length) return;

  const formData = new FormData();
  formData.append("photo", fileInput.value.files[0]);

  try {
    const { data } = await axios.post(
      "https://api.multimarcas.app/api/user/upload-photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    alert("Foto de perfil actualizada con exito.")
    location.reload()
    // Maneja la respuesta de éxito aquí
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    // Maneja el error aquí
  }
}
</script>
<template>
  <!-- div que muestra la suscripcion vencida -->
   <Transition>
  <div
    class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-black/80"
    v-if="modal"
  >
    <div
      class="bg-white w-[80%] md:w-[450px] max-w-screen-sm rounded-lg shadow-2xl"
    >
      <h3
        class="flex items-center justify-between p-4 font-medium text-gray-800 border-b border-[#dddddd] border-solid"
      >
        <button @click="emit('cerrarModal')"
          ><font-awesome-icon :icon="['fas', 'chevron-left']" />
          VOLVER</button
        >
        CAMBIAR FOTO
      </h3>
      <input
        type="file"
        accept="image/*"
        ref="fileInput"
        style="display: none"
        @change="onChange"
      />
      <div
        class="grid py-6 transition-all ease-linear delay-500 cursor-pointer place-content-center hover:bg-gray-200"
        @click.prevent="triggerFileInput"
      >
        <div>
          <img src="../../../public/upload.png" class="w-[90px] block m-auto" />
          <span class="inline-block py-3 text-sm font-light text-sky-600">{{
            fileName === "" ? "Click para abrir imagenes" : fileName
          }}</span>
        </div>
      </div>
      <div class="p-4">
        <button
          class="w-full px-6 py-2 mb-4 text-sm text-center text-white bg-indigo-800 border border-indigo-900 border-solid rounded-md shadow-lg shadow-black/20"
          @click="uploadFile"
          :disabled="!fileName"
        >
          Guardar foto
        </button>
      </div>
    </div>
  </div>
</Transition>
</template>
