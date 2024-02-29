import axios from "axios";
import querystring from "querystring";
import queryString from "querystring";
const superAdminUrl = `${process.env.SERVER_BASE_URL}/super-admin`;

export default {
  getUsers: (queryParams = {}) => axios.get(`${superAdminUrl}/users?${querystring.encode(queryParams)}`),
  getUserJWT: (userId) => axios.get(`${superAdminUrl}/users/${userId}/token`),
  getCompanies: (queryParams = {}) => axios.get(`${superAdminUrl}/teams?${querystring.encode(queryParams)}`),
  updateCompanyConfig: (id, data) => axios.put(`${superAdminUrl}/teams/${id}`, data),
  getBenefits: () => axios.get(`${superAdminUrl}/benefits`),
  updateCompanyPlan: (id, data) => axios.put(`${superAdminUrl}/teams/${id}/plan`, data),
  downloadDetails: (queryParams = {}) =>
    axios.get(`${superAdminUrl}/users/download-details?${querystring.encode(queryParams)}`),

  getFoldersSimple: (teamId) => axios.get(`${superAdminUrl}/folders/${teamId}`),
  bulkFaceRecognitionAll: (teamId) => axios.post(`${superAdminUrl}/face-recognition/bulk-all/${teamId}`),
  faceRecognitionSpecificFolder: (teamId, data) =>
    axios.post(`${superAdminUrl}/face-recognition/bulk-in-collection/${teamId}`, data),
  getFaceList: (teamId) => axios.get(`${superAdminUrl}/face-recognition/face-list/${teamId}`),
};
