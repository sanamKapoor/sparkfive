import axios from 'axios'
import querystring from 'querystring'

const tagUrl = `${process.env.SERVER_BASE_URL}/attribute/tags`
const campaignUrl = `${process.env.SERVER_BASE_URL}/attribute/campaigns`
const customFieldsUrl = `${process.env.SERVER_BASE_URL}/attribute/custom-fields`
const customFieldsWithCountUrl = `${process.env.SERVER_BASE_URL}/custom-fields`

export default {
    // For tag management
    getTags: (queryParams) => axios.get(`${tagUrl}?${querystring.stringify(queryParams)}`),
    createTags: (payload) => axios.post(`${tagUrl}`, payload),
    deleteTags: (payload) => axios.delete(`${tagUrl}`, {data: payload}),
    updateTags: (payload) => axios.patch(`${tagUrl}`, payload),


    // For campaign management
    getCampaigns: (queryParams) => axios.get(`${campaignUrl}?${querystring.stringify(queryParams)}`),
    createCampaigns: (payload) => axios.post(`${campaignUrl}`, payload),
    deleteCampaigns: (payload) => axios.delete(`${campaignUrl}`, {data: payload}),
    updateCampaigns: (payload) => axios.patch(`${campaignUrl}`, payload),


    // Custom fields management
    getCustomFields: (queryParams) => axios.get(`${customFieldsUrl}?${querystring.stringify(queryParams)}`),
    getCustomFieldsWithCount: (queryParams) => axios.get(`${customFieldsWithCountUrl}?${querystring.stringify(queryParams)}`),
    createCustomField: (payload) => axios.post(`${customFieldsUrl}`, payload),
    deleteCustomField: (payload) => axios.delete(`${customFieldsUrl}`, {data: payload}),
}
