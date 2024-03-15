<script setup>
import { ref } from "vue";
import axios from 'axios';

const photo = ref(localStorage.getItem("photo") || "");
const token = ref(localStorage.getItem("token"))
// Función para cargar y previsualizar la imagen
const loadFile = (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      photo.value = e.target.result; // Actualiza la previsualización de la imagen
    };

    reader.readAsDataURL(file);
  }
};

// Función para manejar el envío del formulario y cargar la foto
const uploadPhoto = async (event) => {
  event.preventDefault(); // Previene el envío predeterminado del formulario

  const formData = new FormData();
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput.files[0]) {
    formData.append("photo", fileInput.files[0]);

    try {
      const response = await axios.post('https://api.multimarcas.app/api/user/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token.value}`, // Asegúrate de incluir el token aquí
        },
      });
      alert('Foto cargada con éxito');
      // Maneja la respuesta exitosa aquí
    } catch (error) {
      console.error('Error al cargar la foto', error);
      // Maneja el error aquí
    }
  }
};
</script>

<template>
  <form @submit="uploadPhoto" class="p-4">
    <div class="flex items-center space-x-6">
      <div class="shrink-0">
        <img
          id="preview_img"
          class="object-cover w-10 h-10 rounded-full"
          :src="photo"
          alt="Current profile photo"
        />
      </div>
      <label class="block">
        <span class="sr-only">Choose profile photo</span>
        <input
          name="photo"
          type="file"
          @change="loadFile"
          accept="image/*" 
          class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
      </label>
    </div>
    <button
      type="submit"
      class="block mt-8 w-full px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg"
    >
      Cambiar foto
    </button>
  </form>
</template>
