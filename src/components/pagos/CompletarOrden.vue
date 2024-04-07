<script setup>
import { ref } from "vue";

const toggle = ref(false);

const abrir = () => {
  toggle.value = true;
};

const cerrar = () => {
  toggle.value = false;
};
</script>
<template>
  <div>
    <div>
      <div
        class="flex items-center justify-between bg-green-500 border-l-4 border-green-800 border-solid"
      >
        <img
          src="../../../public/premium_account2.png"
          alt="miembro premium"
          class="w-[75px] block p-4 animate-bounce"
        />
        <div class="w-full p-4 pl-0">
          <h3 class="text-sm font-medium text-white uppercase">
            Suscripcion Premium
          </h3>
          <p class="text-sm font-light text-white">
            Obten todos los beneficios de nuestra aplicacion
          </p>
          <div class="flex justify-end p-1">
            <button
              class="px-4 py-2 text-xs font-medium text-green-500 bg-white rounded-lg"
              @click.prevent="abrir"
            >
              Comprar Suscripcion
            </button>
          </div>
        </div>
      </div>
    </div>
    <Transition>
      <div
        v-if="toggle"
        class="fixed top-0 left-0 z-40 w-full h-full p-4 transition-all bg-white"
      >
        <h3
          class="flex items-center justify-between pb-4 font-medium text-black"
        >
          PAGOS
          <button @click.prevent="cerrar">
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>
        </h3>
        <div
          class="flex items-center justify-between p-4 text-sm font-medium rounded-md text-neutral-700 bg-amber-100"
        >
          ¿Como pagar?
          <button
            class="px-4 py-1 text-sm text-white bg-blue-500 rounded-md"
            @click.prevent="abrirModalTuto"
          >
            Ver tutorial
          </button>
        </div>
        <p class="p-4 text-sm font-light text-gray-500">
          Todas las transacciones son seguras y estan encriptadas.
        </p>
        <div>
          <div
            class="border border-b-0 border-solid border-[#ddd] p-4 flex items-center justify-between"
          >
            <div class="text-sm font-light">
              Suscripcion Premium<br />
              <span class="text-xs text-gray-400">(Duracion por 30 dias)</span>
            </div>
            <div class="text-sm font-semibold">$1.10</div>
          </div>
          <div
            class="flex items-center justify-between border border-solid border-[#ddd] p-4"
          >
            <span class="text-sm font-light">Wompi El Salvador</span>
            <div class="flex gap-1">
              <img
                src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169695890db3db16bfe.svg"
              />
              <img
                src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/5e3b05b68f3d31b87e84.svg"
              />
            </div>
          </div>
        </div>
        <div class="border border-t-0 border-solid border-[#ddd] bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-270.8 371 102 52"
            class="p-4 w-[150px] m-auto text-gray-500"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="2"
              d="M-182 404v16.8c0 .7-.4 1.2-1 1.2h-75.7c-.7 0-1.2-.6-1.2-1.2v-47.6c0-.7.6-1.2 1.2-1.2h75.7c.7 0 1 .6 1 1.2V395m-78-14h78m-17 18h27m-3.9-4.6 4.5 4.6-4.5 4.6"
            />
            <circle cx="-255.5" cy="376.5" r="1.5" fill="currentColor" />
            <circle cx="-250.5" cy="376.5" r="1.5" fill="currentColor" />
            <circle cx="-245.5" cy="376.5" r="1.5" fill="currentColor" />
          </svg>
          <p class="p-4 pt-0 text-xs font-light text-center text-gray-700">
            Luego de hacer clic en “Pagar ahora”, serás redirigido a Wompi El
            Salvador para completar tu compra de forma segura.
          </p>
          <div class="flex items-center justify-center p-4">
            <div
              class="wompi_button_widget"
              data-url-pago="https://lk.wompi.sv/ixtR"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
