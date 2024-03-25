<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import CargandoFrom from "@/components/globales/CargandoForm.vue";
import { useGetRoutes } from "@/composables/getRoutes";
import { useRouter } from "vue-router";

const { authLogin, authLoginWithGoogle } = useGetRoutes();
const router = useRouter();
const enviando = ref(false);
// PARA USUARIOS ACTUALES
const username = ref("");
const pass = ref("");

const redireccionar = (url) => {
  window.location.href = url;
};

const loginDirect = async () => {
  try {
    enviando.value = true;
    let credenciales = {
      username: username.value,
      pass: pass.value,
    };
    const { data } = await axios.post(authLogin, credenciales);

    if (data.status === "OK") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_uuid", data.user_uuid);
      localStorage.setItem("usuario", data.username);
      localStorage.setItem("photo", data.photo);
      localStorage.setItem("rol", data.rol);
      redireccionar("/");
    } else {
      enviando.value = false;
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

const today = new Date();
const year = today.getFullYear();

const provider = new GoogleAuthProvider();
provider.addScope("email");
const foto = ref("");
const nombre = ref("");
const email = ref("");
const firebaseConfig = {
  apiKey: "AIzaSyB0z01S4THMA_8x6jKtV1OodLHXs0J9kZ8",
  authDomain: "multimarcasapp-2fa97.firebaseapp.com",
  projectId: "multimarcasapp-2fa97",
  storageBucket: "multimarcasapp-2fa97.appspot.com",
  messagingSenderId: "732835844626",
  appId: "1:732835844626:web:d5fd4d29dd760b66bd7ecb",
  measurementId: "G-0SQH2EVZX3",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

const login = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    foto.value = user.photoURL;
    nombre.value = user.displayName;
    email.value = user.providerData[0].email;

    const param = {
      username: user.displayName,
      email: user.providerData[0].email,
      photo: user.photoURL,
    };

    const { data } = await axios.post(authLoginWithGoogle, param);

    if (data.status == "OK") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_uuid", data.user_uuid);
      localStorage.setItem("usuario", data.username);
      localStorage.setItem("email", data.email);
      localStorage.setItem("photo", data.photo);
      localStorage.setItem("rol", data.rol);
      redireccionar("/");
    }
  } catch (error) {
    console.log(error);
  }
};
const statusPass = ref(false);
let showPass;
onMounted(() => {
  const inputPass = document.getElementById("inputPass");
  showPass = () => {
    statusPass.value = !statusPass.value;
    if (statusPass.value) {
      inputPass.type = "text";
    } else {
      inputPass.type = "password";
    }
  };
});
</script>
<template>
  <div class="w-full row-start-1 row-end-1">
    <div class="relative w-full bg">
      <div
        class="md:flex md:items-center md:justify-center w-full md:h-[200px]"
      >
        <div>
          <div class="flex items-center justify-between md:block">
            <h1
              class="py-6 pl-4 mb-0 text-lg text-center text-white md:pl-0 md:pb-0 md:mb-4 md:text-3xl logo md:pt-0"
              style="font-family: Fjalla One"
            >
              MULTIMARCAS APP
            </h1>
            <div class="py-6 pr-4 md:py-0 md:pr-0 md:hidden">
              <router-link
                to="/register"
                class="px-3 py-1 text-sm text-center text-white bg-transparent border border-solid border-white/50"
              >
                Crear Cuenta
              </router-link>
            </div>
          </div>
          <p class="p-4 text-sm text-center text-white md:p-0 md:text-base">
            <span class="block md:inline-block"
              >¡Revolutiona tu supermercado!
            </span>
            Genera etiquetas de precio y rótulos de oferta de forma automática y
            en minutos. Eficiencia y rapidez al alcance de un clic.
          </p>
        </div>
      </div>
      <div>
        <svg
          class="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shape-rendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g class="parallax">
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(255,255,255,0.7"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(255,255,255,0.5)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(255,255,255,0.3)"
            />
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </div>

    <div class="grid grid-cols-1 bg-white md:grid-cols-3">
      <div class="col-span-2 p-0 md:p-8">
        <h3 class="p-4 font-medium md:pb-6">INICIAR SESION</h3>

        <form class="p-4 pt-0" @submit.prevent="loginDirect">
          <CargandoFrom
            :enviando="enviando"
            :textoCarga="' Inciando sesion ..'"
          ></CargandoFrom>
          <div
            class="flex items-center justify-between border border-solid border-[#ddd]"
          >
            <div class="px-4 py-3 bg-gray-200 text-neutral-600">
              <font-awesome-icon :icon="['fas', 'user']" />
            </div>
            <input
              class="block w-full px-4 py-3 outline-none appearance-none focus:text-neutral-900 focus:font-medium text-neutral-500 placeholder:text-neutral-500"
              type="text"
              placeholder="Correo o telefono"
              autocomplete="off"
              v-model="username"
              required
            />
          </div>

          <div
            class="flex items-center justify-between border border-solid border-[#ddd] mt-8"
          >
            <div class="px-4 py-3 bg-gray-200 text-neutral-600">
              <font-awesome-icon :icon="['fas', 'key']" />
            </div>
            <input
              class="block w-full px-4 py-3 outline-none appearance-none focus:text-neutral-900 focus:font-medium text-neutral-600 placeholder:text-neutral-500"
              type="password"
              placeholder="Contraseña"
              autocomplete="off"
              v-model="pass"
              id="inputPass"
              required
            />
            <a
              href="#"
              class="px-4 py-3 bg-white text-neutral-600"
              @click.prevent="showPass"
            >
              <font-awesome-icon
                :icon="['fas', 'eye-slash']"
                v-if="statusPass"
              />
              <font-awesome-icon :icon="['fas', 'eye']" v-else />
            </a>
          </div>
          <input
            type="submit"
            class="block mt-8 w-full px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg"
            value="ENTRAR"
          />
        </form>
        <div class="flex items-center justify-between w-full py-5">
          <hr class="w-full bg-gray-400" />
          <p class="text-base font-medium leading-4 px-2.5 text-gray-400">O</p>
          <hr class="w-full bg-gray-400" />
        </div>
        <button
          class="flex gap-2 px-4 py-2 mx-auto transition duration-150 border rounded-lg border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow"
          @click.prevent="login"
        >
          <img
            class="w-6 h-6"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
          />
          <span>Iniciar sesion con Google</span>
        </button>
        <br />
      </div>
      <div
        class="col-span-1 md:p-8 pt-0 m-6 md:border-l md:border-solid md:border-[#ddd] p-0 hidden sm:block"
      >
        <h3 class="pb-6 font-medium">CREAR CUENTA</h3>
        <button
          class="bg-[#4385F5] text-sm p-[2px] md:w-[280px] flex gap-2 mx-auto transition duration-150 border rounded-md border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow"
          @click.prevent="login"
        >
          <div class="p-2 bg-white">
            <img
              class="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
          </div>
          <span class="p-2 font-medium text-white"
            >Continuar con Google</span
          ></button
        ><br />
        <button
          class="w-[250px] flex gap-2 px-4 py-2 mx-auto transition duration-150 border rounded-lg border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow"
          @click.prevent="login"
        >
          <span
            ><font-awesome-icon :icon="['fas', 'user']" /> Crear Cuenta</span
          >
        </button>

        <h3 class="py-6 font-medium">¿OLVIDATE TU CONTRASEÑA</h3>
      </div>
    </div>

    <footer
      class="border-t border-solid border-[#ddd] px-4 py-6 text-gray-600 font-medium"
    >
      MULTIMARCAS APP || 2024
    </footer>
  </div>
</template>

<style>
.menu {
  grid-template-rows: auto 1fr auto;
}
body {
  width: 100%;
  max-width: 1200px;
  margin: auto;
  background-color: #000;
}

.bg {
  background: linear-gradient(
    60deg,
    rgba(84, 58, 183, 1) 0%,
    rgba(0, 172, 193, 1) 100%
  );
}

.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px; /*Fix for safari gap*/
  min-height: 100px;
  max-height: 150px;
}

/* Animation */

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
/*Shrinking for mobile*/
@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }
}
</style>
