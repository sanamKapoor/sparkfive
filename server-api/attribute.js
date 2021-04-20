import axios from 'axios'
import querystring from 'querystring'

const tagUrl = `${process.env.SERVER_BASE_URL}/attribute/tags`

export default {
    getTags: (queryParams) => axios.get(`${tagUrl}?${querystring.stringify(queryParams)}`),
    createTags: (payload) => axios.post(`${tagUrl}`, payload),
    deleteTags: (payload) => axios.delete(`${tagUrl}`, {data: payload}),
}
