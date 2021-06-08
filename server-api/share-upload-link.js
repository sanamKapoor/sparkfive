import axios from 'axios'
import querystring from 'querystring'
const shareLinkUrl = `${process.env.SERVER_BASE_URL}/share-upload-links`

export default {
  getLinkDetail: (queryParams) => axios.get(`${shareLinkUrl}?${querystring.stringify(queryParams)}`),
  uploadAssets: (formData, queryData = {}) => axios.post(`${shareLinkUrl}/upload?${querystring.encode(queryData)}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
}
