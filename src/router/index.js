import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/clientes'
  },
  {
    path: '/',
    component: () => import('../views/View.vue'),
    children: [
      {
        path: 'clientes',
        name: 'customers',
        component: () => import('../components/CustomersList.vue')
      },
      {
        path: 'clientes/:id/ordenes',
        name: 'orders',
        component: () => import('../components/CustomerOrders.vue')
      }
    ]
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
