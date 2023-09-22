<script setup lang="ts">
import Header from './header/Header.vue'
import Footer from './footer/Footer.vue'

// 如果從其他頁非頂部跳轉 到新頁面的scrollY會跟前一頁一樣
// 這會造成scrollTrigger start end產生問題
// 所以要跳回頁面的頂部 (這裡主要是處理F5重新整理時的)
const nuxtApp = useNuxtApp()
nuxtApp.hook('page:finish', () => {
  window.scrollTo(0, 0)
})

// 進度條
const progressHeight = ref(0)
const handleProgress = () => {
  // 頁面總高度 document.body.scrollHeight
  // 視窗高度 window.innerHeight
  // 滾動距離 window.scrollY
  // 步驟一 頁面總高度 - 視窗高度 (因為螢幕畫面的頂部無法到頁面最底部)
  // 步驟二 滾動距離 / 減完的總高度 (取百分比)
  // Math.round((num + Number.EPSILON) * 100) / 100; 可以四捨五入到小數點2位
  // 步驟三 結果 * 100 (因為取到的會是0.xx的格式 要變成%)
  const height =
    Math.round(
      (window.scrollY /
        (document.body.scrollHeight - window.innerHeight) +
        Number.EPSILON) *
      100
    ) / 100
  progressHeight.value = height * 100
}

onMounted(() => {
  window.addEventListener('scroll', handleProgress)
})
</script>

<template>
  <v-locale-provider>
    <v-app :theme="'BLUE_THEME'">
      <!-- 前台樣式 -->
      <Header />
      <!-- <client-only> -->
      <v-main :style="{marginTop:'80px'}">
        <!-- fluid -->
        <!-- <v-container class="pb-sm-15 pb-10"> -->
        <div>
          <slot />
        </div>
        <!-- </v-container> -->
      </v-main>

      <!-- 不放到client-only F5重整會出現2個footer -->
      <client-only>
        <Footer />
      </client-only>
      <!-- </client-only> -->
      <!-- 滾動進度條 -->
    </v-app>
  </v-locale-provider>
  <div class="progress" :style="{ height: progressHeight + '%' }" />
</template>

<style lang="scss" scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 5px;
  height: 0%;
  background-color: #812990;
  z-index: 10000;
}
</style>
