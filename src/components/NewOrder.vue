<template>
  <div>
    <b-modal
      id="add-new-order"
      :visible="visible"
      title="Add new Order"
      size="lg"
      hide-footer
      @show="resetOrder"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
    >
      <b-container>
        <div v-if="!saved && error === null">
          <b-row class="mb-4">
            <b-col :cols="12">
              <label for="delivery-address">Delivery Address</label>
              <b-form-input
                id="delivery-address"
                v-model="order.deliveryAddress"
                placeholder="Write the delivery address"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row :cols="2">
            <b-col>
              <h4 class="mb-2">Available products</h4>
              <b-list-group>
                <b-list-group-item
                  v-for="product in availableProducts"
                  :key="product.id"
                  class="d-flex justify-content-between align-items-center  px-2 py-1"
                >
                  <div class="d-flex flex-column">
                    <span>
                      {{ product.name }}
                    </span>
                    <small>
                      {{ product.description }}
                    </small>
                  </div>
                  <b-button
                    variant="outline-primary"
                    pill
                    size="sm"
                    :disabled="quantity >= 5"
                    @click="addProduct(product)"
                  >Add</b-button>
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <b-col>
              <h4 class="mb-2">Order products</h4>
              <b-list-group>
                <b-list-group-item
                  v-for="orderDetailItem in order.orderDetailList"
                  :key="orderDetailItem.id"
                  class="d-flex justify-content-between align-items-center px-2 py-1"
                >
                  <small>{{ orderDetailItem.productDescription }}</small>
                  <b-form-spinbutton
                    v-model="orderDetailItem.quantity"
                    min="1"
                    max="5"
                    inline
                    @change="updateTotals"
                  ></b-form-spinbutton>
                  <b-button
                    variant="light"
                    pill
                    @click="removeOrderDetailItem(orderDetailItem)"
                    class="ml-2"
                  >
                    <b-icon
                      icon="trash"
                      aria-hidden="true"
                    ></b-icon>
                  </b-button>
                </b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
          <b-row class="order-totals my-3">
            <b-col :cols="12">
              <label>Total price: {{ order.total }}</label>
            </b-col>
          </b-row>
        </div>
        <b-row v-else>
          <b-col :cols="12">
            <b-alert
              :show="error !== null"
              variant="danger"
              class="w-100"
            >
              <h4 class="mb-2">Error</h4>
              An error ocurred when trying to save the order.
            </b-alert>
            <b-alert
              :show="saved"
              variant="success"
              class="w-100"
            >
              <h4 class="mb-2">Order saved</h4>
              The order was saved successfully
            </b-alert>
          </b-col>
        </b-row>
        <b-alert
          variant="warning"
          :show="quantity > 5 || order.deliveryAddress===''"
          class="mt-3 w-100"
        >
          <div v-show="quantity > 5">Your order can have 5 products maximum.</div>
          <div v-show="order.deliveryAddress===''">Please write the delivery address.</div>
        </b-alert>
        <b-row class="controls d-flex justify-content-end mt-3">
          <b-button
            variant="info"
            @click="$emit('close')"
            class="mx-2"
            :disabled="saving"
          >
            Close
          </b-button>

          <b-button
            v-if="!saved && error === null"
            variant="primary"
            @click="saveOrder"
            :disabled="quantity<=0 || quantity > 5 || saving || order.deliveryAddress===''"
            class="mx-2"
          >
            <b-spinner
              small
              v-if="saving"
            ></b-spinner>
            Save Order
          </b-button>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import customerService from '../service/customerService'
export default {
  name: 'NewOrder',
  props: {
    availableProducts: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      order: {
        id: null,
        creationDate: new Date(),
        deliveryAddress: '',
        total: 0,
        orderDetailList: []
      },
      quantity: 0,
      saving: false,
      saved: false,
      error: null
    }
  },
  methods: {
    addProduct: function (product) {
      if (this.order.orderDetailList.some(_ => _.id === product.id)) {
        this.order.orderDetailList.filter(_ => _.id === product.id).forEach(orderDetailItem => {
          orderDetailItem.quantity++
        })
      } else {
        const orderDetailItem = {
          id: product.id,
          product: product,
          productDescription: product.description,
          price: product.price,
          quantity: 1
        }
        this.order.orderDetailList.push(orderDetailItem)
      }
      this.updateTotals()
    },
    removeOrderDetailItem: function (orderDetailItem) {
      this.order.orderDetailList = this.order.orderDetailList.filter(_ => _.id !== orderDetailItem.id)
      this.updateTotals()
    },
    updateTotals: function () {
      this.order.total = this.order.orderDetailList.map(_ => _.price * _.quantity).reduce((a, b) => a + b, 0)
      this.quantity = this.order.orderDetailList.map(_ => _.quantity).reduce((a, b) => a + b, 0)
    },
    saveOrder: function () {
      this.saving = true
      customerService
        .save(this.$route.params.id, this.order)
        .then(() => {
          this.saved = true
          this.$emit('saved', this.order)
        })
        .catch(error => (this.error = error))
        .then(() => (this.saving = false))
    },
    resetOrder: function () {
      this.order = {
        id: null,
        creationDate: new Date(),
        deliveryAddress: '',
        total: 0,
        orderDetailList: []
      }
      this.saved = false
      this.error = null
    }
  }
}
</script>
