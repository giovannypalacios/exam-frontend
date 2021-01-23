import api from './api.js'
const apiURL = '1.0/customers'

export default {
  list: (page, size) => api.get(apiURL, { params: { page, size } }),
  get: (id) => api.get(`${apiURL}/${id}`)
}
