import axios from "axios";

const teamUrl = `${process.env.SERVER_BASE_URL}/teams`;

export default {
  getTeam: () => axios.get(teamUrl),
  verifyDomain: (subdomain) => axios.post(`${teamUrl}/verify-domain`, { subdomain }),
  patchTeam: (patchData) => axios.patch(teamUrl, patchData),
  getTeamMembers: () => axios.get(`${teamUrl}/members`),
  patchTeamMember: (id, updatedata) => axios.patch(`${teamUrl}/members/${id}`, updatedata),
  disableTeamMember: (id) => axios.patch(`${teamUrl}/members/${id}/disable`),
  uploadPhoto: (formData) =>
    axios.post(`${teamUrl}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getRoles: () => axios.get(`${teamUrl}/roles`),
  getRoleDetail: (id) => axios.get(`${teamUrl}/roles/${id}`),
  deleteRole: (id) => axios.delete(`${teamUrl}/roles/${id}`),
  createCustomRole: (data) => axios.post(`${teamUrl}/roles`, data),
  editRole: (id, data) => axios.put(`${teamUrl}/roles/${id}`, data),
  saveAdvanceConfigurations: (data) => axios.put(`${teamUrl}/saveAdvanceConfigurations`, data),
  getAdvanceOptions: () => axios.get(`${teamUrl}/advanceConfigurations`),
  getOcrTags: () => axios.get(`${teamUrl}/ocr-tags`),
  addOcrTag: (data) => axios.post(`${teamUrl}/ocr-tags`, data),
  removeOcrTag: (id) => axios.delete(`${teamUrl}/ocr-tags/${id}`),
  getOcrCampaigns: () => axios.get(`${teamUrl}/ocr-campaigns`),
  addOcrCampaign: (data) => axios.post(`${teamUrl}/ocr-campaigns`, data),
  removeOcrCampaign: (id) => axios.delete(`${teamUrl}/ocr-campaigns/${id}`),
  getOcrCustomFields: () => axios.get(`${teamUrl}/ocr-custom-fields`),
  addOcrCustomFields: (data) => axios.post(`${teamUrl}/ocr-custom-fields`, data),
  removeOcrCustomFields: (id) => axios.delete(`${teamUrl}/ocr-custom-fields/${id}`),
  getOcrCollections: () => axios.get(`${teamUrl}/ocr-folders`),
  addOcrCollection: (data) => axios.post(`${teamUrl}/ocr-folders`, data),
  removeOcrCollection: (id) => axios.delete(`${teamUrl}/ocr-folders/${id}`),
  updateTheme: (patchData) => axios.put(`${teamUrl}/theme`, patchData),
};
