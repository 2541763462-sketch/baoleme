<template>
  <div class="page cart-page">
    <template v-if="cart.items.length">
      <h1>{{ cart.shopName }}</h1>
      <section class="cart-list">
        <div v-for="item in cart.items" :key="item.food.id" class="cart-item">
          <img class="pic" :src="item.food.image" :alt="item.food.name">
          <div><b>{{ item.food.name }}</b><em>¥{{ item.food.price }}</em></div>
          <p><button aria-label="减少数量" @click="cart.removeItem(item.food.id)">-</button><span>{{ item.quantity }}</span><button aria-label="增加数量" @click="cart.addItem(item.food, item.shopId, item.shopName)">+</button></p>
        </div>
      </section>
      <RouterLink class="coupon-entry" to="/coupon">优惠券 <span>{{ cart.discountAmount ? '-¥' + cart.discountAmount : '去领取 ›' }}</span></RouterLink>
      <section class="summary">
        <p><span>商品金额</span><b>¥{{ cart.totalPrice }}</b></p>
        <p><span>配送费</span><b>¥{{ cart.deliveryFee }}</b></p>
        <p><span>优惠抵扣</span><b>-¥{{ cart.discountAmount }}</b></p>
        <p class="total"><span>合计</span><b>¥{{ cart.finalPrice }}</b></p>
      </section>
    </template>
    <div v-else class="empty">
      <ShoppingCart :size="68" :stroke-width="1.4" />
      <h1>购物车空空如也</h1>
      <RouterLink to="/">去逛逛</RouterLink>
    </div>
    <CartBar :count="cart.totalCount" :total="cart.finalPrice" @open="scrollCartToTop" @checkout="router.push(cart.items.length ? '/confirm' : '/')" />
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart } from '@lucide/vue'
import { useRouter } from 'vue-router'
import CartBar from '../components/CartBar.vue'
import TabBar from '../components/TabBar.vue'
import { useCartStore } from '../stores'

const cart = useCartStore()
const router = useRouter()

function scrollCartToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
