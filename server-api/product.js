import axios from 'axios'
import querystring from 'querystring'

const productUrl = `${process.env.SERVER_BASE_URL}/products`

export default {
  getProducts: (queryParams) => axios.get(`${productUrl}?${querystring.stringify(queryParams)}`),
  patchProduct: (id, patchData) => axios.patch(`${productUrl}/${id}`, patchData),
  addTag: (id, tagData) => axios.post(`${productUrl}/${id}/tags`, tagData),
  deleteTag: (id, tagId) => axios.post(`${productUrl}/${id}/tags/${tagId}`)
}