<template>
  <div class="page share-page"><header class="sub-nav"><button @click="router.back()">‹</button><b>分享挑战</b></header><SharePoster :amount="amount" /><p class="share-tip">截图分享到朋友圈，让朋友也体验一次 0 卡路里的空气外卖。</p><button class="save" @click="saved = true">{{ saved ? '已提示截图保存' : '保存图片' }}</button></div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SharePoster from '../components/SharePoster.vue'
import { useOrderStore } from '../stores'
const router = useRouter(); const order = useOrderStore(); const amount = order.currentOrder?.savedAmount || 68; const saved = ref(false)
</script>
