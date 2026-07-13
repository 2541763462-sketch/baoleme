import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { coupons as defaultCoupons } from './mock'
import type { Address, CartItem, Coupon, DeliveryStatus, Food, Order } from './types'

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

function writeStored<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const useCartStore = defineStore('cart', () => {
  const savedCart = readStored('blm-cart', { items: [] as CartItem[], shopId: '', shopName: '', selectedCouponId: 'c1' })
  const items = ref<CartItem[]>(savedCart.items)
  const shopId = ref(savedCart.shopId)
  const shopName = ref(savedCart.shopName)
  const selectedCouponId = ref(savedCart.selectedCouponId)

  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.food.price * item.quantity, 0))
  const deliveryFee = computed(() => items.value.length ? 5 : 0)
  const couponStore = useCouponStore()
  const selectedCoupon = computed(() => couponStore.coupons.find(c => c.id === selectedCouponId.value) || couponStore.bestCoupon(totalPrice.value))
  const discountAmount = computed(() => selectedCoupon.value && totalPrice.value >= selectedCoupon.value.threshold ? selectedCoupon.value.value : 0)
  const finalPrice = computed(() => Math.max(0, totalPrice.value + deliveryFee.value - discountAmount.value))

  function addItem(food: Food, sid: string, sname: string) {
    if (shopId.value && shopId.value !== sid) clearCart()
    shopId.value = sid
    shopName.value = sname
    const hit = items.value.find(i => i.food.id === food.id)
    if (hit) hit.quantity += 1
    else items.value.push({ food, quantity: 1, shopId: sid, shopName: sname })
  }

  function removeItem(foodId: string) {
    const hit = items.value.find(i => i.food.id === foodId)
    if (!hit) return
    hit.quantity -= 1
    if (hit.quantity <= 0) items.value = items.value.filter(i => i.food.id !== foodId)
  }

  function clearCart() {
    items.value = []
    shopId.value = ''
    shopName.value = ''
    selectedCouponId.value = 'c1'
  }

  watch([items, shopId, shopName, selectedCouponId], () => {
    writeStored('blm-cart', {
      items: items.value,
      shopId: shopId.value,
      shopName: shopName.value,
      selectedCouponId: selectedCouponId.value
    })
  }, { deep: true })

  return { items, shopId, shopName, selectedCouponId, totalCount, totalPrice, deliveryFee, discountAmount, finalPrice, addItem, removeItem, clearCart }
})

export const useCouponStore = defineStore('coupon', () => {
  const todayKey = new Date().toISOString().slice(0, 10)
  const savedClaims = readStored<Record<string, boolean>>('blm-coupon-claims', {})
  const coupons = ref<Coupon[]>(buildDailyCoupons(todayKey).map(c => ({ ...c, claimed: savedClaims[c.id] ?? c.claimed })))
  const availableCoupons = computed(() => coupons.value.filter(c => !c.claimed))
  const claimedCoupons = computed(() => coupons.value.filter(c => c.claimed))
  const bestCoupon = (amount: number) => coupons.value.filter(c => c.claimed && amount >= c.threshold).sort((a, b) => b.value - a.value)[0]
  const claimCoupon = (id: string) => {
    const coupon = coupons.value.find(c => c.id === id)
    if (coupon) coupon.claimed = true
  }
  watch(coupons, value => {
    writeStored('blm-coupon-claims', Object.fromEntries(value.filter(coupon => coupon.claimed).map(coupon => [coupon.id, true])))
  }, { deep: true })
  return { coupons, availableCoupons, claimedCoupons, bestCoupon, claimCoupon, todayKey }
})

function buildDailyCoupons(dayKey: string): Coupon[] {
  const dayNumber = Number(dayKey.replace(/-/g, ''))
  const pool = [
    { value: 15, threshold: 30, name: '天天神券 满30减15', desc: '今日美食外卖通用' },
    { value: 18, threshold: 38, name: '天天神券 满38减18', desc: '午晚高峰可用' },
    { value: 22, threshold: 55, name: '天天神券 满55减22', desc: '多人餐更划算' },
    { value: 12, threshold: 25, name: '天天神券 下午茶红包', desc: '奶茶甜品可用' },
    { value: 8, threshold: 18, name: '天天神券 夜宵补贴', desc: '烧烤炸鸡可用' },
    { value: 5, threshold: 0, name: '天天神券 配送抵扣', desc: '抵扣配送费和小额订单' },
    { value: 28, threshold: 68, name: '天天神券 大额满减', desc: '周末聚餐可用' }
  ] as const
  const first = dayNumber % pool.length
  const second = (first + 3) % pool.length
  const daily = [pool[first], pool[second]].map((coupon, index) => ({
    id: `daily-${dayKey}-${index}`,
    type: index === 1 && coupon.threshold === 0 ? 'delivery' as const : 'fullReduction' as const,
    value: coupon.value,
    threshold: coupon.threshold,
    name: coupon.name,
    desc: coupon.desc,
    validity: '今日23:59前有效',
    claimed: false
  }))
  return [
    ...daily,
    ...defaultCoupons.map(coupon => ({ ...coupon, id: `base-${coupon.id}` }))
  ]
}

