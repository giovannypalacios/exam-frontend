<template>
  <b-container class="customer-orders">
    <h2 class="component-title">Customer Orders</h2>
    <h3><small class="ml-20">{{ customerName }}</small></h3>
    <h4>Here you will find the orders table for the selected customer during the current month.<br>
      You can use the Datepicker to filter by start/end date.</h4>

    <b-row
      :cols="2"
      class="mb-5"
    >
      <b-col>
        <label>Start Date</label>
        <b-form-datepicker
          v-model="startDate"
          :max="endDate"
          class="my-2"
        ></b-form-datepicker>
      </b-col>
      <b-col>
        <label>End Date</label>
        <b-form-datepicker
          v-model="endDate"
          class="my-2"
          :min="startDate"
          :max="today"
        ></b-form-datepicker>
      </b-col>
    </b-row>

    <div v-if="ordersData.content.length > 0">
      <b-table
        striped
        bordered
        small
        hover
        :busy="loading"
        :items="ordersData.content"
        :fields="fields"
      >
        <template v-slot:cell(products)="rowData">
          <order-products-list :products="rowData.item.orderDetailList" />
        </template>
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
        class="mt-4 mb-5"
        @input="loadPage"
      />
    </div>
    <b-row v-else>
      <b-alert
        show
        variant="warning"
        class="w-100"
      >
        <h4>No results</h4>
        <p>No data were found. Try changing the start/end dates range.</p>
      </b-alert>
    </b-row>
  </b-container>
</template>

<script>
import customerService from '../service/customerService'
import OrderProductsList from './OrderProductsList'

export default {
  name: 'CustomerOrders',
  components: {
    OrderProductsList
  },
  props: {
    fields: {
      type: Array,
      default: () => ['creationDate', { key: 'id', label: 'Order ID' }, 'deliveryAddress', 'total', 'products']
    }
  },
  data: function () {
    return {
      loading: false,
      ordersData: {
        content: []
      },
      currentPage: 1,
      customer: null,
      startDate: null,
      endDate: null
    }
  },
  mounted: function () {
    this.endDate = new Date()
    this.startDate = new Date()
    this.startDate.setDate(1)
    this.startDate.setHours(0, 0, 0, 0)
    this.loadPage(this.currentPage)
    this.loadCustomer()
    this.$watch('startDate', () => this.dateUpdated(), { immediate: false })
    this.$watch('endDate', () => this.dateUpdated(), { immediate: false })
  },
  computed: {
    customerName: function () {
      if (this.customer === null) return ''
      else return this.customer.name
    },
    today: function () {
      return new Date()
    }
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
      customerService
        .orders(this.$route.params.id, pageNumber - 1, 10, this.startDate, this.endDate)
        .then(response => (this.ordersData = response.data))
        .catch(error => console.error(error))
        .then(() => (this.loading = false))
    },
    dateUpdated: function () {
      this.currentPage = 1
      this.loadPage(this.currentPage)
    }
  }
}
</script>
