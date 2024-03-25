<script setup>
defineProps([
  "classCrearCupon",
  "loading",
  "message",
  "urlGenCupon",
  "urlAgregarCupon",
]);
const emit = defineEmits([
  "closeCrearCupon",
  "agregarCupon",
  "genCupon",
  "agregarCupon",
]);
const nCupon = defineModel("nCupon");
const nUsos = defineModel("nUsos");
</script>
<template>
  <div
    class="fixed top-0 left-0 z-50 items-center justify-center w-full h-full bg-black/75"
    :class="`${classCrearCupon}`"
  >
    <div class="bg-white w-[90%] relative max-w-[500px] rounded-lg shadow-2xl shadow-white/25">
      <div
        class="absolute w-full h-full bg-[#4844AB] text-white flex items-center justify-center transition-all"
        :class="`${loading}`"
      >
        <font-awesome-icon :icon="['fas', 'gear']" spin spin-reverse />
        Agregando cupon...
      </div>
      <h2
        class="flex items-center justify-between p-4 text-sm font-medium text-black uppercase"
      >
        <span><font-awesome-icon :icon="['fas', 'gift']" /> Crear cupones</span>
        <button @click.prevent="emit('closeCrearCupon')">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </h2>
      <form
        class="w-full p-4 pt-0"
        @submit.prevent="emit('agregarCupon', urlAgregarCupon)"
      >
        <div
          class="px-4 py-3 text-sm text-red-500"
          v-if="message.status === 'error'"
        >
          {{ message.message }}
        </div>
        <div
          class="flex items-center justify-between border border-solid border-[#dd] mb-4"
        >
          <div class="px-4 py-3 text-sm text-gray-600">
            <font-awesome-icon :icon="['fas', 'ticket']" />
          </div>
          <input
            type="text"
            maxlength="8"
            placeholder="Ingresa el codigo"
            class="block w-full px-0 py-3 text-sm outline-none"
            v-model="nCupon"
          />
          <button
            class="px-4 py-3 text-sm text-gray-400"
            @click.prevent="emit('genCupon', urlGenCupon)"
          >
            <font-awesome-icon :icon="['fas', 'arrows-rotate']" />
          </button>
        </div>

        <div
          class="flex items-center justify-between border border-solid border-[#dd]"
        >
          <div class="px-4 py-3 text-sm text-gray-600">
            <font-awesome-icon :icon="['fas', 'hashtag']" />
          </div>
          <input
            type="text"
            maxlength="8"
            placeholder="Numero de usos"
            class="block w-full px-0 py-3 text-sm outline-none"
            v-model="nUsos"
          />
        </div>
        <input
          type="submit"
          class="w-full h-9 mt-4 bg-[#4A4878] text-sm text-white rounded transition-all cursor-pointer"
          value="Agregar cupon"
        />
      </form>
    </div>
  </div>
</template>
