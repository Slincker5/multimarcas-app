<script setup>
import { useRoute } from "vue-router";
import axios from "axios";

const token = localStorage.getItem("token");
const route = useRoute();
const idTransaccion = route.query.idTransaccion;
const monto = route.query.monto;

alert(monto)
const enviarTransaccion = async () => {
  try {
    const params = {
      IdTransaccion: idTransaccion
    };

    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    const { data } = await axios.post('https://procter.work/api/pagos/after-pay', params, {
      headers,
    });

    alert(data)
  } catch (error) {
    console.log(error);
  }
};
enviarTransaccion()
</script>
<template>
    el pago por $ {{ monto }} fue un exito
</template>
