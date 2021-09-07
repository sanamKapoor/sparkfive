import axios from 'axios'
import querystring from 'querystring'

const userUrl = `${process.env.SERVER_BASE_URL}/users`

export default {
  getUserData: () => axios.get(userUrl),
  signIn: (data) => axios.post(`${userUrl}/signin`, data),
  signUp: (data, queryData = {}) => axios.post(`${userUrl}/signup?${querystring.encode(queryData)}`, data),
  validateTwoFactor: ({ twoFactorCode }) => axios.post(`${userUrl}/two-factor`, { twoFactorCode }),
  requestPasswordreset: (data) => axios.post(`${userUrl}/generate-password-reset`, data),
  passwordReset: (data) => axios.post(`${userUrl}/password-reset`, data),

  uploadPhoto: (formData) => axios.post(`${userUrl}/photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  patchUser: (data) => axios.patch(`${userUrl}`, data),
  patchUserPassword: (data) => axios.patch(`${userUrl}/password`, data),
  patchUserEmail: (data) => axios.patch(`${userUrl}/email`, data),

  addIntegration: (data) => axios.post(`${userUrl}/integrations`, data),
  getIntegrations: () => axios.get(`${userUrl}/integrations`),
  modifyIntegration: (id, data) => axios.patch(`${userUrl}/integrations/${id}`, data),

  getsubscriptionHeaders: () => axios.get(`${userUrl}/subscription-headers`),

  requestAccess: (data) => axios.post(`${userUrl}/request-access`, data),
  completeRequestAccess: (data) => axios.post(`${userUrl}/complete-request-access`, data),
}
