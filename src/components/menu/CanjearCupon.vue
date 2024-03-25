<script setup>
defineProps([
  "classCupon",
  "vipModal",
  "loading",
  "message",
  "codigoLength",
  "url",
]);
const emit = defineEmits(["canjeCupon", "closeCupon"]);
const codigo = defineModel("codigo");
</script>
<template>
  <div
    class="fixed top-0 left-0 z-50 items-center justify-center w-full h-full bg-black/75"
    :class="`${classCupon}`"
  >
    <div class="bg-white w-[90%] relative rounded-lg shadow-2xl shadow-white/25 max-w-[500px]">
      <div
        class="absolute top-0 left-0 items-center justify-center w-full h-full text-white transition-all bg-white"
        :class="`${vipModal}`"
      >
        <div class="p-4 bg-white">
          <img src="../../../public/canje_vip.gif" class="w-[100px] m-auto" />
          <p class="py-4 text-sm text-gray-950">
            !En hora buena! tu cuenta ahora es premium
          </p>
          <button
            to="/login"
            class="mb-4 flex justify-center items-center text-center w-full h-9 bg-[#4A4878] text-sm text-white rounded transition-all cursor-pointer"
            @click.prevent="redireccionar('/')"
          >
            Continuar navegando
          </button>
        </div>
      </div>
      <div
        class="absolute w-full h-full bg-[#4844AB] text-white flex items-center justify-center transition-all"
        :class="`${loading}`"
      >
        <font-awesome-icon :icon="['fas', 'gear']" spin spin-reverse />
        Validando codigo...
      </div>

      <h2
        class="flex items-center justify-between p-4 text-sm font-medium text-black uppercase"
      >
        <span
          ><font-awesome-icon :icon="['fas', 'gift']" /> Reclamar cupon</span
        >
        <button @click="emit('closeCupon')">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </h2>
      <form class="w-full p-4 pt-0" @submit.prevent="emit('canjeCupon', url)">
        <div
          class="px-4 py-3 text-sm text-red-500"
          v-if="message.status === 'error'"
        >
          {{ message.message }}
        </div>
        <div
          class="flex items-center justify-between border border-solid border-[#dd]"
        >
          <div class="px-4 py-3 text-sm text-gray-600">
            <font-awesome-icon :icon="['fas', 'ticket']" />
          </div>
          <input
            type="text"
            maxlength="8"
            inputmode="numeric"
            placeholder="Ingresa el codigo"
            class="block w-full px-0 py-3 text-sm outline-none"
            v-model="codigo"
          />
          <div class="px-4 py-3 text-sm text-gray-400">
            {{ codigoLength }}/8
          </div>
        </div>
        <input
          type="submit"
          class="w-full h-9 mt-4 bg-[#4A4878] text-sm text-white rounded transition-all cursor-pointer"
          value="Canjear cupon"
        />
      </form>
    </div>
  </div>
</template>
