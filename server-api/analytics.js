import axios from "axios";

const analyticsUrl = `${process.env.SERVER_BASE_URL}/analytics`;

export default {
  captureAnalytics: async (data) => {
    if(!process.env.ANALYTICS_LAMBDA_ENDPOINT) return;
    await fetch(process.env.ANALYTICS_LAMBDA_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  captureSharedLinkAnalytics: (data) => axios.post(`${analyticsUrl}/share-link/events`, data),
  getAnalyticsData: (endpoint, data) => axios.post(`${analyticsUrl}/${endpoint}`, data),
};

export const AnalyticsApiHelperServerRender = async (url, payload, headers) => {
  return await fetch(`${analyticsUrl}/${url}`, {
    method: "post",
    headers,
    body: JSON.stringify(payload)
  });
}