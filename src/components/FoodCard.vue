<template>
  <div class="food-card">
    <img class="food-img" :src="food.image" :alt="food.name" loading="lazy" decoding="async">
    <div class="food-info">
      <div class="food-name">{{ food.name }}</div>
      <div class="food-desc">{{ food.desc }}</div>
      <div class="sales">月售{{ food.sales }} {{ food.tags[0] }}</div>
      <div class="price-row">
        <div><span class="estimate">预估到手</span><span class="old">¥{{ food.originalPrice }}</span><span class="price">¥{{ food.price }}</span></div>
        <div class="counter">
          <button v-if="quantity" class="minus" @click="$emit('remove', food.id)">-</button>
          <span v-if="quantity" class="qty">{{ quantity }}</span>
          <button class="plus" @click="$emit('add', food)">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Food } from '../types'
defineProps<{ food: Food; quantity: number }>()
defineEmits<{ add: [food: Food]; remove: [foodId: string] }>()
</script>
