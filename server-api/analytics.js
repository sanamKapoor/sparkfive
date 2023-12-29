import axios from "axios";

const analyticsUrl = `${process.env.SERVER_BASE_URL}`;

delete axios.defaults.headers.common["Authorization"];

export default {
  capturePageVisit: (data) =>
    axios.post(`https://2lz5stnydi.execute-api.us-east-1.amazonaws.com/dev/analyticsCollection`, data)
};
