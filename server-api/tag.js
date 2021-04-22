import axios from 'axios'
import querystring from 'querystring'

const tagUrl = `${process.env.SERVER_BASE_URL}/tags`

export default {
  getTags: (queryParams) => axios.get(`${tagUrl}?${querystring.stringify(queryParams)}`),
}
