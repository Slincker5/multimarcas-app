import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCintillosStore = defineStore('cintillos', () => {

  const listaCintillos = ref([])

  const cintilloDetalles = ref([])
  
  const agregarCintillos = (cintillos) => {
    listaCintillos.value = cintillos
  }

  const agregarDetallesCintillo = (info) => {
    cintilloDetalles.value = info
  }

  return { listaCintillos, agregarCintillos, cintilloDetalles, agregarDetallesCintillo }
})
