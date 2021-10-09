import axios from 'axios'

const teamUrl = `${process.env.SERVER_BASE_URL}/teams`

export default {
  getTeam: () => axios.get(teamUrl),
  verifyDomain: (subdomain) => axios.post(`${teamUrl}/verify-domain`, { subdomain }),
  patchTeam: (patchData) => axios.patch(teamUrl, patchData),
  getTeamMembers: () => axios.get(`${teamUrl}/members`),
  patchTeamMember: (id, updatedata) => axios.patch(`${teamUrl}/members/${id}`, updatedata),
  disableTeamMember: (id) => axios.patch(`${teamUrl}/members/${id}/disable`),
  uploadPhoto: (formData) => axios.post(`${teamUrl}/photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getRoles: () => axios.get(`${teamUrl}/roles`),
  getRoleDetail: (id) => axios.get(`${teamUrl}/roles/${id}`),
  deleteRole: (id) => axios.delete(`${teamUrl}/roles/${id}`),
  createCustomRole: (data) => axios.post(`${teamUrl}/roles`, data),
  editRole: (id, data) => axios.put(`${teamUrl}/roles/${id}`, data),
}
