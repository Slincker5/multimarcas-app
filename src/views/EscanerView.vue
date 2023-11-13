<template>
  <div>
    <h1>Scan 1D/2D Code from Video Camera</h1>
    <div>
        <a class="block m-2 p-4 bg-[steelblue] text-white" @click="startScanner">Encender escanner</a>
        <a class="block m-2 p-4 bg-[steelblue] text-white" @click="resetScanner">Apagar</a>
    </div>
    <video id="video" width="300" height="200"></video>
    <label>Resultado:</label>
    <pre><code>{{ result }}</code></pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Client } from '@pusher/push-notifications-web';


// Crea el cliente de Pusher Beams
const beamsClient = new Client({
  instanceId: '90b80143-5f43-4ed9-a447-8ad08e3ca889',
});

// Inicializa Pusher Beams cuando el componente se monte
onMounted(() => {
  beamsClient.start()
    .then(() => beamsClient.addDeviceInterest('cintillos'))
    .then(() => console.log('¡Registro y suscripción exitosos!'))
    .catch(console.error);
});

const codeReader = new BrowserMultiFormatReader();
const result = ref('');
let selectedDeviceId;

onMounted(() => {
    codeReader.listVideoInputDevices()
      .then((videoInputDevices) => {
        selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
      })
      .catch((err) => {
        console.error(err);
      });
});

const startScanner = () => {
    codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (res, err) => {
        if (res) {
            result.value = res.text;
        } else if (err && !(err instanceof NotFoundException)) {
            result.value = err;
        }
    });
};

const resetScanner = () => {
    codeReader.reset();
    result.value = '';
};
</script>
