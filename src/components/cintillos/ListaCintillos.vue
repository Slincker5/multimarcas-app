<script setup>
defineProps([
  "uuid",
  "descripcion",
  "precio",
  "cantidad",
  "fecha",
  "urlRemoveLabel",
  "token"
]);
const emit = defineEmits(["eliminar"]);
</script>
<template>
  <div class="border-t border-[#dddddd] border-solid">
    <div class="flex items-start justify-between p-4">
      <span class="flex-[1]">{{ descripcion }}</span>
      <button
        class="text-gray-900"
        @click="emit('eliminar', urlRemoveLabel, uuid, token)"
      >
        <font-awesome-icon :icon="['fas', 'trash-can']" />
      </button>
    </div>
    <div class="flex p-4 pt-0">
      <router-link
        :to="`/editar/${uuid}`"
        class="flex items-center mr-2 text-sm font-medium text-blue-600 underline uppercase"
      >
        Editar</router-link
      >
      <div class="flex items-center mr-2 text-sm">${{ precio }}</div>
      <div class="flex items-center mr-2">
        <span class="text-sm"
          >({{
            cantidad < 2 ? `${cantidad} cintillo` : `${cantidad} cintillos`
          }})</span
        >
      </div>
      <div class="text-sm text-gray-500">
        {{ fecha }}
      </div>
    </div>
  </div>
</template>
