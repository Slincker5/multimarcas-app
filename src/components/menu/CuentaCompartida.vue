<script setup>
defineProps(["userData", "tokenDevice"]);
const emit = defineEmits(["logout"]);
</script>
<template>
    <!-- div que muestra la suscripcion vencida -->
    <div class="fixed top-0 left-0 z-30 flex items-center justify-center w-full h-full bg-black/90" v-if="tokenDevice !== userData.profile[0].token_fcm_static">
        <div class="bg-white w-[80%] md:w-[450px] pt-6 pb-2 px-4 max-w-screen-sm rounded-lg shadow-2xl">
            <img src="../../../public/ajustes.gif" class="w-[35%] block m-auto" />
            <h3 class="pt-4 font-medium text-center text-black uppercase text-nomal">
                Cuenta en uso.
            </h3>
            <p class="py-4 pt-2 text-sm text-center text-gray-700" v-if="userData">
                <span class="pb-2 block text-sm">Solo se puede usar en un dispositivo a la vez.</span>
                <span class="text-xs">
                    Esta cuenta ya está en uso en otro dispositivo. Para garantizar tu seguridad y privacidad, no es posible acceder desde este dispositivo en este momento.</span>
            </p>
            <div class="py-4 border-y border-dashed border-[#ddd]">
                <button
                    class="block px-6 py-1 mx-auto text-sm text-center border border-solid rounded-sm shadow-lg border-neutral-700" @click.prevent="emit('logout')">
                    Cerrar sesion
                </button>
            </div>
            <a href="https://wa.me/+50374329014"
                class="block p-4 font-semibold text-center text-sky-500"><font-awesome-icon
                    :icon="['fas', 'headset']" /> Atencion al cliente</a>
        </div>
    </div>
</template>
