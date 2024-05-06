<script setup>
import { ref } from "vue";
import axios from "axios";
import { useGetRoutes } from "@/composables/getRoutes";
import CargandoFrom from "@/components/globales/CargandoForm.vue";
const token = ref(localStorage.getItem("token"));
const { notificationGlobal, notificationPremiumEnd } = useGetRoutes();
const items = [
  { text: "NOTIFICACION GLOBAL" },
  { text: "SUSCRIPCION FINALIZADA" },
];

const selected = ref(null);

const selectItem = (index) => {
  selected.value = index;
  console.log(items[selected.value].text);
};

const notifyBody = [
  {
    text: "Recuerda que con nuestra app puedes generar etiquetas de precio personalizadas en cuestión de minutos. ¡Haz que tus productos destaquen y atraigan a más clientes! ¡No pierdas la oportunidad de maximizar tus ventas! 🚀",
  },
  {
    text: "¿Necesitas etiquetar nuevos productos? ¡No olvides que nuestra app puede ayudarte a hacerlo de manera rápida y eficiente! Con unos pocos clics, podrás generar etiquetas de precio profesionales y maximizar tus ganancias. 💪",
  },
  {
    text: "¡Simplifica la tarea de generar etiquetas de precio con nuestra app! Aprovecha al máximo todas sus funciones y ahorra tiempo en la gestión de precios de tus productos. 🎉",
  },
  {
    text: "Tu suscripción premium ha finalizado. ¿Quieres seguir disfrutando de los beneficios exclusivos? ¡Renueva tu suscripción ahora mismo y continúa disfrutando de todas nuestras funciones premium!",
  },
  {
    text: "Tu suscripción premium ha finalizado. ¿Te gustaría seguir disfrutando de nuestras funciones exclusivas? ¡Renueva ahora y continúa disfrutando de todos los beneficios!",
  },
];

const enviando = ref(false);
const body = ref("");
const titulo = ref("MULTIMARCAS APP");
const selectBody = (index) => {
  body.value = notifyBody[index].text;
};

const send = async () => {
  try {
    enviando.value = true;
    const url =
      selected.value === 0 ? notificationGlobal : notificationPremiumEnd;
    const dataNotify = {
      title: titulo.value,
      body: body.value,
    };
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(url, dataNotify, { headers });
    alert(data);
  } catch (error) {
    console.log(error);
  } finally{
    enviando.value = false
  }
};
</script>
<template>
  <div class="grid h-full grid-cols-1 sm:grid-cols-2 gap-x-4">
    <CargandoFrom
      :enviando="enviando"
      :textoCarga="' Enviando notificaciones'"
    ></CargandoFrom>
    <div>
      <h3
        class="flex items-center justify-between p-4 pb-0 text-sm font-medium text-black uppercase"
      >
        <router-link to="/">
          <font-awesome-icon :icon="['fas', 'arrow-left-long']" />
        </router-link>
        CREAR NOTIFICACION
      </h3>
      <form class="p-4" @submit.prevent="send">
        <div
          class="flex w-full gap-2 pb-6 overflow-auto whitespace-nowrap eliminarBarraScroll"
        >
          <div
            v-for="(item, index) in items"
            :key="index"
            :class="{
              'text-sm inline-block px-3 py-2 font-medium text-center uppercase bg-gray-200 rounded-lg shadow-md cursor-pointer text-gray-500': true,
              'bg-gray-900 text-white': selected === index,
            }"
            @click="selectItem(index)"
          >
            {{ item.text }}
          </div>
        </div>

        <div class="mb-4">
          <label
            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
            for="barra"
          >
            TITULO NOTIFICACION:
          </label>
          <div
            class="flex items-center justify-between border border-solid border-[#ddd] focus:border-gray-500"
          >
            <input
              class="flex-1 px-4 py-3 leading-tight text-gray-700 border-0 rounded-l appearance-none focus:outline-none focus:bg-white"
              id="barra"
              type="text"
              placeholder="MULTIMARCAS APP"
              autocomplete="off"
              v-model="titulo"
            />
          </div>
        </div>
        <div class="mb-4">
          <label
            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
            for="barra"
          >
            CUERPO NOTIFICACION:
          </label>
          <textarea
            class="w-full border border-solid border-[#ddd] focus:border-gray-500 px-4 py-3 leading-tight text-gray-700 outline-none appearance-none"
            id="barra"
            type="text"
            placeholder="Escribe un comentario al contralor"
            autocomplete="off"
            v-model="body"
            >{{ body }}</textarea
          >
        </div>
        <button
          class="w-full px-6 py-2 mb-4 text-sm text-center text-white bg-indigo-800 border border-indigo-900 border-solid rounded-md shadow-lg shadow-black/20"
        >
          ENVIAR NOTIFICACION
        </button>
      </form>
    </div>
    <div>
      <h3
        class="sticky flex items-center justify-between p-4 text-sm font-medium text-black uppercase"
      >
        SUGERENCIAS
      </h3>
      <div class="max-h-[400px] overflow-y-auto">
        <div
          v-for="(item, index) in notifyBody"
          :key="index"
          :class="{
            'text-sm overflow-y-auto block p-4 m-4 bg-gray-100 rounded-lg shadow-md cursor-pointer text-gray-500': true,
            'bg-gray-200 text-black': body === index,
          }"
          @click="selectBody(index)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.eliminarBarraScroll::-webkit-scrollbar {
  display: none;
}
</style>
