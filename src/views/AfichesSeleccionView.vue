<script setup>
</script>
<template>
    <h1 class="flex items-center justify-between p-4 font-medium text-gray-800">
    <router-link to="/"
      ><font-awesome-icon :icon="['fas', 'chevron-left']" /> VOLVER</router-link
    >
    <span>TIPOS DE AFICHES</span>
  </h1>

  <div class="flex items-center justify-between bg-gray-100">
    <div class="p-4">
       <img src="../../public/rotulo-uno.png" alt="afiche-uno" class="block"> 
       <router-link to="/crear-afiches" class="mt-4 flex justify-between text-sm sm:text-base w-full px-4 py-2 font-bold text-white border rounded bg-[#2E3239] hover:bg-[#37474F] border-[#303E46] shadow-md">COMENZAR <font-awesome-icon :icon="['fas', 'arrow-right']" /></router-link>
       
    </div>
    <div class="p-4">
        <img src="../../public/rotulo-dos.png" alt="afiche-dos" class="block">
        
       <router-link to="/crear-afiches-mini" class="mt-4 flex justify-between text-sm sm:text-base w-full px-4 py-2 font-bold text-white border rounded bg-[#2E3239] hover:bg-[#37474F] border-[#303E46] shadow-md">COMENZAR <font-awesome-icon :icon="['fas', 'arrow-right']" /></router-link> 
    </div>

    <div class="p-4">
        <img src="../../public/baja.jpg" alt="afiche-dos" class="block">
        
       <router-link to="/crear-afiches-baja-mini" class="mt-4 flex justify-between text-sm sm:text-base w-full px-4 py-2 font-bold text-white border rounded bg-[#2E3239] hover:bg-[#37474F] border-[#303E46] shadow-md">COMENZAR <font-awesome-icon :icon="['fas', 'arrow-right']" /></router-link> 
    </div>
  </div>

  <div class="p-4 bg-amber-100">Recuerda en cada formulario de creacion de afiches puedes visualizar como te va quedando el afiche.</div>
  
</template>