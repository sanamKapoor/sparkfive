import axios from 'axios'
import querystring from 'querystring'
const shareCollectionsUrl = `${process.env.SERVER_BASE_URL}/share-collections`

export default {

  getFolderInfo: (queryParams) => axios.get(`${shareCollectionsUrl}?${querystring.encode(queryParams)}`),
  getAssetById: (id) => axios.get(`${shareCollectionsUrl}/assets/${id}`),
  getAssets: (queryParams = {}) => axios.get(`${shareCollectionsUrl}/assets?${querystring.encode(queryParams)}`),
  getCampaigns: (queryParams) => axios.get(`${shareCollectionsUrl}/campaigns?${querystring.stringify(queryParams)}`),
  getProjects: (queryParams) => axios.get(`${shareCollectionsUrl}/projects?${querystring.stringify(queryParams)}`),
  getTags: (queryParams) => axios.get(`${shareCollectionsUrl}/tags?${querystring.stringify(queryParams)}`),
  getAssetChannels: (queryParams) => axios.get(`${shareCollectionsUrl}/asset-channels?${querystring.encode(queryParams)}`),
  getAssetFileExtensions: (queryParams) => axios.get(`${shareCollectionsUrl}/file-extensions?${querystring.encode(queryParams)}`),
  getAssetDimensionLimits: (queryParams) => axios.get(`${shareCollectionsUrl}/asset-dimension-limits?${querystring.encode(queryParams)}`),
  getAssetOrientations: (queryParams) => axios.get(`${shareCollectionsUrl}/asset-orientations?${querystring.encode(queryParams)}`)
}