import axios from 'axios'
import querystring from 'querystring'

const linkUrl = `${process.env.SERVER_BASE_URL}/guest-upload/links`
const shareUrl = `${process.env.SERVER_BASE_URL}/guest-upload/share`

export default {
    getLinks: (queryParams) => axios.get(`${linkUrl}?${querystring.stringify(queryParams)}`),
    createLink: (payload) => axios.post(`${linkUrl}`, payload),
    deleteLink: (payload) => axios.delete(`${linkUrl}`, {data: payload}),
    updateLink: (payload) => axios.patch(`${linkUrl}`, payload),
    shareLink: (payload) => axios.post(shareUrl, payload),
}
