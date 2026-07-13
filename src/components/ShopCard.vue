<template>
  <button class="shop-card" type="button" @click="$emit('select', shop)">
    <div class="shop-logo">
      <img :src="shop.image" :alt="shop.name" loading="lazy" decoding="async">
      <span class="logo-text" :style="{ background: shop.color }">{{ shop.avatar }}</span>
      <span class="corner">{{ shop.tags[0] }}</span>
    </div>
    <div class="shop-info">
      <div class="title-row">
        <div class="shop-name">{{ shop.name }}</div>
        <span class="hot-tag">爆红包</span>
      </div>
      <div class="shop-category">{{ shop.category }} · {{ shop.banner }}</div>
      <div class="meta"><span class="star">★ {{ shop.rating }}</span><span>月售{{ shop.monthlySales }}</span><span>{{ shop.deliveryTime }}</span><span>{{ shop.distance }}</span></div>
      <div class="meta"><span>起送¥{{ shop.minOrder }}</span><span :class="{ free: shop.deliveryFee === 0 }">{{ shop.deliveryFee === 0 ? '免配送费' : '配送¥' + shop.deliveryFee }}</span><span class="ontime">蜂鸟准时达</span></div>
      <div class="deal">优惠叠加预计可减{{ shop.promotions[1].discount + shop.promotions[2].discount }}元</div>
      <div class="promo"><span v-for="promo in shop.promotions.slice(0, 3)" :key="promo.id" class="tag red">{{ promo.label }}</span><span class="more">∨</span></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Shop } from '../types'
defineProps<{ shop: Shop }>()
defineEmits<{ select: [shop: Shop] }>()
</script>
