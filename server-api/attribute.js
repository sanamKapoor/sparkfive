import axios from 'axios'
import querystring from 'querystring'

const tagUrl = `${process.env.SERVER_BASE_URL}/attribute/tags`
const campaignUrl = `${process.env.SERVER_BASE_URL}/attribute/campaigns`
const customFieldsUrl = `${process.env.SERVER_BASE_URL}/attribute/custom-fields`
const customFieldsWithCountUrl = `${process.env.SERVER_BASE_URL}/custom-fields`
const productUrl = `${process.env.SERVER_BASE_URL}/attribute/products`
const folderUrl = `${process.env.SERVER_BASE_URL}/attribute/folders`

export default {
    // For tag management
    getTags: (queryParams) => axios.get(`${tagUrl}?${querystring.stringify(queryParams)}`),
    createTags: (payload) => axios.post(`${tagUrl}`, payload),
    deleteTags: (payload) => axios.delete(`${tagUrl}`, { data: payload }),
    updateTags: (payload) => axios.patch(`${tagUrl}`, payload),


    // For campaign management
    getCampaigns: (queryParams) => axios.get(`${campaignUrl}?${querystring.stringify(queryParams)}`),
    createCampaigns: (payload) => axios.post(`${campaignUrl}`, payload),
    deleteCampaigns: (payload) => axios.delete(`${campaignUrl}`, { data: payload }),
    updateCampaigns: (payload) => axios.patch(`${campaignUrl}`, payload),


    // Custom fields management
    getCustomFields: (queryParams) => axios.get(`${customFieldsUrl}?${querystring.stringify(queryParams)}`),
    getCustomFieldsWithCount: (queryParams) => axios.get(`${customFieldsWithCountUrl}?${querystring.stringify(queryParams)}`),
    getCustomFieldWithCount: (id, queryParams) => axios.get(`${customFieldsWithCountUrl}/${id}?${querystring.stringify(queryParams)}`),
    createCustomField: (payload) => axios.post(`${customFieldsUrl}`, payload),
    deleteCustomField: (payload) => axios.delete(`${customFieldsUrl}`, { data: payload }),

    getProducts: (queryParams) => axios.get(`${productUrl}?${querystring.stringify(queryParams)}`),
    createProducts: (payload) => axios.post(`${productUrl}`, payload),
    deletProducts: (payload) => axios.delete(`${productUrl}`, { data: payload }),
    updateProducts: (payload) => axios.patch(`${productUrl}`, payload),


    getFolders: (queryParams) => axios.get(`${folderUrl}?${querystring.stringify(queryParams)}`),
    getSubFolders: (queryParams) => axios.get(`${folderUrl}/subFolders?${querystring.stringify(queryParams)}`),
    createFolders: (payload) => axios.post(`${folderUrl}`, payload),
    deleteFolders: (payload) => axios.delete(`${folderUrl}`, { data: payload }),
    updateFolders: (payload) => axios.patch(`${folderUrl}`, payload),
}
