import axios from 'axios'

const filterUrl = `${process.env.SERVER_BASE_URL}/filters`

export default {
  getAssetChannels: () => axios.get(`${filterUrl}/asset-channels`),
  getAssetFileExtensions: () => axios.get(`${filterUrl}/file-extensions`)
}