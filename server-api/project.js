import axios from 'axios'

const projectUrl = `${process.env.SERVER_BASE_URL}/projects`

export default {
  getProjectById: (id) => axios.get(`${projectUrl}/${id}`),
  getProjects: () => axios.get(projectUrl),
  createProject: (data) => axios.post(projectUrl, data),
  updateProject: (id, data) => axios.patch(`${projectUrl}/${id}`, data),
  deleteProject: (id) => axios.delete(`${projectUrl}/${id}`),
  addtask: (id, data) => axios.post(`${projectUrl}/${id}/tasks`, data),
  removeTask: (id, taskId) => axios.delete(`${projectUrl}/${id}/task/${taskId}`),
  addTag: (id, data) => axios.post(`${projectUrl}/${id}/tags`, data),
  removeTag: (id, tagId) => axios.delete(`${projectUrl}/${id}/tags/${tagId}`)
}