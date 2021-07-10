import axios from 'axios'
import querystring from 'querystring'

const customFileSize = `${process.env.SERVER_BASE_URL}/sizes/customs`
const sizePreset = `${process.env.SERVER_BASE_URL}/sizes/presets`

export default {
    // For custom sizes
    getCustomFileSizes: (queryParams) => axios.get(`${customFileSize}?${querystring.stringify(queryParams)}`),
    createCustomSize: (data) => axios.post(customFileSize, data),
    deleteCustomSize: (payload) => axios.delete(`${customFileSize}`, {data: payload}),


    // For preset sizes
    getSizePresets: (queryParams) => axios.get(`${sizePreset}?${querystring.stringify(queryParams)}`)
}
