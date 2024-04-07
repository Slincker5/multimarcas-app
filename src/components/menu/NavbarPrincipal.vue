<script setup>
defineProps(["userNoPhoto", "options", "userData", "finallySub"]);
const emit = defineEmits([
  "openCupon",
  "openCrearCupon",
  "closeMenu",
  "cambbiarFoto",
  "logout",
]);
</script>
<template>
  <div
    class="fixed z-30 flex items-start justify-start w-full h-full transition-all bg-transparent md:left-0 md:sticky md:top-0"
    :class="`${options}`"
    @click="emit('closeMenu')"
  >
    <div
      class="w-[65%] md:w-[220px] lg:w-[250px] h-full inline-block bg-[#fff] shadow-2xl shadow-black/50"
      v-if="userData"
    >
      <div
        class="p-4 md:p-6 py-3 pl-5 border-b border-solid border-[#ddd]/50 flex items-center justify-between bg-gray-100"
      >
        <div class="flex items-center">
          <div class="w-[40px] h-[40px] md:w-[50px] md:h-[50px]">
            <img
              :src="
                userData.profile[0].photo !== null
                  ? userData.profile[0].photo
                  : userNoPhoto
              "
              :alt="
                userData.profile[0].username === null
                  ? userData.profile[0].nombre
                  : userData.profile[0].username
              "
              class="object-cover w-full h-full align-middle rounded-full"
            />
          </div>
          <div
            class="flex items-center pl-2 text-sm font-medium text-gray-900"
            v-if="userData"
          >
            {{
              userData.profile[0].username === null
                ? userData.profile[0].nombre +
                  " " +
                  userData.profile[0].apellido
                : userData.profile[0].username
            }}<span v-if="userData.profile[0].suscripcion === 1"
              ><img
                src="../../../public/vip.png"
                alt="premiun"
                class="w-[9px] mb-4 inline-block shadow-lg shadow-yellow-500"
            /></span>
          </div>
        </div>
        <button class="relative" @click="emit('cambiarFoto')"><span
          class="absolute top-[15px] right-[15px] inline-flex w-2 h-2 font-black rounded-full opacity-75 animate-ping bg-rose-700"
        ></span>
          <font-awesome-icon :icon="['fas', 'user-pen']" class="p-4 text-gray-600 cursor-pointer"/>
        </button>
      </div>
      <div class="px-4 py-4 pl-5 text-sm text-gray-600">
        Tipo de cuenta:
        <b
          class="text-xs"
          :class="
            userData.profile[0].suscripcion === 1
              ? 'text-green-500'
              : 'text-amber-500'
          "
          >{{ userData.profile[0].suscripcion === 1 ? "Premium" : "Basica" }}</b
        >
      </div>
      <div
        class="px-4 pl-5 py-4 text-sm text-gray-600 border-t border-solid border-[#ddd]/50"
        v-if="userData.profile[0].suscripcion === 1"
      >
        Finaliza:
        <b class="text-sm font-light text-amber-500" id="vence">
          {{ finallySub }}</b
        >
      </div>
      <button
        class="text-left p-4 pl-5 text-sm border-t border-solid border-[#ddd]/50 text-gray-600 w-full block"
        @click.prevent="emit('openCrearCupon')"
        v-if="userData.profile[0].rol === 'Admin'"
      >
        <font-awesome-icon :icon="['fas', 'tag']" /> Crear cupon
      </button>
      <button
        class="text-left p-4 pl-5 text-sm border-t border-solid border-[#ddd]/50 text-gray-600 w-full block"
        @click.prevent="emit('openCupon')"
        v-if="userData.profile[0].suscripcion === 0"
      >
        <font-awesome-icon :icon="['fas', 'gift']" /> Canjear cupon
      </button>
      <button
        class="text-left p-4 pl-5 text-sm border-t border-solid border-[#ddd]/50 text-gray-600 w-full block"
        @click="emit('logout')"
      >
        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" /> Cerrar
        sesion
      </button>
    </div>
  </div>
</template>
