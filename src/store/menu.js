import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useNavBar = defineStore("navBar", () => {
  const userData = ref(null);

  const token = ref(localStorage.getItem("token"));

  const getUserData = async (url) => {
    try {
      const headers = {
        Authorization: "Bearer " + token.value,
        "Content-Type": "application/json",
      };
      const { data } = await axios.get(url, { headers });
      userData.value = data;
      const script = document.createElement("script");
      script.src = "https://pagos.wompi.sv/js/wompi.pagos.js";
      document.head.appendChild(script);
      if (userData.value.profile[0].suscripcion === 1) {
        if (Notification.permission !== "granted") {
          Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
              console.log("Permiso de notificaciones concedido");
            } else {
              console.warn("Permiso de notificaciones denegado");
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    userData,
    getUserData,
  };
});
