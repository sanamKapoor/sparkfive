import axios from 'axios'
import querystring from 'querystring'

const assetUrl = `${process.env.SERVER_BASE_URL}/assets`

export default {
  uploadAssets: (formData, queryData = {}) => axios.post(`${assetUrl}/upload?${querystring.encode(queryData)}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  uploadThumbnail: (formData, queryData = {}) => axios.post(`${assetUrl}/upload/thumbnail?${querystring.encode(queryData)}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getAssets: (queryData = {}) => axios.get(`${assetUrl}?${querystring.encode(queryData)}`),
  searchAssets: (queryData = {}) => axios.get(`${assetUrl}/search/filename?${querystring.encode(queryData)}`),
  getVersions: (versionGroup) => axios.get(`${assetUrl}/versions-of/${versionGroup}`),
  checkDuplicates: (fileNames) => axios.post(`${assetUrl}/check-duplicates`, {fileNames}),
  revertVersion: ({ revertAssetId, versionGroup } = {}) => axios.post(`${assetUrl}/revert-version`, { revertAssetId, versionGroup }),
  getNotes: (id) => axios.get(`${assetUrl}/get-notes/${id}`),
  saveNote: (note = {}) => axios.post(`${assetUrl}/save-note`, note),
  deleteNote: (id) => axios.delete(`${assetUrl}/delete-note/${id}`),
  copyAssets: ({ idList, folderId }, filters = {}) => axios.post(`${assetUrl}/copy?${querystring.encode(filters)}`, { idList, folderId }),
  getRealUrl: (assetId) => axios.get(`${assetUrl}/${assetId}/real-url`),
  importAssets: (provider, assetData, queryData) => axios.post(`${assetUrl}/import/${provider}?${querystring.encode(queryData)}`, assetData),
  updateMultiple: (updateData, filters = {}) => axios.patch(`${assetUrl}?${querystring.encode(filters)}`, updateData),
  updateMultipleAttributes: (updateData, filters = {}) => axios.patch(`${assetUrl}/attributes?${querystring.encode(filters)}`, updateData),
  getSharedAssets: (queryData) => axios.get(`${assetUrl}/share?${querystring.encode(queryData)}`),
  generateAndSendShareUrl: (data, filters = {}) => axios.post(`${assetUrl}/share?${querystring.encode(filters)}`, data),
  getShareUrl: (data, filters = {}) => axios.post(`${assetUrl}/share-url?${querystring.encode(filters)}`, data),
  getById: id => axios.get(`${assetUrl}/${id}`),
  updateAsset: (id, { updateData, associations = {} }) => axios.patch(`${assetUrl}/${id}`, { updateData, associations }),
  deleteAsset: (id, filters = {}) => axios.delete(`${assetUrl}/${id}?${querystring.encode(filters)}`),
  deleteMultipleAssets: ({ assetIds, filters = {} }) => axios.delete(`${assetUrl}?${querystring.encode(filters)}`, { data: { assetIds } }),
  addTag: (id, data) => axios.post(`${assetUrl}/${id}/tags`, data),
  nonAiTagAssetsCount: () => axios.get(`${assetUrl}/nonAiTagAssetsCount`),
  startBulkAiTagging: () => axios.post(`${assetUrl}/startBulkAiTagging`),
  removeTag: (id, tagId) => axios.delete(`${assetUrl}/${id}/tags/${tagId}`),
  addCampaign: (id, data) => axios.post(`${assetUrl}/${id}/campaigns`, data),
  removeCampaign: (id, campaignId) => axios.delete(`${assetUrl}/${id}/campaigns/${campaignId}`),
  addProject: (id, data) => axios.post(`${assetUrl}/${id}/projects`, data),

  addProduct: (id, data) => axios.post(`${assetUrl}/${id}/products`, data),
  removeProduct: (id, productId) => axios.delete(`${assetUrl}/${id}/products/${productId}`),

  addFolder: (id, data) => axios.post(`${assetUrl}/${id}/folders`, data),
  removeFolder: (id, folderId) => axios.delete(`${assetUrl}/${id}/folders/${folderId}`),
  getBulkProperties: (data) => axios.post(`${assetUrl}/bulk-properties`, data),

  addCustomFields: (id, data) => axios.post(`${assetUrl}/${id}/custom-fields`, data),
  removeCustomFields: (id, tagId) => axios.delete(`${assetUrl}/${id}/custom-fields/${tagId}`),

  generateThumbnails: ({assetIds}) => axios.post(`${assetUrl}/generate-thumbnails`, { assetIds }),


  downloadAll: (data, filters) => {
    return axios({
      url: `${assetUrl}/download?${querystring.encode(filters)}`,
      method: 'POST',
      responseType: 'blob', // Important
      data
    })
  },

  shareDownload: (data, filters) => {
    return axios({
      url: `${assetUrl}/share/download?${querystring.encode(filters)}`,
      method: 'POST',
      responseType: 'blob', // Important
      data
    })
  },

  associate: (assetIds) => axios.post(`${assetUrl}/associate`, { assetIds }),
  disassociate: (assetIds) => axios.post(`${assetUrl}/disassociate`, { assetIds }),

}

