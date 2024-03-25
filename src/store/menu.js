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
    } catch (error) {
      const messageError = JSON.parse(error.request.response);
      if (messageError.status === "invalid") {
        localStorage.clear();
        redireccionar("/login");
      }
    }
  };

  const redireccionar = (url) => {
    window.location.href = url;
  };
  

  return {
    userData,
    getUserData,
  };
});
