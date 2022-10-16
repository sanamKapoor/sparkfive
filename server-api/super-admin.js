import axios from 'axios'
import querystring from 'querystring'
const superAdminUrl = `${process.env.SERVER_BASE_URL}/super-admin`

export default {
  getUsers: (queryParams = {}) => axios.get(`${superAdminUrl}/users?${querystring.encode(queryParams)}`),
  getUserJWT: (userId) => axios.get(`${superAdminUrl}/users/${userId}/token`),
  getCompanies: (queryParams = {}) => axios.get(`${superAdminUrl}/teams?${querystring.encode(queryParams)}`),
  updateCompanyConfig: (id, data) => axios.put(`${superAdminUrl}/teams/${id}`, data),
  getBenefits: () => axios.get(`${superAdminUrl}/benefits`),
  updateCompanyPlan: (id, data) => axios.put(`${superAdminUrl}/teams/${id}/plan`, data),
}
