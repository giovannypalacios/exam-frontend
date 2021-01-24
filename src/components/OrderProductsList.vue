<template>
  <div
    v-if="products.length > 0"
    class="order-product-list"
  >
    <div
      v-for="orderDetail in products"
      :key="orderDetail.id"
    >
      {{ orderDetail.quantity }} x {{ orderDetail.productDescription }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderProductsList',
  props: {
    products: {
      type: Array,
      default: () => []
    }
  }
}
</script>
