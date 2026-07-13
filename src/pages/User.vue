<template>
  <div class="page user-page">
    <header class="user-head">
      <div class="user-avatar">我</div>
      <div class="user-head-main">
        <h1>我的饱了么</h1>
        <p>{{ user.latestTitle }} · 已完成 {{ user.totalOrders }} 次模拟下单</p>
      </div>
      <button class="reset-trigger" type="button" @click="showReset = true"><RotateCcw :size="15" />重置</button>
    </header>

    <section class="user-stats">
      <p><b>{{ user.totalOrders }}</b><span>订单</span></p>
      <p><b>¥{{ user.totalSaved }}</b><span>省下</span></p>
      <p><b>{{ user.streak }}</b><span>连续天数</span></p>
    </section>

    <button class="reward-banner" @click="showReward = true">
      <div>
        <b>请作者喝杯咖啡</b>
        <span>喜欢这个小项目，可以请作者喝杯咖啡</span>
      </div>
      <em>☕️</em>
    </button>

    <section class="order-panel">
      <h2>我的订单</h2>
      <div v-if="!orders.orders.length" class="empty compact">
        <span>订</span>
        <h1>还没有订单</h1>
        <RouterLink to="/">去下单</RouterLink>
      </div>
      <article v-for="order in orders.orders" :key="order.id" class="order-card">
        <div class="order-top"><b>{{ order.shopName }}</b><span :class="{ 'status-canceled': order.status === '已取消', 'status-done': order.status === '已完成' }">{{ order.status }}</span></div>
        <p>{{ order.items.length }}件商品 · {{ formatTime(order.createdAt) }}</p>
        <p class="order-address">{{ order.address.city }}{{ order.address.detail }} {{ order.address.doorplate }}</p>
        <div class="order-bottom"><span>实付 ¥{{ order.finalAmount }}</span><button @click="reorder(order)">再来一单</button></div>
      </article>
    </section>

    <TabBar />

    <div v-if="showReward" class="reward-mask" @click="showReward = false">
      <section class="reward-card" @click.stop>
        <h2>请作者喝杯咖啡</h2>
        <div class="pay-tabs"><button :class="{ active: rewardType === 'alipay' }" @click="rewardType = 'alipay'">支付宝</button><button :class="{ active: rewardType === 'wechat' }" @click="rewardType = 'wechat'">微信</button></div>
        <p>请使用{{ rewardType === 'alipay' ? '支付宝' : '微信' }}扫码</p>
        <img :src="rewardType === 'alipay' ? `${baseUrl}reward-qr.jpg` : `${baseUrl}wechat-reward-qr.jpg`" :alt="rewardType === 'alipay' ? '支付宝收款码' : '微信收款码'">
        <button @click="showReward = false">关闭</button>
      </section>
    </div>

    <Transition name="dialog-pop">
      <div v-if="showReset" class="reset-mask" @click="showReset = false">
        <section class="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title" @click.stop>
          <div class="reset-dialog-icon"><TriangleAlert :size="25" /></div>
          <h2 id="reset-title">确认重置所有数据？</h2>
          <p>将清空挑战记录、历史订单、购物车、优惠券和收货地址，操作后无法恢复。</p>
          <div class="reset-actions">
            <button type="button" @click="showReset = false">取消</button>
            <button class="danger" type="button" @click="resetAppData">确认重置</button>
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { RotateCcw, TriangleAlert } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '../components/TabBar.vue'
import { useCartStore, useOrderStore, useUserStore } from '../stores'
import type { Order } from '../types'

const router = useRouter()
const orders = useOrderStore()
const user = useUserStore()
const cart = useCartStore()
const showReward = ref(false)
const showReset = ref(false)
const rewardType = ref<'alipay' | 'wechat'>('alipay')
const baseUrl = import.meta.env.BASE_URL

function formatTime(time: number) {
  return new Date(time).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function reorder(order: Order) {
  cart.clearCart()
  order.items.forEach(item => {
    for (let index = 0; index < item.quantity; index += 1) {
      cart.addItem(item.food, item.shopId, item.shopName)
    }
  })
  router.push('/cart')
}

function resetAppData() {
  const keys = [
    'blm-user',
    'blm-orders',
    'blm-current-order',
    'blm-address',
    'blm-cart',
    'blm-coupon-claims',
    'blm-local-author',
    'blm-community-posts'
  ]
  keys.forEach(key => localStorage.removeItem(key))
  window.location.reload()
}
</script>
