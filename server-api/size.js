import axios from 'axios'
import querystring from 'querystring'

const customFileSize = `${process.env.SERVER_BASE_URL}/sizes/customs`
const sizePreset = `${process.env.SERVER_BASE_URL}/sizes/presets`
const downloadAsset = `${process.env.SERVER_BASE_URL}/sizes/download`

export default {
    // For custom sizes
    getCustomFileSizes: (queryParams) => axios.get(`${customFileSize}?${querystring.stringify(queryParams)}`),
    createCustomSize: (data) => axios.post(customFileSize, data),
    deleteCustomSize: (payload) => axios.delete(`${customFileSize}`, {data: payload}),


    // For preset sizes
    getSizePresets: (queryParams) => axios.get(`${sizePreset}?${querystring.stringify(queryParams)}`),
    getSizePresetsByGroup: (queryParams) => axios.get(`${sizePreset}/group?${querystring.stringify(queryParams)}`),
    createPresetSize: (data) => axios.post(sizePreset, data),
    deletePresetSize: (payload) => axios.delete(`${sizePreset}`, {data: payload}),

    download: (data, filters) => {
        return axios({
            url: `${downloadAsset}?${querystring.encode(filters)}`,
            method: 'POST',
            responseType: 'blob', // Important
            data
        })
    }
}
