<script setup lang="ts">
import Header from './header/Header.vue'
import Footer from './footer/Footer.vue'

/*
注意:
gsap和vuetify之間有些情況會產生bug。

情境一 (vuetify ssr)
vuetify開啟ssr會讓gsap滾動的start end出現bug。

解決方法:不要開啟vuetify的ssr。

情境二 (vuetify ssr2)
vuetify開啟ssr，然後使用useDisplay來作為dom的"v-if斷點"使用，這會導致gsap抓不到這個dom，無法發生變化。

解決方法:
用gsap.set來設定，先給要做v-if斷點處理的dom加上mobile或desktop的class，然後再跑迴圈用gsap.set設定display。

情境三 (css)
因為vuetify的class css是important，所以使用gsap時會無法改變，要特別注意。

解決方法:要變化的css不要用vuetify的class設定，用gsap.set設定。

總結:
1.不要開啟vuetify的ssr
2.用gsap的時候，要設定css要特別小心，盡量都用gsap.set處理，並且gsap.set要設定在上方。
*/

// 如果從其他頁非頂部跳轉 到新頁面的scrollY會跟前一頁一樣
// 這會造成scrollTrigger start end產生問題
// 所以要跳回頁面的頂部 (這裡主要是處理F5重新整理時的)
const nuxtApp = useNuxtApp()
nuxtApp.hook('page:finish', () => {
  window.scrollTo(0, 0)
})

// server時
const isServer = computed(() => {
  return !process.client
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
      <v-main :style="{marginTop:'80px'}">
        <div>
          <slot />
        </div>
      </v-main>

      <!-- 不放到client-only F5重整有可能出現2個footer -->
      <Footer v-if="!isServer" />
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
