<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { signInWithPhoneNumber } from "firebase/auth";
import { useGetRoutes } from "@/composables/getRoutes";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

//rutas de formularios

const { authValidarEmail, authRegisterN, authValidarTelefono } = useGetRoutes();
//datos del registro
const telefono = ref("");
const nombre = ref("");
const apellido = ref("");
const email = ref("");
const pass = ref("");
const ip = ref("");
const buttonDatosPersonales = ref(true);
const buttonEnviarCodigo = ref(true);
const buttonSendCode = ref(true);
const buttonPass = ref(true);
const textButtonEnviarCodigo = ref("Enviar codigo");
// varibales del codigo firebase
const codigo = ref("");
const validarCodigoModal = ref("top-[-100%]");
const modalDatosPersonales = ref("top-[-100%]");
const modalPass = ref("top-[-100%]");
let number = ref("");
let validar;

// funciones
const redireccionar = (url) => {
  window.location.href = url;
};

async function validarEmail(email) {
  try {
    const param = {
      email: email,
    };
    const { data } = await axios.post(authValidarEmail, param);
    if (data === 0) {
      buttonDatosPersonales.value = false;
    } else if (data.status === "error") {
      toast.error(data.message, {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    } else {
      buttonDatosPersonales.value = true;
      toast.error("No puedes usar este correo porque ya esta registrado.", {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
async function validarTelefono(telefono) {
  try {
    const param = {
      email: telefono,
    };
    const { data } = await axios.post(authValidarTelefono, param);
    if (data === 0) {
      buttonEnviarCodigo.value = false;
    } else {
      buttonEnviarCodigo.value = true;
      toast.error("No puedes usar este telefono porque ya esta registrado.", {
        theme: "colored",
        autoClose: 1500,
        position: toast.POSITION.BOTTOM_LEFT,
        transition: toast.TRANSITIONS.ZOOM,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
const activarButtonEnviarCodigo = () => {
  if (number.value.toString().length < 8) {
    buttonEnviarCodigo.value = true;
  } else {
    validarTelefono(number.value);
  }
};

const activarButtonSendCode = () => {
  if (codigo.value.toString().length < 6) {
    buttonSendCode.value = true;
  } else {
    buttonSendCode.value = false;
  }
};

const activarButtonPass = () => {
  if (pass.value.length < 8) {
    buttonPass.value = true;
  } else {
    buttonPass.value = false;
  }
};
const buttonSiguiente = () => {
  if (nombre.value === "" || apellido.value === "" || email.value === "") {
    buttonDatosPersonales.value = true;
    toast.error("Debes llenar todos los campos.", {
      theme: "colored",
      autoClose: 1500,
      position: toast.POSITION.BOTTOM_LEFT,
      transition: toast.TRANSITIONS.ZOOM,
    });
  } else {
    modalPass.value = "top-[0%]";
  }
};

const validarInput = () => {
  if (nombre.value === "" || apellido.value === "" || email.value === "") {
    buttonDatosPersonales.value = true;
  } else {
    buttonDatosPersonales.value = false;
  }
};
async function getOriginFromIPAPI() {
  try {
    const { data } = await axios.get("https://ipapi.co/json/");
    ip.value = data.ip;
  } catch (error) {
    console.error("Error obteniendo el origin desde IPAPI:", error);
    return "unknown";
  }
}
getOriginFromIPAPI();

const registro = async () => {
  try {
    const param = {
      nombre: nombre.value,
      apellido: apellido.value,
      correo: email.value,
      telefono: telefono.value,
      pass: pass.value,
      ip: ip.value,
    };
    const { data } = await axios.post(authRegisterN, param);
    if (data.status === "OK") {
      toast.success(data.message, {
      theme: "colored",
      autoClose: 1500,
      position: toast.POSITION.BOTTOM_LEFT,
      transition: toast.TRANSITIONS.ZOOM,
    });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_uuid", data.user_uuid);
      localStorage.setItem("usuario", data.username === null ? data.nombre + ' ' + data.apellido : data.username);
      localStorage.setItem("email", data.email);
      localStorage.setItem("photo", data.photo);
      localStorage.setItem("rol", data.rol);
      redireccionar("/");
    }
  } catch (error) {
    console.error(error);
  }
};
// codigo firebase
const firebaseConfig = {
  apiKey: "AIzaSyB0z01S4THMA_8x6jKtV1OodLHXs0J9kZ8",
  authDomain: "multimarcasapp-2fa97.firebaseapp.com",
  projectId: "multimarcasapp-2fa97",
  storageBucket: "multimarcasapp-2fa97.appspot.com",
  messagingSenderId: "732835844626",
  appId: "1:732835844626:web:d5fd4d29dd760b66bd7ecb",
  measurementId: "G-0SQH2EVZX3",
};
initializeApp(firebaseConfig);
const auth = getAuth();

const signInButtonHandler = async () => {
  buttonEnviarCodigo.value = true;
  textButtonEnviarCodigo.value = "Enviando codigo..";
  const numberCode = "+503" + number.value;
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "signinbutton", {
    size: "invisible",
    callback: (response) => {
      onSignInSubmit();
    },
  });

  var appVerifier = window.recaptchaVerifier;

  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      numberCode,
      appVerifier
    );
    validarCodigoModal.value = "top-0";
    validar = () => {
      confirmationResult
        .confirm(codigo.value)
        .then((result) => {
          const numero = result.user.phoneNumber;
          if (numero !== null) {
            telefono.value = numero;
            console.log(telefono);
            modalDatosPersonales.value = "top-0";
          }
        })
        .catch((error) => {
          if (error.code === "auth/invalid-verification-code") {
            toast.error("El codigo ingresado no es valido", {
              theme: "colored",
              autoClose: 1500,
              position: toast.POSITION.BOTTOM_LEFT,
              transition: toast.TRANSITIONS.ZOOM,
            });
          }
        });
    };
  } catch (error) {
    console.error("Error al enviar el código de verificación:", error.code);
    if (error.code === "auth/too-many-requests") {
      toast.error(
        "Demasiados intentos. Esperando antes de volver a intentar.",
        {
          theme: "colored",
          autoClose: 1500,
          position: toast.POSITION.BOTTOM_LEFT,
          transition: toast.TRANSITIONS.ZOOM,
        }
      );
    }
    if (error.code === "auth/invalid-phone-number") {
      toast.error(
        "El numero ingresado no es valido, verifica que solo tenga 8 digitos",
        {
          theme: "colored",
          autoClose: 1500,
          position: toast.POSITION.BOTTOM_LEFT,
          transition: toast.TRANSITIONS.ZOOM,
        }
      );
    }
    window.recaptchaVerifier.render().then(function (widgetId) {
      grecaptcha.reset(widgetId);
    });
  } finally {
    textButtonEnviarCodigo.value = "Enviar codigo";
  }
};

const borderFocus = ref("border-[#aaa] border-b");
const cambiarBorde = () => {
  borderFocus.value = "border-[#4844AB] border-b-[2px]";
};
const quitarBorde = () => {
  borderFocus.value = "border-[#aaa]  border-b-[1px]";
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
  <!-- ENVIO DEL CODIGO DE CONFIRMACION -->
  <div class="fixed top-0 left-0 z-20 w-full h-full transition bg-white">
    <h1 class="p-4 py-6 pb-0 text-base font-medium text-black uppercase">
      Crear cuenta
    </h1>
    <div class="p-4 text-sm text-gray-500">Pasos del registro</div>
    <div class="p-4">
      <div class="flex items-center justify-between bg-gray-500 h-[2px] mb-2">
        <div
          class="bg-[#4844AB] text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          1
        </div>
        <div
          class="bg-gray-500 text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          2
        </div>
        <div
          class="bg-gray-500 text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          3
        </div>
      </div>
    </div>
    <h2 class="p-4 text-base font-medium text-black">
      Validar numero telefonico
    </h2>

    <div class="p-4">
      <div
        class="flex items-center justify-between w-full transition duration-300 border-solid"
        :class="`${borderFocus}`"
      >
        <div class="inline-block text-xl text-gray-600">+503</div>
        <input
          type="number"
          class="block w-full px-2 py-3 text-xl bg-transparent outline-none placeholder:text-gray-500"
          placeholder="Numero telefonico"
          v-model="number"
          id="number"
          @focus="cambiarBorde"
          @blur="quitarBorde"
          @input="activarButtonEnviarCodigo"
        />
      </div>
      <p id="recaptcha-container"></p>
      <button
        class="transition py-3 px-4 bg-[#1b126d] text-white mt-6 text-sm w-full disabled:bg-[#8481d6]"
        :disabled="buttonEnviarCodigo"
        id="signinbutton"
        @click="signInButtonHandler"
      >
        {{ textButtonEnviarCodigo }}
      </button>
    </div>
  </div>

  <!-- PASO UNO VALIDACION DEL NUMERO TELEFONICO -->
  <div
    class="fixed left-0 z-30 w-full h-full transition bg-white"
    :class="`${validarCodigoModal}`"
  >
    <h1 class="p-4 py-6 pb-0 text-base font-medium text-black uppercase">
      Crear cuenta
    </h1>
    <div class="p-4 text-sm text-gray-500">Pasos del registro</div>
    <div class="p-4">
      <div class="flex items-center justify-between bg-gray-500 h-[2px] mb-2">
        <div
          class="bg-[#4844AB] text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          1
        </div>
        <div
          class="bg-gray-500 text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          2
        </div>
        <div
          class="bg-gray-500 text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          3
        </div>
      </div>
    </div>
    <h2 class="p-4 text-base font-medium text-black">Ingresa el codigo:</h2>
    <p class="px-4 text-sm text-gray-500">
      Se envio un codigo a tu numero de telefono ingresalo para contimuar con el
      registro
    </p>

    <div class="p-4">
      <div
        class="flex items-center justify-between w-full transition duration-300 border-solid"
        :class="`${borderFocus}`"
      >
        <input
          type="text"
          class="block w-full px-2 py-3 text-xl text-center bg-transparent outline-none placeholder:text-gray-500"
          placeholder="Digita el codigo"
          v-model="codigo"
          inputmode="numeric"
          @input="activarButtonSendCode"
          @focus="cambiarBorde"
          @blur="quitarBorde"
        />
      </div>
      <p id="recaptcha-container"></p>
      <button
        class="transition py-3 px-4 bg-[#1b126d] text-white mt-6 text-sm w-full disabled:bg-[#6a67bb]"
        :disabled="buttonSendCode"
        @click="validar"
      >
        Validar mi numero
      </button>
    </div>
  </div>

  <div
    class="fixed left-0 z-40 w-full h-full transition bg-white"
    :class="`${modalDatosPersonales}`"
  >
    <h1 class="p-4 py-6 pb-0 text-base font-medium text-black uppercase">
      Crear cuenta
    </h1>
    <div class="p-4 text-sm text-gray-500">Pasos del registro</div>
    <div class="p-4">
      <div class="flex items-center justify-between mitad h-[2px] mb-2">
        <div
          class="bg-[#4844AB] text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          1
        </div>
        <div
          class="bg-[#4844AB] text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          2
        </div>
        <div
          class="bg-gray-500 text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          3
        </div>
      </div>
    </div>
    <h2 class="p-4 text-base font-medium text-black">Datos personales.</h2>

    <div class="p-4">
      <div
        class="flex items-center justify-between border border-solid border-[#ddd]"
      >
        <div class="px-4 py-3 bg-gray-200 text-neutral-600">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>
        <input
          class="block w-full px-4 py-3 outline-none appearance-none focus:text-neutral-900 focus:font-medium text-neutral-500 placeholder:text-neutral-500"
          type="text"
          placeholder="Nombre"
          v-model="nombre"
          autocomplete="off"
          @input="validarInput"
          required
        />
      </div>
      <div
        class="flex items-center justify-between border border-solid border-[#ddd] mt-6"
      >
        <div class="px-4 py-3 bg-gray-200 text-neutral-600">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>
        <input
          class="block w-full px-4 py-3 outline-none appearance-none focus:text-neutral-900 focus:font-medium text-neutral-500 placeholder:text-neutral-500"
          type="text"
          placeholder="Apellido"
          v-model="apellido"
          autocomplete="off"
          @input="validarInput"
          required
        />
      </div>

      <div
        class="flex items-center justify-between border border-solid border-[#ddd] mt-6"
      >
        <div class="px-4 py-3 bg-gray-200 text-neutral-600">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>

        <input
          class="block w-full px-4 py-3 outline-none appearance-none focus:text-neutral-900 focus:font-medium text-neutral-500 placeholder:text-neutral-500"
          type="text"
          placeholder="Correo electronico"
          v-model="email"
          @change="validarEmail(`${email}`)"
          autocomplete="off"
          required
        />
      </div>
      <button
        class="transition py-3 px-4 bg-[#1b126d] text-white mt-6 text-sm w-full disabled:bg-[#6a67bb]"
        @click="buttonSiguiente"
        :disabled="buttonDatosPersonales"
      >
        Siguiente
      </button>
    </div>
  </div>

  <div
    class="fixed left-0 z-50 w-full h-full transition bg-white"
    :class="`${modalPass}`"
  >
    <h1 class="p-4 py-6 pb-0 text-base font-medium text-black uppercase">
      Crear cuenta
    </h1>
    <div class="p-4 text-sm text-gray-500">Pasos del registro</div>
    <div class="p-4">
      <div class="flex items-center justify-between bg-[#4844AB] h-[2px] mb-2">
        <div
          class="bg-[#4844AB] text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          1
        </div>
        <div
          class="bg-[#4844AB] text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          2
        </div>
        <div
          class="bg-[#4844AB] text-center text-white p-2 w-[20px] h-[20px] flex items-center justify-center"
        >
          3
        </div>
      </div>
    </div>
    <h2 class="p-4 text-base font-medium text-black">Crea una contraseña.</h2>
    <p class="px-4 text-sm text-gray-500">
      La contraseña debe tener al menos 8 caracteres, ya sean letras o numeros.
    </p>
    <div class="p-4">
      <div
        class="flex items-center justify-between border border-solid border-[#ddd]"
      >
        <div class="px-4 py-3 bg-gray-200 text-neutral-600">
          <font-awesome-icon :icon="['fas', 'key']" />
        </div>
        <input
          class="block w-full px-4 py-3 outline-none appearance-none focus:text-neutral-900 focus:font-medium text-neutral-600 placeholder:text-neutral-500"
          type="password"
          placeholder="Crea una contraseña"
          autocomplete="off"
          v-model="pass"
          @input="activarButtonPass"
          id="inputPass"
          required
        />
        <a
          href="#"
          class="px-4 py-3 bg-white text-neutral-600"
          @click.prevent="showPass"
        >
          <font-awesome-icon :icon="['fas', 'eye-slash']" v-if="statusPass" />
          <font-awesome-icon :icon="['fas', 'eye']" v-else />
        </a>
      </div>
      <button
        class="transition py-3 px-4 bg-[#1b126d] text-white mt-6 text-sm w-full disabled:bg-[#6a67bb]"
        :disabled="buttonPass"
        @click="registro"
      >
        Terminar registro
      </button>
    </div>
  </div>
</template>

<style>
body {
  background-color: #fff;
}
.mitad {
  background: linear-gradient(90deg, #4844ab 50%, #718096 50%);
}
</style>
