import axios from "axios";
import { default as queryString, default as querystring } from "querystring";
const shareCollectionsUrl = `${process.env.SERVER_BASE_URL}/share-collections`;

export default {
  getFolderInfo: (queryParams) =>
    axios.get(`${shareCollectionsUrl}?${querystring.encode(queryParams)}`),
  getAssetById: (id, queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/assets/${id}?${querystring.encode(queryParams)}`
    ),
  getAssets: (queryParams = {}) =>
    axios.get(
      `${shareCollectionsUrl}/assets?${querystring.encode(queryParams)}`
    ),
  getFolders: (queryParams = {}) =>
    axios.get(
      `${shareCollectionsUrl}/folders?${querystring.encode(queryParams)}`
    ),
  getSubFolders: (queryParams = {}, id) =>
    axios.get(
      `${shareCollectionsUrl}/${id}/subCollection?${queryString.stringify(
        queryParams
      )}`
    ),
  getCampaigns: (queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/campaigns?${querystring.stringify(queryParams)}`
    ),
  getProjects: (queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/projects?${querystring.stringify(queryParams)}`
    ),
  getTags: (queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/tags?${querystring.stringify(queryParams)}`
    ),
  getCustomFields: (queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/custom-fields?${querystring.stringify(
        queryParams
      )}`
    ),
  getCustomField: (id, queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/custom-fields/${id}?${querystring.stringify(
        queryParams
      )}`
    ),
  getAssetChannels: (queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/asset-channels?${querystring.encode(queryParams)}`
    ),
  getAssetFileExtensions: (queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/file-extensions?${querystring.encode(
        queryParams
      )}`
    ),
  getAssetDimensionLimits: (queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/asset-dimension-limits?${querystring.encode(
        queryParams
      )}`
    ),
  getAssetOrientations: (queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/asset-orientations?${querystring.encode(
        queryParams
      )}`
    ),
  getAssetResolutions: (queryParams) =>
    axios.get(
      `${shareCollectionsUrl}/asset-resolutions?${querystring.encode(
        queryParams
      )}`
    ),
  downloadAll: (data, filters) => {
    return axios({
      url: `${shareCollectionsUrl}/download?${querystring.encode(filters)}`,
      method: "POST",
      responseType: "blob", // Important
      data,
    });
  },
  downloadWithCustomSize: (data, filters) => {
    return axios({
      url: `${shareCollectionsUrl}/download/custom-size?${querystring.encode(
        filters
      )}`,
      method: "POST",
      responseType: "blob", // Important
      data,
    });
  },
  downloadFoldersAsZip: (data, filters) => {
    return axios({
      url: `${shareCollectionsUrl}/download-as-zip?${querystring.encode(
        filters
      )}`,
      method: "POST",
      responseType: "blob", // Important
      data,
    });
  },
  getFoldersSimple: (queryParams = {}) =>
    axios.get(
      `${shareCollectionsUrl}/folders/simple?${queryString.stringify(
        queryParams
      )}`
    ),
  getTeamAttributes: (queryParams = {}) =>
    axios.get(
      `${shareCollectionsUrl}/attributes?${queryString.stringify(queryParams)}`
    ),
};
