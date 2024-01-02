<script setup>
import { ref } from "vue";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useGetRoutes } from "@/composables/getRoutes";
import { useRouter } from "vue-router";

const { authLogin, authLoginWithGoogle } = useGetRoutes();
const router = useRouter();
const enviando = ref(false);
// PARA USUARIOS ACTUALES
const username = ref("");
const pass = ref("");

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
      router.push("/");
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
      router.push("/");
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div
    class="fixed w-full h-full bg-black/[.5] top-0 left-0 flex items-center justify-center z-50"
    v-if="enviando"
  >
    <div
      class="flex items-center justify-center text-white bg-[#263238] w-[90%] h-[60%] p-4 text-xl"
    >
      <font-awesome-icon :icon="['fas', 'spinner']" class="mr-2 fa-pulse" />
      Iniciando sesion...
    </div>
  </div>
  <div class="relative bg-cover bg-image">
    <div class="w-full py-6 overlay banner">
      <h1 class="p-4 text-xl font-medium text-center text-white uppercase">
        cintillos en tiempo record.
      </h1>
      <p class="p-4 pt-0 text-sm text-center text-white">
        ¡Revolutiona tu supermercado! Genera etiquetas de precio y rótulos de
        oferta de forma automática y en minutos. Eficiencia y rapidez al alcance
        de un clic.
      </p>
    </div>
  </div>
  <h2 class="p-4 font-medium text-gray-800">INICIAR SESION</h2>
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
  <div class="flex items-center justify-between w-full py-5">
    <hr class="w-full bg-gray-400" />
    <p class="text-base font-medium leading-4 px-2.5 text-gray-400">O</p>
    <hr class="w-full bg-gray-400" />
  </div>
  <form
    class="p-4 border-t border-solid border-[#ddd]"
    @submit.prevent="loginDirect"
  >
    <label
      class="block mb-2 text-xs font-bold tracking-wide text-black uppercase"
      for="grid-last-name"
      id="login"
    >
      USUARIO:
    </label>
    <input
      class="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
      type="text"
      placeholder="INGRESA UN USUARIO"
      autocomplete="off"
      v-model="username"
      required
    />

    <label
      class="block mt-4 mb-2 text-xs font-bold tracking-wide text-black uppercase"
      for="grid-last-name"
    >
      CONTRASEÑA:
    </label>
    <input
      class="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
      type="password"
      placeholder="INGRESA UNA CONTRASEÑA"
      autocomplete="off"
      v-model="pass"
      required
    />
    <input
      type="submit"
      class="block mt-6 w-full px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg"
      value="ENTRAR"
    />
  </form>

  <footer class="p-4 border-t border-solid border-[#ddd]">
    Multimarcas app || {{ year }}
  </footer>
  <div id="container-1ac063648180197409e096574f95a0cf"></div>
</template>

<style>
.bg-image {
  background-image: url("../../public/banner.jpeg");
}

.banner {
  background: rgb(38, 38, 38);
  background: linear-gradient(
    rgba(38, 38, 38, 0.8) 10%,
    rgba(38, 38, 38, 1) 80%
  );
}
</style>
