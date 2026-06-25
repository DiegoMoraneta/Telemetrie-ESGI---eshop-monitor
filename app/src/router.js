import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Products from './pages/Products.vue'
import ProductDetail from './pages/ProductDetail.vue'
import Cart from './pages/Cart.vue'
import Checkout from './pages/Checkout.vue'
import OrderConfirmation from './pages/OrderConfirmation.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/products', component: Products },
    { path: '/products/:id', component: ProductDetail },
    { path: '/cart', component: Cart },
    { path: '/checkout', component: Checkout },
    { path: '/order-confirmation', component: OrderConfirmation },
  ]
})

export default router