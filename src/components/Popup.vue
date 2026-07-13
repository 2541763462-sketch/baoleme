<template>
  <div v-if="show" class="popup-mask">
    <div class="popup">
      <div class="popup-icon">🛵</div>
      <h3>骑手正在重新规划路线</h3>
      <p>他看起来离你很近，但快乐决定多绕一会儿。</p>
      <button @click="$emit('close')">知道了</button>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ show: boolean }>()
defineEmits<{ close: [] }>()
</script>
