import axios from 'axios'
import querystring from 'querystring'

const productUrl = `${process.env.SERVER_BASE_URL}/products`

export default {
  getProducts: (queryParams) => axios.get(`${productUrl}?${querystring.stringify(queryParams)}`),
  patchProduct: (id, patchData) => axios.patch(`${productUrl}/${id}`, patchData),
  addValue: (id, valueData) => axios.post(`${productUrl}/${id}/value`, valueData),
}