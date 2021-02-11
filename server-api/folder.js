import axios from 'axios'
import queryString from 'querystring'

const folderUrl = `${process.env.SERVER_BASE_URL}/folders`

export default {
  getFolderById: (id) => axios.get(`${folderUrl}/${id}`),
  getFolders: (queryParams = {}) => axios.get(`${folderUrl}?${queryString.stringify(queryParams)}`),
  getFoldersSimple: (queryParams = {}) => axios.get(`${folderUrl}/simple?${queryString.stringify(queryParams)}`),
  createFolder: (data) => axios.post(folderUrl, data),
  updateFolder: (id, data) => axios.patch(`${folderUrl}/${id}`, data),
  deleteFolder: (id) => axios.delete(`${folderUrl}/${id}`),
  shareFolder: (id, data) => axios.put(`${folderUrl}/${id}/share`, data),
  authenticateCollection: (data) => axios.post(`${folderUrl}/collection-auth`, data)
}