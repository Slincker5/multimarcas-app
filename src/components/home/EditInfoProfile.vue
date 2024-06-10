<script setup>
import CargandoFrom from "@/components/globales/CargandoForm.vue";
defineProps(["userData", "modalEditProfileInfo", "guardando"]);
const emit = defineEmits(["editarPerfil", "backEditProfileInfo"])
const nombre = defineModel("nombre");
const apellido = defineModel("apellido");
const telefono = defineModel("telefono");
//const emit = defineEmits(["atrasPerfil", "cambiarFoto"]);
</script>
<template>
    <!-- div que muestra la edicion del perfil -->
    <Transition>
        <div class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-black/90"
            v-if="modalEditProfileInfo">
            <div class="bg-white w-[80%] md:w-[450px] max-w-screen-sm rounded-lg shadow-2xl">
                <CargandoFrom :enviando="guardando" :textoCarga="' Guardando informacion..'"></CargandoFrom>
                <h3 class="p-4 font-medium flex item-center justify-between">
                    <button @click.prevent="emit('backEditProfileInfo')"><font-awesome-icon
                            :icon="['fas', 'arrow-left']" /></button>
                    EDITAR MI PERFIL
                </h3>

                <form @submit.prevent="emit('editarPerfil')">
                    <div class="p-4">
                        <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase" for="nombre">
                            NOMBRE:
                        </label>
                        <input type="text"
                            class="block w-full px-4 py-3 leading-tight text-gray-700 border border-solid border-[#ddd] rounded appearance-none focus:outline-none focus:border-gray-500"
                            id="nombre" autocomplete="off" placeholder="Nombre completo" v-model="nombre">
                    </div>
                    <div class="p-4 pt-2">
                        <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                            for="apellido">
                            APELLIDO:
                        </label>
                        <input type="text"
                            class="block w-full px-4 py-3 leading-tight text-gray-700 border border-solid border-[#ddd] rounded appearance-none focus:outline-none focus:border-gray-500"
                            id="apellido" autocomplete="off" placeholder="Apellido completo" v-model="apellido">
                    </div>

                    <div class="p-4 pt-2">
                        <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase" for="nombre">
                            NUMERO TELEFONICO:
                        </label>
                        <input type="text"
                            class="block w-full px-4 py-3 leading-tight text-gray-700 border border-solid border-[#ddd] rounded appearance-none focus:outline-none focus:border-gray-500"
                            id="nombre" autocomplete="off" inputmode="numeric" placeholder="Ej. 12345678"
                            v-model="telefono">
                    </div>

                    <div class="p-4"><input type="submit"
                            class="py-2 px-6 font-medium text-white bg-[#252525] inline-block shadow-md shadow-black/30 rounded-md w-full"
                            value="GUARDAR INFORMACION"></div>
                </form>
            </div>
        </div>
    </Transition>
</template>
