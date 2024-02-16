import toastUtils from './toast'
import axios from 'axios'

export default {
  setAuthToken: (token, headerValue = 'Authorization') => {
    axios.defaults.headers.common[headerValue] = `Bearer ${token}`
  },
  removeAuthToken: () => {
    delete axios.defaults.headers.common['Authorization']
  },
  setForbiddenInterceptor: () => {
    axios.interceptors.response.use((response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      if (error.response?.status === 403 && error.response.data) toastUtils.error(error.response.data.message)
      return Promise.reject(error);
    });
  },
  consoleRequestInterceptor: () => {
    axios.interceptors.request.use(
      (config) => {
        console.log(config, "config")
        // Do something before the request is sent
        return config;
      },
      (error) => {
        // Handle request errors (e.g., failed handshaking)
        console.error('Request setup error:', error);
        return Promise.reject(error);
      }
    );
  }
}