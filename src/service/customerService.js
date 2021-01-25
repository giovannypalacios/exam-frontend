import api from './api.js'
const apiURL = '1.0/customers'

export default {
  list: (page, size) => api.get(apiURL, { params: { page, size } }),
  get: (id) => api.get(`${apiURL}/${id}`),
  getAvailableProducts: (id) => api.get(`${apiURL}/${id}/available-products`),
  save: (id, order) => api.post(`${apiURL}/${id}/orders`, order),
  orders: (id, page, size, startDate, endDate) =>
    api.get(`${apiURL}/${id}/orders`, { params: { page, size, startDate, endDate } })
}
