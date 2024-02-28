import axios from "axios";
import queryString from "querystring";

const filterUrl = `${process.env.SERVER_BASE_URL}/filters`;

export default {
  getAssetChannels: (queryParams) =>
    axios.get(
      `${filterUrl}/asset-channels?${queryString.stringify(queryParams)}`
    ),
  getAssetFileExtensions: (queryParams) =>
    axios.get(
      `${filterUrl}/file-extensions?${queryString.stringify(queryParams)}`
    ),
  getAssetDimensionLimits: (queryParams) =>
    axios.get(
      `${filterUrl}/asset-dimension-limits?${queryString.stringify(
        queryParams
      )}`
    ),
  getAssetOrientations: (queryParams) =>
    axios.get(
      `${filterUrl}/asset-orientations?${queryString.stringify(queryParams)}`
    ),
  getAssetResolutions: (queryParams) =>
    axios.get(
      `${filterUrl}/asset-resolutions?${queryString.stringify(queryParams)}`
    ),
};
