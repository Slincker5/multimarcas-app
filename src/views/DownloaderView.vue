<script setup>
import { ref } from 'vue'
import axios from 'axios'
const busqueda = ref("")
const resultados = ref([])

const buscar = async() => {
    try {
        const { data } = await axios.get(`https://api.multimarcas.app/api/youtube/search/${busqueda.value}`)
        resultados.value = data.result
    } catch(error) {
        console.log(error)
    }
}

</script>
<template>
    <div class="overflow-y-scroll">
        <h2 class="p-4 pb-0 font-medium text-white uppercase bg-black">Descarga Musica Gratis</h2>
        <form class="p-4 py-8 pt-5 bg-black" @submit.prevent="buscar">
            <input type="text" class="block w-full px-4 py-2 font-medium transition-all rounded-md outline-none focus:shadow-lg bg-white/70 placeholder:text-black placeholder:font-medium focus:shadow-cyan-500/20" placeholder="Escribe tu busqueda musical.." v-model="busqueda">
            <input type="submit" class="block w-full py-2 mt-6 text-center text-white bg-blue-700 rounded-md" value="Buscar cancion">
        </form>
        
        <div class="p-4">
            <div class="border border-solid border-[#ddd]" v-for="song in resultados" :key="song.id">
                <div class="font-medium truncate block p-4 border-b border-dashed border-[#ddd]">{{  song.title }}</div>
                <div class="flex items-center justify-between p-4">
                    <div><b class="font-medium">Duracion:</b> {{ song.duration }}</div>
                </div>
            </div>
        </div>
    </div>
</template>