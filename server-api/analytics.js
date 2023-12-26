import axios from "axios";

const analyticsUrl = `${process.env.SERVER_BASE_URL}/analytics`;

export default {
  capturePageVisit: (data) =>
    axios.post(`${analyticsUrl}/capture`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
