import axios from "axios";
import querystring from "querystring";

const linkUrl = `${process.env.SERVER_BASE_URL}/guest-upload/links`;
const shareUrl = `${process.env.SERVER_BASE_URL}/guest-upload/share`;
const authUrl = `${process.env.SERVER_BASE_URL}/guest-upload/link-auth`;

const requestUrl = `${process.env.SERVER_BASE_URL}/guest-upload/requests`;

export default {
  // Links
  getLinks: (queryParams) =>
    axios.get(`${linkUrl}?${querystring.stringify(queryParams)}`),
  createLink: (payload) => axios.post(`${linkUrl}`, payload),
  deleteLink: (payload) => axios.delete(`${linkUrl}`, { data: payload }),
  updateLink: (payload) => axios.patch(`${linkUrl}`, payload),
  shareLink: (payload) => axios.post(shareUrl, payload),
  authenticateLink: (payload) => axios.post(authUrl, payload),
  getLinkDetail: (queryParams) =>
    axios.get(`${linkUrl}/detail?${querystring.stringify(queryParams)}`),
  uploadBanner: (linkId, payload) =>
    axios.patch(`${linkUrl}/${linkId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Requests
  getRequests: (queryParams) =>
    axios.get(`${requestUrl}?${querystring.stringify(queryParams)}`),
  getRequestAssets: (id, queryParams) =>
    axios.get(
      `${requestUrl}/${id}/assets?${querystring.stringify(queryParams)}`
    ),
};
