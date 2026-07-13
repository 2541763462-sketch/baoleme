<template>
  <div class="result-page"><div v-for="i in 18" :key="i" class="confetti" :style="{left: (i*37%100)+'%', animationDelay: (i*.08)+'s'}"></div><button class="close" @click="router.push('/')">×</button><h1>挑战成功！</h1><section><p><span>本次模拟订单</span><b>¥{{ amount }}</b></p><p><span>实际消费</span><b>¥0</b></p><div>成功节省 <strong>¥{{ amount }}</strong></div><em>{{ user.latestTitle }}</em></section><div class="result-stats"><p><b>{{ user.totalOrders }}</b><span>挑战次数</span></p><p><b>¥{{ user.totalSaved }}</b><span>累计省钱</span></p><p><b>{{ user.streak }}</b><span>连续天数</span></p></div><footer><button @click="router.push('/')">再来一次</button><button @click="router.push('/share')">分享给朋友</button></footer></div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useOrderStore, useUserStore } from '../stores'
const router = useRouter(); const order = useOrderStore(); const user = useUserStore(); const amount = order.currentOrder?.savedAmount || 68
</script>
