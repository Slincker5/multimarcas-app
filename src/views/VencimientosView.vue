<script setup>
import { ref, onMounted, nextTick, watch, watchEffect, computed } from "vue";
import axios from "axios";
import { useMethodLabel } from "@/composables/methodLabel";
import { useGetRoutes } from "../composables/getRoutes";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

const usuario = ref(localStorage.getItem("usuario"));
const token = ref(localStorage.getItem("token"));

const { formatearDescription, formatearDescriptionMinusculas } =
    useMethodLabel();
const { searchLabel, labelCreate, labelList } = useGetRoutes();

const frmCintillo = ref(null);

// variables reactivas del formulario
const codeReader = new BrowserMultiFormatReader();
let selectedDeviceId;
const scan = ref(false);
const encontrado = ref(false);
const barra = ref("");
const descripcion = ref("");
const cantidad = ref("");
const precio = ref("");
const fecha = ref("");
const total = ref("");
const estadoTexto = ref(true);
const aviso = ref(localStorage.getItem("aviso"));

const toggleMayMin = () => {
    estadoTexto.value === true
        ? (estadoTexto.value = false)
        : (estadoTexto.value = true);
};

const handleInput = (e) => {
    const cursorPosition = e.target.selectionStart;
    const originalLength = descripcion.value.length;
    descripcion.value = estadoTexto.value
        ? formatearDescription(e.target.value)
        : formatearDescriptionMinusculas(e.target.value);

    // Calcula el cambio en la longitud del texto para ajustar la posición del cursor
    const newLength = descripcion.value.length;
    const lengthDiff = newLength - originalLength;

    nextTick(() => {
        e.target.setSelectionRange(
            cursorPosition + lengthDiff,
            cursorPosition + lengthDiff
        );
    });
};
watch(estadoTexto, (nuevoValor, valorAnterior) => {
    if (nuevoValor) {
        // Si `nuevoValor` es true, aplicar una transformación
        descripcion.value = formatearDescription(descripcion.value);
    } else {
        // Si `nuevoValor` es false, aplicar otra transformación
        descripcion.value = formatearDescriptionMinusculas(descripcion.value);
    }
});

onMounted(() => {
    codeReader
        .listVideoInputDevices()
        .then((videoInputDevices) => {
            selectedDeviceId =
                videoInputDevices[videoInputDevices.length - 1].deviceId;
        })
        .catch((err) => {
            console.error(err);
        });
});

const startScanner = async () => {
    scan.value = true;
    codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        "video",
        async (res, err) => {
            if (res) {
                resetScanner();
                try {
                    const { data } = await axios.get(`${searchLabel}${res.text}`, {
                        headers: {
                            Authorization: `Bearer ${token.value}`,
                        },
                    });
                    audioPlayer.play();

                    barra.value = res.text;
                    if (data.length === 0) {
                        encontrado.value = true;
                        descripcion.value = "";
                        precio.value = "";
                        fecha.value = "";
                    } else {
                        encontrado.value = false;
                        descripcion.value = estadoTexto.value
                            ? formatearDescription(data[0].descripcion)
                            : formatearDescriptionMinusculas(data[0].descripcion);
                        precio.value = data[0].precio == null ? "" : data[0].precio;
                        fecha.value = data[0].fecha == null ? "" : data[0].fecha;
                    }
                } catch (error) {
                    console.log(error);
                }
            } else if (err && !(err instanceof NotFoundException)) {
                console.log(err);
            }
        }
    );
};

const resetScanner = () => {
    scan.value = false;
    codeReader.reset();
};

const reestablecerFormulario = () => {
    frmCintillo.value.reset();
    barra.value = "";
    descripcion.value = "";
    cantidad.value = "";
    precio.value = "";
};
</script>
<template>
    <div>
        <form class="p-4">
            <audio class="hidden" id="audioPlayer">
                <source src="../../public/beep.mp3" type="audio/mp3" />
                Tu navegador no soporta el elemento de audio.
            </audio>
            <div class="mb-6">
                <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase" for="barra">
                    CODIGO DE BARRA:
                </label>

                <div class="flex items-stretch justify-between border border-solid border-[#ddd] focus:border-gray-500">
                    <input
                        class="flex-grow px-4 py-3 leading-tight text-gray-700 border-0 rounded-l appearance-none focus:outline-none focus:bg-white"
                        id="barra" type="text" placeholder="Ej. 1234567890123" autocomplete="off" v-model="barra" />
                    <div>
                        <a class="flex items-center justify-center h-full px-4 leading-tight text-gray-700 bg-gray-200 border rounded-r"
                            @click.prevent="resetScanner">
                            <img src="../../public/barcode.png" class="w-[25px] block" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="mb-6">
                <label
                    class="flex items-center justify-between mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                    for="descripcion">
                    DESCRIPCIÓN DEL PRODUCTO:
                    <button class="text-sm" :class="estadoTexto
                        ? 'text-sky-600 font-medium'
                        : 'text-gray-400  font-normal'
                        " @click.prevent="toggleMayMin">
                        May.
                    </button>
                </label>
                <textarea
                    class="block w-full px-4 py-3 leading-tight text-gray-700 border border-solid border-[#ddd] rounded appearance-none focus:outline-none focus:border-gray-500"
                    id="descripcion" placeholder="DESCRIPCIÓN COMPLETA" autocomplete="off" v-model="descripcion"
                    @input="handleInput" required></textarea>
            </div>
        </form>
    </div>
</template>