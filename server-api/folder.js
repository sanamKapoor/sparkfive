import axios from 'axios'
import queryString from 'querystring'
import querystring from "querystring";

const folderUrl = `${process.env.SERVER_BASE_URL}/folders`

export default {
  getFolderById: (id) => axios.get(`${folderUrl}/${id}`),
  getFolders: (queryParams = {}) => axios.get(`${folderUrl}?${queryString.stringify(queryParams)}`),
  getFoldersSimple: (queryParams = {}) => axios.get(`${folderUrl}/simple?${queryString.stringify(queryParams)}`),
  createFolder: (data) => axios.post(folderUrl, data),
  updateFolder: (id, data) => axios.patch(`${folderUrl}/${id}`, data),
  deleteFolder: (id) => axios.delete(`${folderUrl}/${id}`),
  shareFolder: (id, data) => axios.put(`${folderUrl}/${id}/share`, data),
  authenticateCollection: (data) => axios.post(`${folderUrl}/collection-auth`, data),
  getInfoToDownloadFolder: (id) => axios.get(`${folderUrl}/${id}/download`),
  downloadFoldersAsZip: (data, filters) => {
    return axios({
      url: `${folderUrl}/download-as-zip?${querystring.encode(filters)}`,
      method: 'POST',
      responseType: 'blob', // Important
      data
    })
  },
  getShareUrl: (data, filters = {}) => axios.post(`${folderUrl}/share-url?${querystring.encode(filters)}`, data),
  generateAndSendShareUrl: (data, filters = {}) => axios.post(`${folderUrl}/share?${querystring.encode(filters)}`, data),
  getSubFolders: (queryParams = {}, id) => axios.get(`${folderUrl}/${id}/subCollection?${queryString.stringify(queryParams)}`),
}
