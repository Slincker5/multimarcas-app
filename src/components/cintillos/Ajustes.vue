<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { useGetRoutes } from "@/composables/getRoutes";
const props = defineProps(["checke"]);
const emit = defineEmits(['closeCog']);
const token = ref(localStorage.getItem("token"));
const { labelScanner } = useGetRoutes();

// Definimos una variable reactiva para el estado del checkbox
const isChecked = ref(false);
const isLoading = ref(false); // Variable reactiva para manejar el estado de carga

// Computed para obtener el estado del checkbox en forma legible
const isActive = computed(() => isChecked.value ? 1 : 0);

// Inicializamos isChecked con el valor de checke cuando el componente se monta
onMounted(() => {
    isChecked.value = props.checke === 1;
});

// Función para enviar una petición si el checkbox está activo
const sendActiveRequest = async () => {
    isLoading.value = true;
    try {
        const headers = {
            Authorization: "Bearer " + token.value,
            "Content-Type": "application/json",
        };
        const dataScan = {
            scanner: isActive.value
        };
        const { data } = await axios.post(labelScanner, dataScan, { headers });
        console.log(data);
    } catch (error) {
        console.error('Error en la petición activa:', error);
    } finally {
        isLoading.value = false;
    }
};

// Función para enviar una petición si el checkbox no está activo
const sendInactiveRequest = async () => {
    isLoading.value = true;
    try {
        const headers = {
            Authorization: "Bearer " + token.value,
            "Content-Type": "application/json",
        };
        const dataScan = {
            scanner: isActive.value
        };
        const { data } = await axios.post(labelScanner, dataScan, { headers });
        console.log(data);
    } catch (error) {
        console.error('Error en la petición inactiva:', error);
    } finally {
        isLoading.value = false;
    }
};

// Observador para isChecked
watch(isChecked, async (newValue) => {
    if (isLoading.value) {
        return; // Evitar enviar peticiones si una está en curso
    }
    if (newValue) {
        await sendActiveRequest();
    } else {
        await sendInactiveRequest();
    }
});
</script>

<template>
    <div class="bg-black/40 fixed top-0 left-0 w-full h-full z-4 flex items-center justify-center">
        <div class="bg-white rounded-md shadow-md shadow-black/70 w-[90%] p-4">
            <h3 class="font-medium text-base text-black uppercase pb-2">
                <button class="pr-4" @click.prevent="emit('closeCog')">
                    <font-awesome-icon :icon="['fas', 'arrow-left']" />
                </button>
                CONFIGURACION CINTILLOS
            </h3>

            <div class="inline-flex items-center">
                <div class="relative inline-block w-[3.2rem] h-4 -mt-5 rounded-full cursor-pointer border border-[#ddd] border-solid">
                    <input type="checkbox" id="desc" v-model="isChecked" :disabled="isLoading" ref="micheck"
                        class="absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-blue-gray-100 checked:bg-gray-900 peer-checked:border-gray-900 peer-checked:before:bg-gray-900" />
                    <label for="desc"
                        class="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-gray-900 peer-checked:before:bg-gray-900">
                        <div
                            class="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4">
                        </div>
                    </label>
                </div>
                <label for="desc" class="mt-px mb-0 ml-3 font-light text-gray-700 cursor-pointer select-none">
                    <div>
                        <p class="block font-sans text-base antialiased font-medium leading-relaxed text-gray-800 ml-2">
                            Nuevo escaner
                        </p>
                        <p class="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 ml-2">
                            Prueba el nuevo escáner o desactívalo si prefieres el anterior.
                        </p>
                    </div>
                </label>
            </div>

        </div>
    </div>
</template>
