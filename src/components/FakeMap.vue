<template>
  <div class="fake-map">
    <div class="block b1">朝晖六小区</div><div class="block b2">西湖文化广场</div><div class="block b3">绿洲花园</div>
    <div class="river"></div><div class="road main r1"></div><div class="road main r2"></div><div class="road sub s1"></div><div class="road sub s2"></div><div class="road sub s3"></div>
    <div class="label l1">文晖路</div><div class="label l2">上塘高架</div><div class="poi p1">➕ 浙江省人民医院</div><div class="poi p2">➕ 杭州市儿童医院</div>
    <div class="shop-pin">🏪</div><div class="home-pin">📍</div>
    <div class="shop-tip"><span>🍱</span><div><b>商家正在备餐</b><em>承诺6分钟出餐</em></div></div>
    <div class="parachute">🎪<span>免单</span></div><div class="path"></div>
    <div class="rider" :style="{ left: position.x + '%', top: position.y + '%' }">🛵</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ position: { x: number; y: number } }>()
</script>
