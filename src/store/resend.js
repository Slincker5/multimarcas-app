import { defineStore } from "pinia";
import { ref } from "vue";

export const useReSend = defineStore("reSend", () => {
  const toggle = ref(false);
  const enviando = ref(false)
  const formReenviarOpen = () => {
    toggle.value = true;
  };

  const formReenviarClose = () => {
    toggle.value = false;
  };

  const enviandoTrue = () => {
    enviando.value = true;
  };
  const enviandoFalse = () => {
    enviando.value = false;
  };

  return {
    toggle,
    enviando,
    enviandoTrue,
    enviandoFalse,
    formReenviarOpen,
    formReenviarClose
  };
});
