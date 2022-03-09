import axios from 'axios'
import querystring from 'querystring'

const linkUrl = `${process.env.SERVER_BASE_URL}/shared-links`

export default {
    // Get shared links
    getSharedLinks: (queryParams) => axios.get(`${linkUrl}?${querystring.stringify(queryParams)}`),

    deleteLink: (id) => axios.delete(`${linkUrl}/${id}`),

    updateLink: (id, params) => axios.put(`${linkUrl}/${id}`, params),

    getSharedByList: () => axios.get(`${linkUrl}/share-by-list`),

    getSharedWithList: () => axios.get(`${linkUrl}/share-with-list`)
}
