<template>
  <div class="page community-page lark-community">
    <header class="community-head">
      <div>
        <span class="community-kicker">城市外卖口碑</span>
        <h1>美味外卖分享站</h1>
      </div>
      <span class="lark-status" :class="{ connected: Boolean(baseUrl) }"><Table2 :size="15" />{{ baseUrl ? '飞书已连接' : '模板配置中' }}</span>
    </header>

    <nav class="city-tabs" aria-label="城市筛选">
      <button v-for="city in cities" :key="city.name" :class="{ active: activeCity === city.name }" @click="activeCity = city.name">{{ city.name }}</button>
    </nav>

    <section class="city-spotlight">
      <div class="city-index">{{ String(activeCityIndex + 1).padStart(2, '0') }}</div>
      <div>
        <span><MapPin :size="15" />{{ currentCity.name }}</span>
        <h2>{{ currentCity.title }}</h2>
        <p>{{ currentCity.copy }}</p>
      </div>
    </section>

    <section class="lark-actions">
      <button class="primary" :disabled="!formUrl" @click="goToForm"><SquarePen :size="19" />发布一条</button>
      <button :disabled="!browseUrl" @click="openLink(browseUrl)"><ExternalLink :size="19" />查看分享</button>
    </section>

    <section class="submission-fields">
      <div><Store :size="19" /><span>商家名称</span></div>
      <div><Utensils :size="19" /><span>推荐菜品</span></div>
      <div><Image :size="19" /><span>美食图片</span></div>
      <div><MessageSquareText :size="19" /><span>推荐理由</span></div>
    </section>

    <section class="base-entry">
      <div class="base-entry-icon"><Table2 :size="27" /></div>
      <div>
        <h2>飞书美味外卖分享库</h2>
        <p>北上广深杭分区浏览，投稿通过后进入分享库。</p>
      </div>
      <button :disabled="!baseUrl" aria-label="打开飞书多维表格" @click="openLink(baseUrl)"><ChevronRight :size="21" /></button>
    </section>

    <p v-if="!baseUrl" class="base-pending">飞书模板授权完成后，此入口会自动启用。</p>
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight, ExternalLink, Image, MapPin, MessageSquareText, SquarePen, Store, Table2, Utensils } from '@lucide/vue'
import TabBar from '../components/TabBar.vue'

const cities = [
  { name: '北京', viewId: 'vewfbU11yV', title: '北京外卖分享', copy: '记录写字楼午餐、社区小馆和深夜外卖。' },
  { name: '上海', viewId: 'vew008IYyp', title: '上海外卖分享', copy: '发现工作餐、精致简餐和街区口碑店。' },
  { name: '广州', viewId: 'vewtbq8Ehd', title: '广州外卖分享', copy: '收集广式烧味、糖水和地道小炒。' },
  { name: '深圳', viewId: 'vewQAOWB27', title: '深圳外卖分享', copy: '分享园区午餐、夜宵和周末快乐餐。' },
  { name: '杭州', viewId: 'vew4UsM3uf', title: '杭州外卖分享', copy: '记录本帮风味、轻食咖啡和宝藏小店。' }
]

const activeCity = ref('北京')
const baseRoot = 'https://my.feishu.cn/base/En2MbGihZazx5ds95hkcBiRenme'
const tableId = 'tblt0AN0cCGNVxJJ'
const baseUrl = import.meta.env.VITE_FEISHU_COMMUNITY_URL || `${baseRoot}?table=${tableId}&view=vewmWzpckb`
const formUrl = import.meta.env.VITE_FEISHU_COMMUNITY_FORM_URL || 'https://my.feishu.cn/share/base/form/shrcnG5kubRQTLjFvLTodnbOXHf'
const activeCityIndex = computed(() => cities.findIndex(city => city.name === activeCity.value))
const currentCity = computed(() => cities[activeCityIndex.value] || cities[0])
const browseUrl = computed(() => `${baseRoot}?table=${tableId}&view=${currentCity.value.viewId}`)

function openLink(url: string) {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

function goToForm() {
  if (!formUrl) return
  window.location.assign(formUrl)
}
</script>
