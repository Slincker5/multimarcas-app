<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useGetRoutes } from "@/composables/getRoutes";
import CompletarOrden from "@/components/pagos/CompletarOrden.vue";
import Herramientas from "@/components/home/Herramientas.vue";
import { useNavBar } from "@/store/menu";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { Client } from "@pusher/push-notifications-web";
dayjs.locale("es");
dayjs.extend(relativeTime);

const firebaseConfig = {
  apiKey: "AIzaSyB0z01S4THMA_8x6jKtV1OodLHXs0J9kZ8",
  authDomain: "multimarcasapp-2fa97.firebaseapp.com",
  projectId: "multimarcasapp-2fa97",
  storageBucket: "multimarcasapp-2fa97.appspot.com",
  messagingSenderId: "732835844626",
  appId: "1:732835844626:web:d5fd4d29dd760b66bd7ecb",
  measurementId: "G-0SQH2EVZX3",
};

const app = initializeApp(firebaseConfig);

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();
onMessage(messaging, (payload) => {
  if (!("Notification" in window)) {
    console.log("no tienes permiso");
  } else {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(payload.data.title, {
          icon: "/icon.png",
          body: payload.data.body,
        });
      });
    }
    console.log("Message received. ", payload);
  }
});

getToken(messaging, {
  vapidKey:
    "BA9bTnFZb5SK1MnMw6atlBXztDu10VBADz5MU20_roFWuNIH7C-S3tuFpt9JWQjZTCBHjm5WF-wyL7uPkEZPT4s",
})
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      console.log("Token is:", currentToken);
      // ...
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
    // ...
  });
const { url, userStat, userUpdateToken, labelListGenerated } = useGetRoutes();
const useNavBarStore = useNavBar();
const { getUserData } = useNavBarStore;
const { userData } = storeToRefs(useNavBarStore);
const token = ref(localStorage.getItem("token"));
const enviando = ref(false);
const generados = ref([]);

const updateToken = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(userUpdateToken, null, { headers });
    localStorage.setItem("token", data.token);
  } catch (error) {
    console.log(error);
  }
};

updateToken();

const getGenerados = async () => {
  try {
    const headers = {
      Authorization: "Bearer " + token.value,
      "Content-Type": "application/json",
    };
    let { data } = await axios.get(labelListGenerated, {
      headers,
    });
    generados.value = data;
  } catch (error) {
    console.log(error);
  }
};
getGenerados();

const abrirModalTuto = () => {
  modalTuto.value = "block";
};
const cerrarModalTuto = () => {
  modalTuto.value = "hidden";
  videoTuto.pause();
};

const reproducir = () => {
  videoTuto.play();
};

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Codigo copiado al portapapeles.", {
      theme: "colored",
      autoClose: 1500,
      position: toast.POSITION.BOTTOM_LEFT,
      transition: toast.TRANSITIONS.ZOOM,
    });
  } catch (err) {
    console.error("No se pudo copiar el texto:", err);
  }
}

const anuncioTmp = ref(localStorage.getItem("resend"));
const cerrarVentana = () => {
  anuncioTmp.value = localStorage.setItem("resend", "true");
};

