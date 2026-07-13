import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Shop from './pages/Shop.vue'
import Cart from './pages/Cart.vue'
import Coupon from './pages/Coupon.vue'
import Confirm from './pages/Confirm.vue'
import Delivery from './pages/Delivery.vue'
import Result from './pages/Result.vue'
import Share from './pages/Share.vue'
import SimpleTab from './pages/SimpleTab.vue'
import User from './pages/User.vue'
import Community from './pages/Community.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/shop/:id', name: 'shop', component: Shop },
    { path: '/cart', name: 'cart', component: Cart },
    { path: '/coupon', name: 'coupon', component: Coupon },
    { path: '/confirm', name: 'confirm', component: Confirm },
    { path: '/delivery', name: 'delivery', component: Delivery },
    { path: '/result', name: 'result', component: Result },
    { path: '/share', name: 'share', component: Share },
    { path: '/market', name: 'market', component: SimpleTab, props: { type: 'market' } },
    { path: '/message', name: 'message', component: SimpleTab, props: { type: 'message' } },
    { path: '/community', name: 'community', component: Community },
    { path: '/user', name: 'user', component: User }
  ]
})
