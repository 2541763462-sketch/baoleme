<template>
  <div class="page confirm-page">
    <header class="sub-nav"><button @click="router.back()">‹</button><b>确认订单</b></header>

    <section class="address editable" @click="editingAddress = true">
      <div>
        <h2>{{ address.city }}{{ address.detail }}</h2>
        <p>{{ address.doorplate }} · {{ address.name }} {{ address.phone }}</p>
      </div>
      <span>修改</span>
    </section>

    <section class="confirm-card">
      <h3>{{ cart.shopName }}</h3>
      <p v-for="item in cart.items" :key="item.food.id">
        <span>{{ item.food.name }} ×{{ item.quantity }}</span>
        <b>¥{{ item.food.price * item.quantity }}</b>
      </p>
    </section>

    <section class="confirm-card">
      <p><span>商品金额</span><b>¥{{ cart.totalPrice }}</b></p>
      <p><span>配送费</span><b>¥{{ cart.deliveryFee }}</b></p>
      <p><span>优惠信息</span><b class="discount">-¥{{ cart.discountAmount }}</b></p>
      <em>预计30分钟送达</em>
    </section>

    <Transition name="sheet">
      <div v-if="editingAddress" class="cart-sheet address-sheet" @click="editingAddress = false">
        <section @click.stop>
          <h3>收货地址 <button @click="editingAddress = false">关闭</button></h3>
          <label><span>联系人</span><input v-model="draft.name"></label>
          <label><span>手机号</span><input v-model="draft.phone" inputmode="tel"></label>
          <label><span>城市</span><input v-model="draft.city"></label>
          <label><span>收货地址</span><input v-model="draft.detail"></label>
          <label><span>门牌号</span><input v-model="draft.doorplate"></label>
          <button class="save-address" @click="saveAddress">保存地址</button>
        </section>
      </div>
    </Transition>

    <footer class="paybar">
      <span>合计 <b>¥{{ cart.finalPrice }}</b></span>
      <button :disabled="!cart.totalCount" @click="pay">{{ cart.totalCount ? '立即支付' : '先去选购' }}</button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore, useOrderStore } from '../stores'

const router = useRouter()
const cart = useCartStore()
const order = useOrderStore()
const editingAddress = ref(false)
const address = computed(() => order.address)
const draft = reactive({ ...order.address })

function saveAddress() {
  order.updateAddress({ ...draft })
  editingAddress.value = false
}

function pay() {
  if (!cart.totalCount) {
    router.push('/')
    return
  }
  order.createOrder()
  cart.clearCart()
  router.push('/delivery')
}
</script>
