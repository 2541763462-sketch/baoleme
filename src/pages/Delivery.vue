<template>
  <div class="delivery-page">
    <FakeMap :position="delivery.position" />

    <div class="delivery-nav">
      <button @click="router.push('/')">‹</button>
      <span>{{ noticeOn ? '已开启通知' : '配送详情' }}</span>
      <div><button @click="refresh">刷新</button><button @click="toast('客服已接入，正在排队')">客服</button></div>
    </div>

    <section class="rider-card" :class="{lost: delivery.status==='lost'}">
      <span class="rider-mark">骑</span>
      <div>
        <b>{{ isCanceled ? '订单已取消' : delivery.message }}</b>
        <p>{{ isCanceled ? '本单已关闭，可在我的订单中查看' : delivery.status === 'lost' ? '订单已完成模拟配送' : `送至 ${order.currentOrder?.address.doorplate || '收货地址'}` }}</p>
      </div>
      <i>›</i>
    </section>

    <section v-if="isCanceled" class="delivery-panel canceled-panel">
      <h1>订单已取消</h1>
      <p class="promise">本次模拟订单已关闭，未产生真实消费。</p>
      <div class="cancel-summary">
        <b>{{ order.currentOrder?.shopName || '模拟订单' }}</b>
        <span>已取消 · ¥{{ order.currentOrder?.finalAmount || 0 }}</span>
      </div>
      <button class="result-btn" @click="router.push('/user')">查看我的订单</button>
      <button class="secondary-btn" @click="router.push('/')">重新下单</button>
    </section>

    <section v-else class="delivery-panel">
      <h1>{{ delivery.status === 'lost' ? '已送达' : '预计12:49送达' }}</h1>
      <p class="promise">慢必赔：12:59未送达，送达后可获赔9元红包</p>

      <div class="delivery-actions">
        <button @click="toast('配送中暂不支持修改商品，可联系客服处理')"><b>改</b><em>改订单信息</em></button>
        <button @click="toast('已为你呼叫商家，请稍等')"><b>商</b><em>联系商家</em></button>
        <button @click="toast('已给骑士发送联系请求')"><b>骑</b><em>联系骑士</em></button>
        <button :disabled="urged" @click="urge"><b>催</b><em>{{ urged ? '已催单' : '催单' }}</em></button>
        <button :disabled="order.currentOrder?.status === '已取消'" @click="cancel"><b>取</b><em>取消订单</em></button>
      </div>

      <div class="growth">本单预计获得36成长值 <b>201/500</b><div><i></i></div></div>
      <div v-if="showNotice" class="notice">开启实时通知，可快捷查看订单进度信息 <button @click="noticeOn = true">开启</button><b @click="showNotice = false">×</b></div>
      <div v-if="toastText" class="task">{{ toastText }}</div>
      <button class="result-btn" @click="goResult">{{ delivery.status === 'lost' ? '查看省钱成果' : '完成模拟配送' }}</button>
    </section>

    <Popup :show="delivery.showPopup" @close="delivery.showPopup=false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FakeMap from '../components/FakeMap.vue'
import Popup from '../components/Popup.vue'
import { useDeliveryStore, useOrderStore, useUserStore } from '../stores'

const router = useRouter()
const delivery = useDeliveryStore()
const order = useOrderStore()
const user = useUserStore()
const noticeOn = ref(false)
const showNotice = ref(true)
const urged = ref(false)
const toastText = ref('')
const isCanceled = computed(() => order.currentOrder?.status === '已取消')

onMounted(() => delivery.start())
onUnmounted(() => delivery.reset())

function toast(text: string) {
  toastText.value = text
}

function refresh() {
  delivery.start()
  toast('配送进度已刷新')
}

function urge() {
  urged.value = true
  toast('已催促商家和骑士，请留意进度变化')
}

function cancel() {
  order.cancelCurrentOrder()
  delivery.reset()
  toast('订单已取消，可在我的订单中查看')
}

function goResult() {
  order.finishCurrentOrder()
  user.complete(order.currentOrder?.savedAmount || 0, order.currentOrder?.id || '')
  router.push('/result')
}
</script>
