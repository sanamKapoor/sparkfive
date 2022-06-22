import axios from 'axios'
import querystring from 'querystring'

const linkUrl = `${process.env.SERVER_BASE_URL}/upload-approvals`

export default {
    // Get upload approvals
    getUploadApprovals: (queryParams) => axios.get(`${linkUrl}?${querystring.stringify(queryParams)}`),
    addComments: (assetId, params) => axios.post(`${linkUrl}/assets/${assetId}/comments`, params),
    submit: (approvalId, params) => axios.post(`${linkUrl}/submit/${approvalId}`, params),
    approve: (approvalId, params) => axios.put(`${linkUrl}/approve/${approvalId}`, params),
    reject: (approvalId, params) => axios.put(`${linkUrl}/reject/${approvalId}`, params),
    update: (approvalId, params) => axios.put(`${linkUrl}/${approvalId}`, params),
}
