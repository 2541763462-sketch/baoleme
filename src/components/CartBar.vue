<template>
  <div class="cart-bar-wrap">
    <div class="cart-bar">
      <div class="cart-left" @click="$emit('open')">
        <div class="cart-icon" :class="{ active: count > 0 }"><ShoppingBag :size="21" :stroke-width="2.4" /><span v-if="count">{{ count }}</span></div>
        <div>
          <div class="cart-total">¥{{ total.toFixed(total % 1 === 0 ? 0 : 1) }}</div>
          <div class="cart-sub">{{ count ? '免配送费' : '挑点好吃的吧' }}</div>
        </div>
      </div>
      <button :class="{ ready: count > 0 }" @click.stop="$emit('checkout')">{{ count ? '去结算' : '¥15起送' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag } from '@lucide/vue'

defineProps<{ count: number; total: number }>()
defineEmits<{ open: []; checkout: [] }>()
</script>
