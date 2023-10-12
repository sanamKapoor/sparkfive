import axios from "axios";

const requestUrl = `${process.env.SERVER_BASE_URL}/requests`;

export default {
  getRequests: () => axios.get(requestUrl),
  approve: (id, payload) => axios.put(`${requestUrl}/${id}/approve`, payload),
  reject: (id) => axios.put(`${requestUrl}/${id}/reject`),
};
