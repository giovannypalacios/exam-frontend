import api from './api.js'
const apiURL = '1.0/customers'

export default {
  list: (page, size) => api.get(apiURL, { params: { page, size } }),
  get: (id) => api.get(`${apiURL}/${id}`),
  orders: (id, page, size, startDate, endDate) =>
    api.get(`${apiURL}/${id}/orders`, { params: { page, size, startDate, endDate } })
}
