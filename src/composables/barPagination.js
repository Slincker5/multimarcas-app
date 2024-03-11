import { ref } from "vue";

export const useBarPagination = () => {
const postXpagina = ref(6);
const inicio = ref(0);
const fin = ref(6);

const siguiente = () => {
  inicio.value += postXpagina.value;
  fin.value += postXpagina.value;
};
const anterior = () => {
  inicio.value -= postXpagina.value;
  fin.value -= postXpagina.value;
};
  return {
    postXpagina,
    inicio,
    fin,
    siguiente,
    anterior
  };
};
