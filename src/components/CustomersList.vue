<template>
  <div class="customers-list">
    <h2 class="component-title">Customers List</h2>
    <h4>In this page you find the customers table with an action to view the customer orders</h4>
    <b-table
      striped
      bordered
      small
      hover
      :busy="loading"
      :items="customerData.content"
      :fields="fields"
    >
      <template v-slot:cell(actions)="rowData">
        <router-link :to="`/clientes/${rowData.item.id}/ordenes`">
          View orders
        </router-link>
      </template>
    </b-table>

    <b-pagination
      v-if="customerData.totalPages > 1"
      v-model="currentPage"
      :total-rows="customerData.totalElements"
      :per-page="customerData.size"
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
  name: 'CustomersList',
  props: {
    fields: {
      type: Array,
      default: () => ['name', 'email', 'actions']
    }
  },
  data: function () {
    return {
      loading: false,
      customerData: {
        content: []
      },
      currentPage: 1
    }
  },
  mounted: function () {
    this.loadPage(this.currentPage)
  },
  methods: {
    loadPage: function (pageNumber) {
      this.loading = true
      customerService
        .list(pageNumber - 1, 10)
        .then(response => (this.customerData = response.data))
        .catch(error => console.error(error))
        .then(() => (this.loading = false))
    }
  }
}
</script>

<style>
</style>
