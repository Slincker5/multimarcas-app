<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'
import Footer from '@/components/Footer.vue'

const user_tmp = ref(localStorage.getItem('token'))
const route = useRoute()

const buttonText = computed(() => {
  if (route.path === '/register') return 'Inicio'
  if (route.path === '/login') return 'Crear Cuenta'
  return 'Inicio' // valor predeterminado, por si acaso
})
const buttonRoute = computed(() => {
  if (route.path === '/register') return '/login'
  if (route.path === '/login') return '/register'
  return '/' // ruta por defecto
})
</script>

<template>
  <header class="sticky top-0 flex items-center justify-between px-4 py-6 bg-[#26292B] text-[#ECF0F1] z-30">
    <h1 class="font-bold text-[#ECF0F1]">MULTIMARCAS <span class="text-[#5F7ADB]">APP</span></h1>
      <nav v-if="user_tmp !== null">
        <router-link to="/" class="mr-2" active-class="underline">Inicio</router-link>
      </nav>
      <nav v-else>
        <router-link :to="buttonRoute" class="p-2 rounded-md bg-[#5F7ADB] hover:bg-[#3f539c] transition-all">{{ buttonText }}</router-link>
      </nav>
  </header>

  <RouterView />
 <Footer></Footer> 
</template>
