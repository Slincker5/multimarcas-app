<script setup>
defineProps(["modalProfile"]);
const emit = defineEmits(["atrasPerfil", "cambiarFoto", "openEditProfileInfo"]);
</script>
<template>
    <!-- div que muestra la edicion del perfil -->
     <Transition>
    <div class="fixed top-0 left-0 z-30 flex items-center justify-center w-full h-full bg-black/90" v-if="modalProfile">
        <div class="bg-white w-[80%] md:w-[450px] max-w-screen-sm rounded-lg shadow-2xl">
            <h3 class="p-4 font-medium flex item-center justify-between">
                <button @click.prevent="emit('atrasPerfil')"><font-awesome-icon :icon="['fas', 'arrow-left']" /></button>
                MI CUENTA</h3>

                <ul>
                    <li class="p-4 text-gray-900 font-medium text-sm border-b border-solid border-[#ddd]" @click.prevent="emit('cambiarFoto')">Cambiar foto<span class="block pt-[2px] text-xs text-gray-400 font-light">Cambia tu foto de perfil por una diferente.</span></li>
                    <li class="p-4 text-gray-900 font-medium text-sm border-b border-solid border-[#ddd]" @click.prevent="emit('openEditProfileInfo')">Editar mi informacion<span class="block pt-[2px] text-xs text-gray-400 font-light">Cambia tu nombre, apellido o # de tel..</span></li>
                    <li class="p-4 text-gray-900 font-medium text-sm">Cambiar contraseña<span class="block pt-[2px] text-xs text-red-500 font-light">Proximamente disponible</span></li>
                </ul>
        </div>
    </div>
    </Transition>
</template>
