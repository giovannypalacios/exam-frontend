<template>
  <div class="customer-orders">
    <h3>Ordenes del cliente
      <small v-if="customer !== null">{{ customer.name }}</small>
    </h3>
    <b-table
      striped
      bordered
      small
      hover
      :busy="loading"
      :items="ordersData.content"
      :fields="fields"
    >
    </b-table>

    <b-pagination
      v-if="ordersData.totalPages > 1"
      v-model="currentPage"
      :total-rows="ordersData.totalElements"
      :per-page="ordersData.size"
      align="center"
      first-text="First"
      prev-text="Prev"
      next-text="Next"
      last-text="Last"
      size="sm"
      @input="loadPage"
    />
  </div>
</template>

<script>
import customerService from '../service/customerService'
export default {
  name: 'CustomerOrders',
  props: {
    fields: {
      type: Array,
      default: () => ['creationDate', 'deliveryAddress', 'total']
    }
  },
  data: function () {
    return {
      loading: false,
      ordersData: {
        content: []
      },
      currentPage: 1,
      customer: null
    }
  },
  mounted: function () {
    this.loadPage(this.currentPage)
    this.loadCustomer()
  },
  methods: {
    loadCustomer () {
      customerService
        .get(this.$route.params.id)
        .then(response => (this.customer = response.data))
        .catch(error => console.error(error))
    },
    loadPage: function (pageNumber) {
      this.loading = true
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(1)
      startDate.setHours(0, 0, 0, 0)
      customerService
        .orders(this.$route.params.id, pageNumber - 1, 10, startDate, endDate)
        .then(response => (this.ordersData = response.data))
        .catch(error => console.error(error))
        .then(() => (this.loading = false))
    }
  }
}
</script>

<style>
</style>
