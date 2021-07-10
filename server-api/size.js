import axios from 'axios'
import querystring from 'querystring'

const customFileSize = `${process.env.SERVER_BASE_URL}/sizes/customs`
const sizePreset = `${process.env.SERVER_BASE_URL}/sizes/presets`

export default {
    // For tag management
    getCustomFileSizes: (queryParams) => axios.get(`${customFileSize}?${querystring.stringify(queryParams)}`),
    getSizePresets: (queryParams) => axios.get(`${sizePreset}?${querystring.stringify(queryParams)}`)
}