export const useOrderStore = defineStore('order', () => {
  const defaultAddress: Address = {
    name: '张同学',
    phone: '138****8888',
    city: '北京市',
    detail: '朝阳区建国路88号',
    doorplate: '空气美食研究所 18层'
  }
  const currentOrder = ref<Order | null>(readStored('blm-current-order', null))
  const orders = ref<Order[]>(readStored('blm-orders', []))
  const address = ref<Address>(readStored('blm-address', defaultAddress))

  function updateAddress(next: Address) {
    address.value = { ...next }
  }

  function createOrder() {
    const cart = useCartStore()
    currentOrder.value = {
      id: `BLM${Date.now()}`,
      items: JSON.parse(JSON.stringify(cart.items)),
      shopName: cart.shopName,
      address: { ...address.value },
      status: '配送中',
      totalAmount: cart.totalPrice,
      deliveryFee: cart.deliveryFee,
      discountAmount: cart.discountAmount,
      finalAmount: cart.finalPrice,
      savedAmount: cart.totalPrice,
      createdAt: Date.now()
    }
    orders.value.unshift(currentOrder.value)
    return currentOrder.value
  }

  function finishCurrentOrder() {
    if (!currentOrder.value) return
    currentOrder.value.status = '已完成'
    const hit = orders.value.find(order => order.id === currentOrder.value?.id)
    if (hit) hit.status = '已完成'
  }

  function cancelCurrentOrder() {
    if (!currentOrder.value) return
    currentOrder.value.status = '已取消'
    const hit = orders.value.find(order => order.id === currentOrder.value?.id)
    if (hit) hit.status = '已取消'
  }

  watch(currentOrder, value => writeStored('blm-current-order', value), { deep: true })
  watch(orders, value => writeStored('blm-orders', value), { deep: true })
  watch(address, value => writeStored('blm-address', value), { deep: true })

  return { currentOrder, orders, address, updateAddress, createOrder, finishCurrentOrder, cancelCurrentOrder }
})

export const useDeliveryStore = defineStore('delivery', () => {
  const status = ref<DeliveryStatus>('preparing')
  const position = ref({ x: 24, y: 58 })
  const message = ref('商家正在备餐 承诺6分钟出餐')
  const showPopup = ref(false)
  const started = ref(false)
  let timer = 0

  function update(elapsed: number) {
    if (elapsed < 10) {
      status.value = 'preparing'
      position.value = { x: 22, y: 58 }
      message.value = '商家正在备餐 承诺6分钟出餐'
    } else if (elapsed < 20) {
      status.value = 'accepted'
      const p = (elapsed - 10) / 10
      position.value = { x: 25 + p * 18, y: 70 - p * 14 }
      message.value = `骑士正赶往商家 距商家${Math.round(556 - p * 476)}m | ${Math.max(1, 8 - Math.round(p * 6))}分钟`
    } else if (elapsed < 40) {
      status.value = 'delivering'
      const p = (elapsed - 20) / 20
      position.value = { x: 43 + p * 32, y: 56 - p * 26 }
      message.value = `骑士已取餐，正在为您配送 距您${Math.max(100, Math.round(500 - p * 400))}m`
    } else if (elapsed < 60) {
      status.value = 'rerouting'
      const p = (elapsed - 40) / 20
      position.value = { x: 75 - p * 16, y: 30 + p * 24 }
      message.value = '骑手正在重新规划路线'
      showPopup.value = elapsed < 46
    } else {
      status.value = 'lost'
      position.value = { x: 58, y: 55 }
      message.value = '你的外卖决定永远留在路上'
      showPopup.value = false
      window.clearInterval(timer)
      started.value = false
    }
  }

  function start() {
    reset()
    started.value = true
    const begin = Date.now()
    timer = window.setInterval(() => update(Math.floor((Date.now() - begin) / 1000)), 500)
  }

  function reset() {
    window.clearInterval(timer)
    status.value = 'preparing'
    position.value = { x: 24, y: 58 }
    message.value = '商家正在备餐 承诺6分钟出餐'
    showPopup.value = false
    started.value = false
  }

  return { status, position, message, showPopup, started, start, reset }
})

export const useUserStore = defineStore('user', () => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const saved = readStored('blm-user', { totalOrders: 0, totalSaved: 0, monthlySaved: 0, monthKey: currentMonth, streak: 0, participants: 128934, latestTitle: '空气美食家', completedOrderIds: [] as string[] })
  const monthChanged = Boolean(saved.monthKey && saved.monthKey !== currentMonth)
  const totalOrders = ref(saved.totalOrders)
  const totalSaved = ref(saved.totalSaved)
  const monthlySaved = ref(monthChanged ? 0 : (saved.monthlySaved ?? saved.totalSaved))
  const streak = ref(saved.streak)
  const participants = ref(saved.participants)
  const latestTitle = ref(titleFor(monthlySaved.value))
  const completedOrderIds = ref<string[]>(saved.completedOrderIds || [])
  function complete(amount: number, orderId = '') {
    if (orderId && completedOrderIds.value.includes(orderId)) return
    totalOrders.value += 1
    totalSaved.value += amount
    monthlySaved.value += amount
    streak.value += 1
    participants.value += Math.floor(100 + Math.random() * 400)
    if (orderId) completedOrderIds.value.push(orderId)
    latestTitle.value = titleFor(monthlySaved.value)
  }
  watch([totalOrders, totalSaved, monthlySaved, streak, participants, latestTitle, completedOrderIds], () => {
    writeStored('blm-user', {
      totalOrders: totalOrders.value,
      totalSaved: totalSaved.value,
      monthlySaved: monthlySaved.value,
      monthKey: currentMonth,
      streak: streak.value,
      participants: participants.value,
      latestTitle: latestTitle.value,
      completedOrderIds: completedOrderIds.value
    })
  }, { deep: true })

  return { totalOrders, totalSaved, monthlySaved, streak, participants, latestTitle, complete }
})

function titleFor(amount: number) {
  return amount >= 3000 ? '空盘中仙' : amount >= 1000 ? '无肴居士' : amount >= 500 ? '空气老饕' : '空气美食家'
}
