<template>

  <a class="flex items-center justify-center h-full px-4 leading-tight text-gray-700 bg-gray-300 border rounded-r"
    @click="checkPermissionsAndStart" v-if="deviceEnable"><img src="../../../public/barcode.png"
      class="w-[25px] block" /></a>
  <Transition>
    <div class="w-full h-full fixed z-40 bg-black top-0 left-0 flex justify-center items-center" ref="barcode"
      v-if="show">
      <div class="relative z-50 w-full">

        <div class="z-50 absolute top-0 left-0 p-4 bg-black/60 flex items-center justify-between w-full">
          <a class="text-white" @click.prevent="stopCamera"><font-awesome-icon :icon="['fas', 'arrow-left']" />
            REGRESAR</a>
          <a class="text-white hidden" @click.prevent="openOldScanner"><font-awesome-icon :icon="['fas', 'barcode']" /> OPCION
            DOS</a>
        </div>
        <div class="line animate-ping"></div>
        <video ref="videoNew" autoplay></video>
      </div>
    </div>
  </Transition>
  
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
const emit = defineEmits(["startScannerNew", "startScanner"])
const barcode = ref(null)
let stream;
const show = ref(false)
const deviceEnable = ref(true)
const videoNew = ref(null);
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
  const barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'code_128', 'ean_8', 'upc_a', 'upc_e'] });

  try {
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
      }
    };
    const capabilities = await navigator.mediaDevices.getSupportedConstraints();
    if (capabilities.focusMode) {
      constraints.video.focusMode = { ideal: 'continuous' };
    }

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoNew.value.srcObject = stream;


    videoNew.value.addEventListener('playing', () => {
      requestAnimationFrame(scanBarcode);
    });

    async function scanBarcode() {
      try {
        const barcodes = await barcodeDetector.detect(videoNew.value);
        if (barcodes.length > 0) {
          setTimeout(() => {
            stopCamera()
            emit('startScannerNew', barcodes[0].rawValue)
          }, 1000)

        }
      } catch (err) {
        console.error(err);
        result.value.textContent = 'Error al detectar el código';
      }

      if (videoNew.value.srcObject) {
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
  videoNew.value.srcObject = null;
  show.value = false;
}

onUnmounted(() => {
  stopCamera();
});

const openOldScanner = () => {
  emit('startScanner')
  stopCamera()
}
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