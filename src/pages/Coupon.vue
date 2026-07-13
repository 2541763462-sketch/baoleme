<template>
  <div class="page coupon-page"><header class="sub-nav"><button aria-label="返回" @click="router.back()">‹</button><b>领券中心</b></header><div class="coupon-tabs"><button :class="{active: tab==='available'}" @click="tab='available'">可领取</button><button :class="{active: tab==='claimed'}" @click="tab='claimed'">已领取</button></div><section v-for="coupon in list" :key="coupon.id" class="coupon-card"><div><b>¥{{ coupon.value }}</b><span>{{ coupon.threshold ? '满' + coupon.threshold + '可用' : '无门槛' }}</span></div><main><h3>{{ coupon.name }}</h3><p>{{ coupon.desc }} · {{ coupon.validity }}</p></main><button :disabled="coupon.claimed" @click="claim(coupon.id)">{{ coupon.claimed ? '已领取' : '领取' }}</button></section></div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCouponStore } from '../stores'
const router = useRouter(); const store = useCouponStore(); const tab = ref<'available'|'claimed'>('available')
const list = computed(() => tab.value === 'available' ? store.availableCoupons : store.claimedCoupons)
function claim(id: string) { store.claimCoupon(id); tab.value = 'claimed' }
</script>
