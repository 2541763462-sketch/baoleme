<template>
  <div class="page home">
    <header class="home-nav">
      <div class="challenge-title">
        <b>{{ challengeTitle }}</b>
        <span>本月已忍住 ¥{{ user.monthlySaved }}</span>
      </div>
      <div class="search">
        <span>饱了么</span>
        <input v-model="keyword" placeholder="搜索商家、品类或菜品">
        <button @click="keyword = keyword.trim()">搜索</button>
      </div>
    </header>

    <section class="hero-card">
      <div>
        <h1>今日外卖忍住挑战</h1>
        <p>{{ user.monthlySaved ? '本月省下真实外卖预算' : '模拟点餐，不花一分钱' }}</p>
      </div>
      <span>¥{{ user.monthlySaved }}</span>
    </section>

    <section class="challenge-progress">
      <div class="progress-top"><b>{{ nextMilestone.label }}</b><span>{{ nextMilestone.tip }}</span></div>
      <div class="progress-track"><i :style="{ width: progressWidth }"></i></div>
      <div class="milestones"><span>¥0</span><span>¥500</span><span>¥1000</span><span>¥3000</span></div>
    </section>

    <section class="category-grid">
      <button v-for="cat in homeCategories" :key="cat.id" class="category" :class="{ active: activeCategory === cat.name }" @click="chooseCategory(cat.name)">
        <div class="cat-icon cat-art" :class="`art-${cat.id}`"><i></i><em v-if="cat.badge">{{ cat.badge }}</em></div>
        <span>{{ cat.name }}</span>
      </button>
    </section>

    <section class="coupon-banner" @click="claimDailyCoupon">
      <div>
        <b>{{ dailyCoupon.title }}</b>
        <span>{{ dailyCoupon.desc }}</span>
      </div>
      <button>{{ dailyCoupon.button }}</button>
    </section>

    <div class="activity-row">
      <button class="activity activity-chicken" @click="activeCategory = '汉堡西餐'"><b>汉堡炸鸡</b><span>仿拟品牌专区</span><i><Drumstick :size="28" /></i></button>
      <button class="activity activity-drink" @click="activeCategory = '甜品饮品'"><b>奶茶咖啡</b><span>下午茶热门</span><i><Coffee :size="28" /></i></button>
      <button class="activity activity-meal" @click="activeCategory = '家常菜'"><b>米饭热炒</b><span>工作餐优先</span><i><Soup :size="28" /></i></button>
    </div>

    <div class="participants">今日已有 <b>{{ user.participants }}</b> 人成功忍住外卖</div>

    <div class="filters">
      <button v-for="filter in filters" :key="filter.key" :class="{ active: activeFilter === filter.key }" @click="activeFilter = filter.key">{{ filter.label }}</button>
      <button class="clear" @click="reset">重置</button>
    </div>

    <h2 class="section-title">{{ title }} <span>{{ filteredShops.length }}家</span></h2>
    <ShopCard v-for="shop in visibleShops" :key="shop.id" :shop="shop" @select="goShop" />
    <button v-if="visibleShops.length < filteredShops.length" class="load-more" @click="visibleCount += 20">
      查看更多商家 <span>{{ filteredShops.length - visibleShops.length }}家</span>
    </button>
    <div v-if="!filteredShops.length" class="empty compact">
      <SearchX :size="54" :stroke-width="1.6" />
      <h1>没有找到相关商家</h1>
      <button @click="reset">查看全部推荐</button>
    </div>
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Coffee, Drumstick, SearchX, Soup } from '@lucide/vue'
import ShopCard from '../components/ShopCard.vue'
import TabBar from '../components/TabBar.vue'
import { homeCategories, shops } from '../mock'
import { useCouponStore, useUserStore } from '../stores'
import type { Shop } from '../types'

const router = useRouter()
const user = useUserStore()
const coupon = useCouponStore()
const keyword = ref('')
const activeCategory = ref('全部')
const activeFilter = ref<'default' | 'fast' | 'free' | 'sales'>('default')
const visibleCount = ref(20)
const filters = [
  { key: 'default', label: '综合排序' },
  { key: 'fast', label: '送达最快' },
  { key: 'free', label: '免配送费' },
  { key: 'sales', label: '销量最高' }
] as const
const dailyCoupon = computed(() => {
  const today = coupon.coupons.find(item => item.id.startsWith(`daily-${coupon.todayKey}`))
  if (!today) return { title: '天天神券', desc: '今日神券已更新', button: '去领券' }
  return {
    title: today.name,
    desc: `${today.desc} · ${today.threshold ? `满${today.threshold}可用` : '无门槛'} · ${today.validity}`,
    button: today.claimed ? '已领取' : `领${today.value}元`
  }
})
const challengeTitle = computed(() => {
  if (user.monthlySaved >= 3000) return '本月称号：空盘中仙'
  if (user.monthlySaved >= 1000) return '本月称号：无肴居士'
  if (user.monthlySaved >= 500) return '本月称号：空气老饕'
  return '本月称号：空气美食家'
})
const nextMilestone = computed(() => {
  if (user.monthlySaved < 500) return { label: `距空气老饕还差 ¥${500 - user.monthlySaved}`, tip: '¥500 解锁空气老饕' }
  if (user.monthlySaved < 1000) return { label: `距无肴居士还差 ¥${1000 - user.monthlySaved}`, tip: '¥1000 解锁无肴居士' }
  if (user.monthlySaved < 3000) return { label: `距空盘中仙还差 ¥${3000 - user.monthlySaved}`, tip: '¥3000 解锁空盘中仙' }
  return { label: '已解锁本月最高称号', tip: '继续保持，月底结算战绩' }
})
const progressWidth = computed(() => {
  const saved = user.monthlySaved
  if (saved <= 500) return `${Math.max(0, saved / 500 * 33.33)}%`
  if (saved <= 1000) return `${33.33 + (saved - 500) / 500 * 33.33}%`
  return `${Math.min(100, 66.66 + (saved - 1000) / 2000 * 33.34)}%`
})

const title = computed(() => activeCategory.value === '全部' ? '附近推荐' : activeCategory.value)
const filteredShops = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  let list = shops.filter(shop => {
    const categoryOk = activeCategory.value === '全部' || activeCategory.value === '美食外卖' || shop.category === activeCategory.value
    const text = [shop.name, shop.category, shop.banner, ...shop.categories.flatMap(cat => cat.foods.map(food => food.name))].join(' ').toLowerCase()
    return categoryOk && (!query || text.includes(query))
  })
  if (activeFilter.value === 'fast') list = [...list].sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime))
  if (activeFilter.value === 'free') list = list.filter(shop => shop.deliveryFee === 0)
  if (activeFilter.value === 'sales') list = [...list].sort((a, b) => b.monthlySales - a.monthlySales)
  return list
})
const visibleShops = computed(() => filteredShops.value.slice(0, visibleCount.value))

watch([keyword, activeCategory, activeFilter], () => {
  visibleCount.value = 20
})

function chooseCategory(name: string) {
  activeCategory.value = name === '全部' ? '全部' : name
}

function reset() {
  keyword.value = ''
  activeCategory.value = '全部'
  activeFilter.value = 'default'
}

function claimDailyCoupon() {
  const today = coupon.coupons.find(item => item.id.startsWith(`daily-${coupon.todayKey}`) && !item.claimed)
  if (today) coupon.claimCoupon(today.id)
  router.push('/coupon')
}

function goShop(shop: Shop) {
  router.push(`/shop/${shop.id}`)
}
</script>
