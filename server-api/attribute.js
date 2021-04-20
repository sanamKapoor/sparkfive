import axios from 'axios'
import querystring from 'querystring'

const tagUrl = `${process.env.SERVER_BASE_URL}/attribute/tags`
const campaignUrl = `${process.env.SERVER_BASE_URL}/attribute/campaigns`

export default {
    // For tag management
    getTags: (queryParams) => axios.get(`${tagUrl}?${querystring.stringify(queryParams)}`),
    createTags: (payload) => axios.post(`${tagUrl}`, payload),
    deleteTags: (payload) => axios.delete(`${tagUrl}`, {data: payload}),


    // For campaign management
    getCampaigns: (queryParams) => axios.get(`${campaignUrl}?${querystring.stringify(queryParams)}`),
    createCampaigns: (payload) => axios.post(`${campaignUrl}`, payload),
    deleteCampaigns: (payload) => axios.delete(`${campaignUrl}`, {data: payload}),
}
