<script setup>
import { ref, onMounted } from 'vue'
import axios from "axios";
import { useGetRoutes } from "../composables/getRoutes";
import CargandoFrom from "@/components/globales/CargandoForm.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const { sendCodeEmail, validateCodeEmail, changePassword } = useGetRoutes();
const loading = ref(false)
const partOne = ref(true)
const partTwo = ref(false)
const partTree = ref(false)
const correo = ref('')
const code = ref('')
const pass = ref('')
const repass = ref('')
const mailLocal = ref('')

const redireccionar = (url) => {
  window.location.href = url;
};

const sendCode = async () => {
    try {
        loading.value = true
        const headers = {
            "Content-Type": "application/json",
        };
        const info = {
            email: correo.value
        }

        const { data } = await axios.post(sendCodeEmail, info, { headers })
        if (data.status === "error") {
            toast.error(data.message, {
                theme: "colored",
                autoClose: 3500,
                position: toast.POSITION.BOTTOM_LEFT,
                transition: toast.TRANSITIONS.ZOOM,
            });
        } else {
            localStorage.setItem("emailValidate", correo.value)
            mailLocal.value = localStorage.getItem('emailValidate')
            partOne.value = false
            partTwo.value = true
        }
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

const validateCode = async () => {
    try {
        loading.value = true
        const headers = {
            "Content-Type": "application/json",
        };
        const info = {
            code: code.value
        }

        const { data } = await axios.post(validateCodeEmail, info, { headers })
        if (data.status === "error") {
            toast.error(data.message, {
                theme: "colored",
                autoClose: 3500,
                position: toast.POSITION.BOTTOM_LEFT,
                transition: toast.TRANSITIONS.ZOOM,
            });
        } else {
            partTwo.value = false
            partTree.value = true
        }
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

function agregarAsteriscosCorreo(correo) {
    const indiceArroba = correo.indexOf('@');

    if (indiceArroba <= 3) {
        // Si la parte local tiene menos de 4 caracteres, devolver el correo sin cambios
        return correo;
    }

    // Obtener la parte local (antes del @) y el dominio (después del @)
    const parteLocal = correo.slice(0, indiceArroba);
    const dominio = correo.slice(indiceArroba);

    // Crear la parte local con asteriscos
    const primeraLetra = parteLocal[0];
    const ultimasDosLetras = parteLocal.slice(-2);
    const asteriscos = '**'

    const parteLocalModificada = `${primeraLetra}${asteriscos}${ultimasDosLetras}`;

    // Construir el correo con la parte local modificada
    const correoModificado = `${parteLocalModificada}${dominio}`;

    return correoModificado;
}

const showPass = (inputId) => {
    const inputPass = document.getElementById(inputId);
    if (inputPass) {
        inputPass.type = inputPass.type === "password" ? "text" : "password";
    }
};

const sendchangePassword = async () => {
    try {
        loading.value = true
        const headers = {
            "Content-Type": "application/json",
        };
        const info = {
            email: mailLocal.value,
            pass: pass.value,
            rePass: repass.value
        }

        const { data } = await axios.post(changePassword, info, { headers })
        if (data.status === "error") {
            toast.error(data.message, {
                theme: "colored",
                autoClose: 3500,
                position: toast.POSITION.BOTTOM_LEFT,
                transition: toast.TRANSITIONS.ZOOM,
            });
        } else {
            alert(data.message)
            redireccionar("/")
        }
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <div>
        <CargandoFrom :enviando="loading" :textoCarga="' Procesando peticion..'"></CargandoFrom>
        <div class="bg-gray-100" v-if="partOne">
            <h1 class="text-black font-medium text-lg p-4 uppercase">Centro de Recuperación de Contraseñas</h1>
            <p class="p-4 pt-0 leading-tight text-sm">¿Perdiste u olvidaste tu contraseña? No te preocupes. Te
                enviaremos un código de seguridad a tu correo electrónico con el que creaste la cuenta para confirmar
                que eres el titular de la
                cuenta.</p>
        </div>

        <form @submit.prevent="sendCode" v-if="partOne">
            <div class="p-4 pt-2">
                <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase" for="correo">
                    CORREO ELECTRONICO:
                </label>
                <input type="email"
                    class="block w-full px-4 py-3 leading-tight text-gray-700 border border-solid border-[#ddd] rounded appearance-none focus:outline-none focus:border-gray-500"
                    id="correo" autocomplete="off" placeholder="example@example.com" required v-model="correo">
            </div>
            <div class="p-4 pt-2"><input type="submit"
                    class="py-2 px-6 text-sm text-white bg-[#252525] inline-block shadow-md shadow-black/30 rounded-md w-full"
                    value="ENVIAR CODIGO"></div>
        </form>



        <div class="bg-gray-100" v-if="partTwo">
            <h1 class="text-black font-medium text-lg p-4 uppercase">Digita el codigo de seguridad</h1>
            <p class="p-4 pt-0 leading-tight text-sm">Enviamos un codigo al correo {{ agregarAsteriscosCorreo(mailLocal)
                }}</p>
        </div>

        <form @submit.prevent="validateCode" v-if="partTwo">
            <div class="p-4 pt-2">
                <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase" for="code">
                    CODIGO DE SEGURIDAD:
                </label>
                <input type="text"
                    class="block w-full px-4 py-3 leading-tight text-gray-700 border border-solid border-[#ddd] rounded appearance-none focus:outline-none focus:border-gray-500"
                    id="code" autocomplete="off" placeholder="XXXXXX" inputmode="numeric" required v-model="code">
            </div>
            <div class="p-4 pt-2"><input type="submit"
                    class="py-2 px-6 text-sm text-white bg-[#252525] inline-block shadow-md shadow-black/30 rounded-md w-full"
                    value="VALIDAR CODIGO"></div>
        </form>


        <div class="bg-gray-100" v-if="partTree">
            <h1 class="text-black font-medium text-lg p-4 uppercase">NUEVA CONTRASEÑA</h1>
            <p class="p-4 pt-0 leading-tight text-sm">Ya puedes cambiar a una nueva contraseña</p>
        </div>

        <form @submit.prevent="sendchangePassword" v-if="partTree">

            <div class="flex items-center justify-between border border-solid border-[#ddd] m-4 mt-8">
                <div class="px-4 py-3 bg-gray-200 text-neutral-600">
                    <font-awesome-icon :icon="['fas', 'key']" />
                </div>
                <input
                    class="block w-full px-4 py-3 outline-none appearance-none focus:text-neutral-900 focus:font-medium text-neutral-600 placeholder:text-neutral-500"
                    type="password" placeholder="Contraseña" autocomplete="off" v-model="pass" id="inputPass"
                    required />
                <a href="#" class="px-4 py-3 bg-white text-neutral-600" @click.prevent="showPass('inputPass')">

                    <font-awesome-icon :icon="['fas', 'eye']" />
                </a>
            </div>
            <div class="flex items-center justify-between border border-solid border-[#ddd] m-4 mt-6">
                <div class="px-4 py-3 bg-gray-200 text-neutral-600">
                    <font-awesome-icon :icon="['fas', 'key']" />
                </div>
                <input
                    class="block w-full px-4 py-3 outline-none appearance-none focus:text-neutral-900 focus:font-medium text-neutral-600 placeholder:text-neutral-500"
                    type="password" placeholder="Repetir contraseña" autocomplete="off" v-model="repass"
                    id="inputRePass" required />
                <a href="#" class="px-4 py-3 bg-white text-neutral-600" @click.prevent="showPass('inputRePass')">
                    <font-awesome-icon :icon="['fas', 'eye']" />
                </a>
            </div>

            <div class="p-4 pt-2"><input type="submit"
                    class="py-2 px-6 text-sm text-white bg-[#252525] inline-block shadow-md shadow-black/30 rounded-md w-full"
                    value="CAMBIAR CONTRASEÑA"></div>
        </form>
    </div>

</template>