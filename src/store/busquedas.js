import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBusquedasStore = defineStore('buscador', () => {
  
  const resultados = ref([])
  
  const busquedasEncontradas= (data) => {
    resultados.value = data
  }
  
  return {
    resultados,
    busquedasEncontradas
  }
})
