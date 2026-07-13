<template>
  <div class="page simple-tab"><div class="emoji text-mark">{{ data.mark }}</div><h1>{{ data.title }}</h1><p>{{ data.desc }}</p><RouterLink to="/">去点一份空气美食</RouterLink><TabBar /></div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import TabBar from '../components/TabBar.vue'
const props = defineProps<{ type: string }>()
const data = computed(() => props.type === 'message' ? { mark: '信', title: '消息', desc: '订单通知、商家消息和系统提醒会显示在这里。' } : { mark: '超', title: '超市便利', desc: '这里也能模拟逛超市，但今天的快乐先从一份空气外卖开始。' })
</script>
