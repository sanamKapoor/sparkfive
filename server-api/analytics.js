import axios from "axios";

const analyticsUrl = `${process.env.SERVER_BASE_URL}/analytics`;
delete axios.defaults.headers.common["Authorization"];

export default {
  captureAnalytics: (data) => {
    axios.post(process.env.ANALYTICS_LAMBDA_ENDPOINT, data)
  },
  captureSharedLinkAnalytics: (data) => {
    axios.post(`${analyticsUrl}/share-link/events`, data)
  },
  getUserEngagementAnalytics: (data) => {
    axios.post(`${analyticsUrl}/users`, data)
  }
};
