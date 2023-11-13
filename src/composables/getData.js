// En tu composable 'getData.js'

import { ref } from 'vue'
import axios from 'axios'

const datos = ref(null)
export const useGetData = () => {
  const getData = async (url) => {
    try {
      let { data } = await axios.get(url)
      datos.value = data
    } catch (error) {
      console.log(error)
    }
  }
  return {
    getData,
    datos
  }
}

