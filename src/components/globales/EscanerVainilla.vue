<template>

  <a  class="flex items-center justify-center h-full px-4 leading-tight text-gray-700 bg-gray-300 border rounded-r"
    @click="checkPermissionsAndStart" v-if="deviceEnable"><img src="../../../public/barcode.png"
      class="w-[25px] block" /></a>
  <Transition>
    <div class="w-full h-full fixed z-40 bg-black top-0 left-0 flex justify-center items-center" ref="barcode"
      v-if="show">
      <div class="relative z-50 w-full">
        <a class="absolute top-[-4rem] left-[1rem] text-white" @click.prevent="stopCamera"><font-awesome-icon
            :icon="['fas', 'arrow-left']" /> REGRESAR</a>
        <div class="line animate-ping"></div>
        <video ref="video" autoplay></video>
      </div>
    </div>
  </Transition>

</template>

<script setup>
import { ref, onUnmounted } from 'vue';
const emit = defineEmits(["startScannerNew"])
const barcode = ref(null)
let stream;
const show = ref(false)
const deviceEnable = ref(true)
const video = ref(null);
const result = ref(null);

if (!('BarcodeDetector' in window)) {
  deviceEnable.value = false
}

async function checkPermissionsAndStart() {
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'camera' });

    if (permissionStatus.state === 'granted') {
      initBarcodeScanner();
    } else {
      await initBarcodeScanner();
    }
  } catch (err) {
    console.error('Error al verificar permisos:', err);
    initBarcodeScanner();
  }
}

async function initBarcodeScanner() {
  if (!('BarcodeDetector' in window)) {
    result.value.textContent = 'Barcode Detector no soportado';
    return;
  }

  show.value = true
  const barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'ean_13', 'code_128', 'ean_8', 'upc_a', 'upc_e', 'itf'] });

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.value.srcObject = stream;


    video.value.addEventListener('playing', () => {
      requestAnimationFrame(scanBarcode);
    });

    async function scanBarcode() {
      try {
        const barcodes = await barcodeDetector.detect(video.value);
        if (barcodes.length > 0) {
          stopCamera() 
          emit('startScannerNew', barcodes[0].rawValue)
        }
      } catch (err) {
        console.error(err);
        result.value.textContent = 'Error al detectar el código';
      }

      if (video.value.srcObject) {
        requestAnimationFrame(scanBarcode);
      }
    }
  } catch (err) {
    console.error(err);
    result.value.textContent = 'No se pudo acceder a la cámara';
  }
}

function stopCamera() {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
  }
  video.value.srcObject = null;
  show.value = false;
}

onUnmounted(() => {
  stopCamera();
});
</script>

<style>
.line {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 1px;
  background-color: rgb(214, 40, 40);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>