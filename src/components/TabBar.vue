<template>
  <nav class="tabbar" aria-label="主导航">
    <RouterLink to="/"><House :size="23" :stroke-width="2.2" /><span>外卖</span></RouterLink>
    <RouterLink to="/cart"><ShoppingCart :size="23" :stroke-width="2.2" /><span>购物车</span></RouterLink>
    <RouterLink to="/community"><Compass :size="23" :stroke-width="2.2" /><span>分享站</span></RouterLink>
    <RouterLink to="/user"><UserRound :size="23" :stroke-width="2.2" /><span>我的</span></RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { Compass, House, ShoppingCart, UserRound } from '@lucide/vue'
</script>
