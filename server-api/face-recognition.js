import axios from "axios";
import queryString from "querystring";
import querystring from "querystring";

const faceRecognitionUrl = `${process.env.SERVER_BASE_URL}/face-recognition`;

export default {
  updateName: (id, data) => axios.put(`${faceRecognitionUrl}/name/${id}`, data),
  updateBulkName: (data) => axios.put(`${faceRecognitionUrl}/bulk-name`, data),
  updateSetting: (data) => axios.put(`${faceRecognitionUrl}/settings`, data),
  list: (data) => axios.get(`${faceRecognitionUrl}/list`, data),
  bulkRecognitionInCollection: (data) => axios.post(`${faceRecognitionUrl}/bulk-in-collection`, data),
  bulkRecognitionAll: () => axios.post(`${faceRecognitionUrl}/bulk-all`),
};
