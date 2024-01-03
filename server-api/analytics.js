import axios from "axios";

delete axios.defaults.headers.common["Authorization"];

export default {
  captureAnalytics: (data) => {
    axios.post(process.env.ANALYTICS_LAMBDA_ENDPOINT, data)
  }
};
