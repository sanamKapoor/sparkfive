import axios from "axios";

const analyticsUrl = `${process.env.SERVER_BASE_URL}/analytics`;

export default {
  captureAnalytics: (data) => axios.post(process.env.ANALYTICS_LAMBDA_ENDPOINT, data),
  captureSharedLinkAnalytics: (data) => axios.post(`${analyticsUrl}/share-link/events`, data),
  getAnalyticsData: (endpoint, data) => axios.post(`${analyticsUrl}/${endpoint}`, data),
};