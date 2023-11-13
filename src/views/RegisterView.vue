<script setup>
import { ref } from "vue";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useGetRoutes } from "@/composables/getRoutes";
import { useRouter } from "vue-router";

// rutas

const { authRegister, authLoginWithGoogle, getIp } = useGetRoutes();

const router = useRouter();
const enviando = ref(false);

// PARA USUARIOS DE LA BETA
const user_tmp = ref(localStorage.getItem("usuario"));
const clave = ref("");
const register = ref(false);

// PARA USUARIOS ACTUALES
const username = ref("");
const pass = ref("");

const registerWithPass = async () => {
  try {
    enviando.value = true;
    const { data: ip } = await axios.get(getIp);
    let credenciales;
    if (localStorage.getItem("usuario") === null) {
      credenciales = {
        username: username.value,
        pass: pass.value,
        ip: ip.ip,
      };
    } else {
      credenciales = {
        username: user_tmp.value,
        pass: clave.value,
        ip: dir.ip,
      };
    }
    const { data: req } = await axios.post(authRegister, credenciales);
    if (req.status === "OK") {
      register.value = true;
    } else {
      alert(req.message);
    }
  } catch (error) {
    console.log(error);
  } finally {
    enviando.value = false;
  }
};

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
      router.push("/");
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div
    class="fixed w-full h-full bg-black/[.5] top-0 left-0 flex items-center justify-center"
    v-if="enviando"
  >
    <div
      class="flex items-center justify-center text-white bg-[#263238] w-[90%] h-[60%] p-4 text-xl"
    >
      <font-awesome-icon :icon="['fas', 'spinner']" class="mr-2 fa-pulse" />
      Procesando datos...
    </div>
  </div>

  <div>
    <div>
      <div class="p-5 bg-gray-100 rounded-md shadow-md">
        <h2 class="mb-3 text-lg font-semibold">
          Instrucciones para el registro:
        </h2>

        <ol class="pl-5 list-decimal">
          <li class="mb-2">
            <span class="font-bold">Nombre de usuario:</span>
            <ul class="pl-5 list-disc">
              <li>Puede contener letras, números y espacios.</li>
              <li>Por ejemplo: "John Doe 123"</li>
            </ul>
          </li>

          <li class="mb-2">
            <span class="font-bold">Contraseña:</span>
            <ul class="pl-5 list-disc">
              <li>Debe tener al menos 6 caracteres de longitud.</li>
              <li>
                Puede incluir cualquier combinación de letras, números y
                símbolos.
              </li>
            </ul>
          </li>

          <li class="mb-2">
            Asegúrate de que tu contraseña sea única y no la compartas con
            nadie.
          </li>
          <li>
            Una vez que hayas completado todos los campos, haz clic en el botón
            "Crear cuenta" para continuar.
          </li>
        </ol>
      </div>

      <div class="p-4">
        <label
          class="block mb-2 text-xs font-bold tracking-wide text-black uppercase"
          for="grid-last-name"
        >
          NOMBRE DE USUARIO:
        </label>
        <input
          class="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          type="text"
          placeholder="INGRESA UN USUARIO"
          autocomplete="off"
          v-model="username"
          required
        />

        <p class="pt-2 mb-4 text-xs font-light text-gray-400">
          <font-awesome-icon :icon="['fas', 'info-circle']" /> Usa un nombre
          adecuado.
        </p>

        <label
          class="block mb-2 text-xs font-bold tracking-wide text-black uppercase"
          for="grid-last-name"
        >
          CREA UNA CONTRASEÑA:
        </label>
        <input
          class="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          type="password"
          placeholder="INGRESA UNA CONTRASEÑA"
          autocomplete="off"
          v-model="pass"
          required
        />
        <p class="pt-2 text-xs font-light text-gray-400">
          <font-awesome-icon :icon="['fas', 'info-circle']" /> No debes olvidar
          esta contraseña.
        </p>
        <input
          type="submit"
          class="w-full px-4 py-2 mt-4 font-bold text-white border rounded bg-[#455A64] hover:bg-[#37474F] border-[#303E46] shadow-md"
          @click="registerWithPass"
          value="CREAR CUENTA"
        />
      </div>
    </div>
  </div>
  <div class="flex items-center justify-between w-full py-5">
    <hr class="w-full bg-gray-400" />
    <p class="text-base font-medium leading-4 px-2.5 text-gray-400">O</p>
    <hr class="w-full bg-gray-400" />
  </div>
  <button
    class="flex gap-2 px-4 py-2 mx-auto mb-8 transition duration-150 border rounded-lg border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow"
    @click.prevent="login"
  >
    <img
      class="w-6 h-6"
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      loading="lazy"
      alt="google logo"
    />
    <span>Registrarme con Google</span>
  </button>
  <div
    class="bg-black/[.5] fixed top-0 left-0 w-full h-full z-30 flex items-center justify-center"
    v-if="register"
  >
    <div class="bg-white w-[90%]">
      <h1
        class="p-4 text-sm font-bold text-gray-700 border-b border-solid border-[#ddd]"
      >
        CREAR CUENTA
      </h1>
      <p class="p-4 text-gray-700">
        🎉 Cuenta creada con exito, a continuacion te mandaremos a que inicies
        sesion.
      </p>
      <div class="border-t border-solid border-[#ddd] flex justify-end p-4">
        <a
          href="/login#login"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg"
          >Iniciar sesion</a
        >
      </div>
    </div>
  </div>
</template>
