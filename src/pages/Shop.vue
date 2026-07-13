<template>
  <div class="page shop-page">
    <div class="shop-banner">
      <img :src="shop.cover" :alt="shop.name">
      <button aria-label="返回" @click="router.back()"><ArrowLeft :size="23" /></button>
      <div>
        <button aria-label="搜索本店菜品" @click="showSearch = !showSearch"><Search :size="20" /></button>
        <button aria-label="收藏店铺" :class="{ loved: favorite }" @click="favorite = !favorite"><Heart :size="22" :fill="favorite ? 'currentColor' : 'none'" /></button>
      </div>
    </div>

    <div class="mode-tabs"><button :class="{ active: mode === 'delivery' }" @click="mode = 'delivery'">外送</button><button :class="{ active: mode === 'pickup' }" @click="mode = 'pickup'">自取</button></div>

    <section class="shop-head">
      <div class="avatar" :style="{ background: shop.color }">{{ shop.avatar }}</div>
      <h1>{{ shop.name }}</h1>
      <p><b>★ {{ shop.rating }}</b><span>月售{{ shop.monthlySales }}+</span><span>{{ mode === 'delivery' ? '蜂鸟准时达 约' + shop.deliveryTime : '到店自取约15分钟' }}</span><span>{{ shop.distance }}</span></p>
      <em>{{ shop.category }} · 起送¥{{ shop.minOrder }} · {{ shop.deliveryFee === 0 ? '免配送费' : '配送¥' + shop.deliveryFee }}</em>
    </section>

    <section class="promo-box">
      <p>本店优惠 <b>{{ shop.promotions.length }}个活动</b></p>
      <div><span v-for="promo in shop.promotions" :key="promo.id" class="tag red">{{ promo.label }}</span></div>
    </section>

    <div class="shop-tabs">
      <button :class="{ active: shopView === 'menu' }" @click="shopView = 'menu'">点餐</button>
      <button :class="{ active: shopView === 'reviews' }" @click="shopView = 'reviews'">评价 {{ 180 + shop.monthlySales % 320 }}</button>
      <button :class="{ active: shopView === 'info' }" @click="shopView = 'info'">商家</button>
      <button class="group-order" @click="shareText = '拼单已创建'"><UsersRound :size="15" />{{ shareText }}</button>
    </div>
    <Transition name="collapse">
      <div v-if="showSearch && shopView === 'menu'" class="menu-search"><input v-model="foodKeyword" placeholder="搜索本店菜品"><button @click="foodKeyword = ''">清空</button></div>
    </Transition>

    <main v-if="shopView === 'menu'" class="menu-area">
      <aside>
        <button v-for="(cat, idx) in shop.categories" :class="{ active: idx === active }" @click="active = idx" :key="cat.id">{{ cat.name }}</button>
      </aside>
      <section class="food-list">
        <div v-if="active === 0 && !foodKeyword" class="recommend">
          <h3>商家推荐</h3>
          <div class="rec-row">
            <div class="rec-card" v-for="food in shop.categories[0].foods" :key="food.id">
              <img :src="food.image" :alt="food.name" loading="lazy" decoding="async">
              <b>{{ food.name }}</b>
              <span>预估到手</span>
              <p>¥{{ food.price }} <button @click="add(food)">+</button></p>
            </div>
          </div>
        </div>
        <FoodCard v-for="food in currentFoods" :key="food.id" :food="food" :quantity="qty(food.id)" @add="add" @remove="cart.removeItem" />
        <div v-if="!currentFoods.length" class="empty compact"><SearchX :size="48" :stroke-width="1.6" /><h1>本店暂无匹配菜品</h1></div>
      </section>
    </main>

    <section v-else-if="shopView === 'reviews'" class="shop-detail-view review-list">
      <header><b>{{ shop.rating }}</b><div><strong>商家评分</strong><span>口味 {{ shop.rating }} · 包装 4.8 · 配送 4.9</span></div></header>
      <article><b>空气饭友</b><span>今天 12:20</span><p>餐品包装完整，口味和描述一致，配送速度也很稳定。</p></article>
      <article><b>午饭研究员</b><span>昨天 18:42</span><p>分量合理，招牌菜值得再点，图片与实物相符。</p></article>
      <article><b>附近上班族</b><span>07-10 13:06</span><p>午高峰也准时送到，整体体验不错。</p></article>
    </section>

    <section v-else class="shop-detail-view merchant-info">
      <h2>{{ shop.name }}</h2>
      <p><span>商家品类</span><b>{{ shop.category }}</b></p>
      <p><span>配送时间</span><b>{{ shop.deliveryTime }}</b></p>
      <p><span>起送与配送</span><b>起送 ¥{{ shop.minOrder }} · {{ shop.deliveryFee ? `配送 ¥${shop.deliveryFee}` : '免配送费' }}</b></p>
      <p><span>商家公告</span><b>{{ shop.banner }}</b></p>
      <p><span>食品安全</span><b>商家资质已公示</b></p>
    </section>

    <CartBar v-if="shopView === 'menu'" :count="cart.totalCount" :total="cart.finalPrice" @open="showCart = true" @checkout="checkout" />
    <Transition name="sheet">
      <div v-if="showCart" class="cart-sheet" @click="showCart = false">
        <section @click.stop>
          <h3>购物车 <button @click="cart.clearCart()">清空</button></h3>
          <div v-if="cart.items.length" class="sheet-items">
            <p v-for="item in cart.items" :key="item.food.id">
              <img :src="item.food.image" :alt="item.food.name" loading="lazy" decoding="async">
              <span>{{ item.food.name }}</span>
              <b>¥{{ item.food.price * item.quantity }}</b>
              <button @click="cart.removeItem(item.food.id)">-</button>
              <i>{{ item.quantity }}</i>
              <button @click="cart.addItem(item.food, item.shopId, item.shopName)">+</button>
            </p>
          </div>
          <div v-else class="cart-empty">购物车还是空的</div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Heart, Search, SearchX, UsersRound } from '@lucide/vue'
import CartBar from '../components/CartBar.vue'
import FoodCard from '../components/FoodCard.vue'
import { shops } from '../mock'
import { useCartStore, useCouponStore } from '../stores'
import type { Food } from '../types'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const coupon = useCouponStore()
const shop = shops.find(s => s.id === route.params.id) || shops[0]
const active = ref(0)
const mode = ref<'delivery' | 'pickup'>('delivery')
const showCart = ref(false)
const showSearch = ref(false)
const favorite = ref(false)
const foodKeyword = ref('')
const shareText = ref('好友拼单')
const shopView = ref<'menu' | 'reviews' | 'info'>('menu')

const currentFoods = computed(() => {
  const query = foodKeyword.value.trim().toLowerCase()
  const list = query ? shop.categories.flatMap(cat => cat.foods) : shop.categories[active.value].foods
  return query ? list.filter(food => food.name.toLowerCase().includes(query) || food.desc.toLowerCase().includes(query)) : list
})

function qty(id: string) {
  return cart.items.find(i => i.food.id === id)?.quantity || 0
}

function add(food: Food) {
  cart.addItem(food, shop.id, shop.name)
}

function checkout() {
  if (!cart.totalCount) return
  const best = coupon.bestCoupon(cart.totalPrice)
  if (best) cart.selectedCouponId = best.id
  router.push('/confirm')
}
</script>
