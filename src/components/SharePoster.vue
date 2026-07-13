<template>
  <div class="poster">
    <div class="brand">饱了么</div>
    <div class="headline">我今天点了一份{{ amount }}元外卖</div>
    <div class="air">结果吃到了 0 卡路里的空气</div>
    <div class="saved">成功省下 <b>¥{{ amount }}</b></div>
    <div class="tags">#戒外卖挑战 #饱了么</div>
    <div class="qr">扫码一起忍住</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ amount: number }>()
</script>
