<script setup>
  defineProps(['inicio', 'fin', 'maxLength'])
</script>
<template>
  <div class="flex justify-end mt-4">
    <button class="px-4 py-2 font-medium text-gray-700 hover:text-gray-600 didsabled:cursor-not-allowed disabled:opacity-80" @click="$emit('anterior')"
      :disabled="inicio <= 0">
      Anterior
    </button>
    <button class="px-4 py-2 font-medium text-gray-700 hover:text-gray-600 didsabled:cursor-not-allowed disabled:opacity-80" @click="$emit('siguiente')"
      :disabled="fin >= maxLength">
      Siguiente
    </button>
  </div>
  
</template>