getUserData(userStat);
const script = document.createElement("script");
script.src = "https://pagos.wompi.sv/js/wompi.pagos.js";
document.head.appendChild(script);
</script>
<template>
  <div class="overflow-auto">
    <div
      class="fixed top-0 left-0 z-50 hidden w-full h-full p-4 overflow-hidden transition-all bg-white"
    >
      <div class="flex items-center justify-between py-4">
        <button
          class="inline-block px-5 py-2 text-sm text-white bg-green-500 rounded-md shadow-md"
          @click.prevent="reproducir"
        >
          Reproducir
        </button>
        <button
          class="inline-block px-5 py-2 text-sm text-white rounded-md shadow-md bg-amber-500"
          @click.prevent="cerrarModalTuto"
        >
          Volver a mi compra
        </button>
      </div>
      <video
        controls
        class="block m-auto w-[90%] sm:w-[150px] md:w-[300px]"
        id="videoTuto"
      >
        <source src="../../public/tutorial.mp4" type="video/mp4" />
      </video>
    </div>

    <audio class="hidden" id="audioPlayer">
      <source src="../../public/tap-like.mp3" type="audio/mp3" />
      Tu navegador no soporta el elemento de audio.
    </audio>
    <Herramientas
      v-if="userData"
      :premium="userData.profile[0].suscripcion"
    ></Herramientas>
    <div>
      <div
        class="flex items-start justify-between bg-indigo-400 border-l-4 border-indigo-700 border-solid"
      >
        <img
          src="../../public/support.png"
          alt="atención al cliente"
          class="w-[75px] block p-4"
        />
        <div class="w-full p-4 pl-0">
          <h3 class="text-sm font-medium text-white uppercase">
            Atención al cliente
          </h3>
          <p class="text-sm font-light text-white">
            Tienes problemas con la app puedes contactarnos.
          </p>
          <div class="flex justify-end p-1">
            <a
              href="https://wa.me/+50374329014"
              class="px-4 py-2 text-xs font-medium text-indigo-400 bg-white rounded-lg"
            >
              Escribir mensaje
            </a>
          </div>
        </div>
      </div>
    </div>
    <CompletarOrden
      v-if="userData && userData.profile[0].suscripcion === 0"
    ></CompletarOrden>
    <div>
      <h3 class="p-4 font-medium">HISTORIAL CINTILLOS</h3>

      <div
        class="grid grid-cols-1 gap-1 p-4 sm:gap-2 md:grid-cols-2 lg:grid-cols-3"
        v-if="generados.length > 0"
      >
        <div
          class="bg-white border border-solid border-[#ddd] mb-4 sh"
          v-for="generado in generados"
        >
          <div class="p-4 text-sm font-medium text-neutral-700">
            <img
              src="../../public/excel.png"
              class="w-[16px] inline-block align-middle"
            />
            {{ generado.path_name }}
          </div>
          <div class="border-t border-solid border-[#ddd] p-4">
            <div class="overflow-hidden">
              <b class="pr-1 text-sm font-medium">Enviado:</b
              ><span
                class="text-sm text-gray-500"
                v-if="generado.email === null"
              >
                {{ generado.receptor }}</span
              ><span class="text-sm text-gray-500" v-else>{{
                generado.email
              }}</span>
            </div>
          </div>
          <div class="p-4 pt-0">
            <div class="flex items-center justify-between">
              <div>
                <b class="pr-1 text-sm font-medium">Codigo ref:</b
                ><span class="text-sm text-green-500">
                  #{{ generado.code }}</span
                >
              </div>
              <button
                @click="copyToClipboard(generado.code)"
                class="text-sm text-neutral-500"
              >
                <font-awesome-icon :icon="['fas', 'clipboard']" /> COPIAR
              </button>
            </div>
          </div>
          <div class="p-4 pt-0">
            <b class="pr-1 text-sm font-medium">Generado:</b>
            <span class="text-sm text-gray-500">{{
              dayjs(generado.fecha).fromNow()
            }}</span>
          </div>
          <div
            class="p-4 border-t border-dashed border-[#ddd] flex items-center justify-between gap-4"
          >
            <a
              :href="`${url}/${generado.path}`"
              download
              class="block w-full px-4 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-100 rounded shadow focus:bg-gray-300 hover:bg-gray-300 ripple hover:shadow-lg focus:outline-none"
            >
              DESCARGAR
            </a>
            <router-link
              :to="`cintillo/${generado.path_uuid}`"
              class="relative block w-full px-4 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-100 rounded shadow focus:bg-gray-300 hover:bg-gray-300 ripple hover:shadow-lg focus:outline-none"
            >
              Ver detalles
            </router-link>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center p-4 h-52" v-else>
        <div class="text-xl text-neutral-700">
          <img
            src="../../public/sad.gif"
            class="w-[27px] inline-block align-middle"
          />Esto parece un desierto.
        </div>
      </div>
    </div>

    <div
      class="fixed top-0 left-0 z-30 flex items-center justify-center w-full h-full bg-black/80"
      v-if="anuncioTmp === null"
    >
      <div
        class="bg-white w-[80%] py-6 px-4 max-w-screen-sm rounded-lg shadow-2xl"
      >
        <img src="../../public/resend-event.png" class="w-[30%] block m-auto" />
        <h3
          class="pt-4 font-medium text-center text-black uppercase text-nomal"
        >
          NUEVA FUNCION
        </h3>
        <p class="py-4 text-sm text-center text-gray-500">
          ¡Emociónate! Ahora puedes reenviar tus cintillos fácilmente. ¿Quieres
          volver a enviarlos al mismo correo o compartirlos con otros contactos?
          ¡Hazlo en un instante y comparte tus creaciones con quien desees!
        </p>
        <div class="py-4 pb-0 border-t border-dashed border-[#ddd]">
          <button
            class="block px-6 py-2 mx-auto mb-4 text-sm text-center border border-solid rounded-sm shadow-lg border-neutral-700"
            @click.prevent="cerrarVentana"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.b {
  background: rgb(56, 62, 66);
  background: linear-gradient(
    180deg,
    rgba(56, 62, 66, 0.5) 0%,
    rgba(56, 62, 66, 1) 50%
  );
}

.acciones::-webkit-scrollbar {
  display: none; /* Oculta la barra de desplazamiento en navegadores WebKit (como Chrome/Safari) */
}
.shimg {
  filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.3));
}

.sh {
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
}
.bg {
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
  background-image: url("../../public/bg.png");
  background-repeat: repeat;
  background-size: contain;
}

.bg:hover {
  background-color: #ddd;
}
</style>
