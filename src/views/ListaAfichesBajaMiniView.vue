<script setup>
import { ref } from 'vue'
import axios from 'axios'
import PaginateCintillos from '@/components/cintillos/PaginateCintillos.vue'
import { useGetRoutes } from "@/composables/getRoutes";

  const datos = ref([])
  const total = ref(null)
  const { posterSmallBajaList } =  useGetRoutes()

  
  
  const token = ref(localStorage.getItem('token'))
  const getData = async () => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + token.value,
        'Content-Type': 'application/json'
}
      const { data } = await axios.get(posterSmallBajaList, { headers })
      total.value = data.length
      let uniqueData = data.filter((v,i,a)=>a.findIndex(t=>(t.descripcion === v.descripcion))===i);
      datos.value = uniqueData
    } catch (error) {
      console.log(error)
    }
  }
  getData()
  
  
  let postXpagina = 6
  const inicio = ref(0)
  const fin = ref(6)
  
  const siguiente = () => {
    inicio.value += postXpagina
    fin.value += postXpagina
  }
  const anterior = () => {
    inicio.value -= postXpagina
    fin.value -= postXpagina
  }
  
  
</script>
<template>
  <div class="p-4">
    
    <div v-if="total > 0">
      <h1 class="mb-3 font-bold text-gray-800">GENERAR DOCUMENTO</h1>
      
      <div class="flex items-center justify-between mb-3">
        <div class="text-sm text-gray-400"><font-awesome-icon :icon="['fas', 'gear']" class="fa-spin"/>Llevas {{ total }}/<span class="text-red-400">90</span></div>
        <router-link to="/enviar-afiches-baja-mini"
        class="inline-flex items-center px-4 py-2 text-sm font-medium rounded text-white bg-[#2E3239] hover:bg-[#37474F] border border-solid border-[#303E46] shadow-lg">
        <font-awesome-icon :icon="['fas', 'download']" />
        ENVIAR CORREO
      </router-link>

      </div>
      
    </div>

    <h1 class="mb-3 font-bold text-gray-800">LISTADO DE AFICHES</h1>
    <div class="flex items-center justify-center text-2xl font-light text-gray-500 h-52" v-if="datos.length === 0">
      <font-awesome-icon :icon="['fas', 'face-sad-cry']" /> Aun no has agregado datos..
    </div>
    <!-- component -->
    <div class="w-full">
      <div class="flex justify-center">
        <div class="w-full max-w-md">
          <div class="bg-white shadow-md">
            
            <div class="text-sm border border-b-0 border-gray-200 border-solid" v-for="item in datos.slice(inicio, fin)">
              <div
                class="text-gray-700">
                
                <div class="p-4 font-medium">{{ item.descripcion }} </div>
                 <div class="flex items-center justify-between p-2">
                <div><b class="font-bold text-black">CANTIDAD:</b> {{ item.cantidad }}</div>
                <div><b class="font-bold text-black">PRECIO:</b> {{ item.precio }}</div>
              </div>
              </div>
              
            </div>
            <!-- aqui btn -->
            <PaginateCintillos :inicio="inicio" :fin="fin" :maxLength="datos.length" @siguiente="siguiente"
              @anterior="anterior"></PaginateCintillos>
            
          </div>
        </div>
      </div>
    </div>
  </div>
  
 
</template>