import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

import { Client } from "@pusher/push-notifications-web";

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
      const beamsClient = new Client({
        instanceId: "b963f891-0b89-4e01-84a8-698b97373219",
      });
      if (userData.value.profile[0].suscripcion === 1) {
        beamsClient
          .start()
          .then(() =>
            beamsClient.addDeviceInterest(`${userData.value.profile[0].user_uuid}`)
          )
          .then(() => console.log("Successfully registered and subscribed!"))
          .catch(console.error);
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
