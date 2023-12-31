<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useDisplay } from 'vuetify'
import logo from '@/assets/images/nogizaka46/Nogizaka46_logo_long.png'
import mobileLogo from '@/assets/images/nogizaka46/Nogizaka46_logo.png'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// 這些斷點是給template用  (gsap要用gsap自己的斷點)
const { name } = useDisplay()
const isMobile = computed(() => {
  return ['xs', 'sm'].includes(name.value)
})

const header = ref<HTMLDivElement | null>(null)
const router = useRouter()
const goToPage = (paegName:string) => {
  router.push({ name: paegName })
}

const ctx = ref()
// gsap斷點用
const mm = gsap.matchMedia()

onMounted(() => {
  ctx.value = gsap.context(() => {
    mm.add({
      isMobile: '(max-width: 959px)',
      isSmallDesktop: '(min-width: 960px) and (max-width: 1280px)',
      isBigDesktop: '(min-width: 1281px)',
    }, (context) => {
      // 解構出來
      const { isMobile, isSmallDesktop, isBigDesktop } = context.conditions ?? {}

      gsap.set('.is-mobile', {
        display: isMobile ? '' : 'none',
      })

      gsap.set('.is-desktop', {
        display: !isMobile ? '' : 'none'
      })

      // 不加progress 一開始header不會顯示
      const showAnim = gsap
        .from(header.value, {
          yPercent: -100,
          paused: true,
          duration: 0.2,
        })
        .progress(1)

      ScrollTrigger.create({
        start: '80 top',
        end: 'bottom',
        // markers: true,
        onUpdate: (self) => {
          self.direction === -1 ? showAnim.play() : showAnim.reverse()
        },
      })
    })
  })
})
</script>

<template>
  <div ref="header" class="header bg-white">
    <v-container class="d-flex align-center">
      <div>
        <!--
          用v-if無法顯示img

          解法:
          1.v-show
          2.v-img
          3.gsap.set (現在用的)
        -->
        <!-- inlineStyle先設定display: 'none' 否則在server時會同時出現手機和桌機的logo -->
        <img
          class="is-desktop"
          :style="{ display: 'none',cursor: 'pointer' }"
          width="200px"
          :src="logo"
          contain
          @click="goToPage('index')"
        >
        <img
          class="is-mobile"
          :style="{ display: 'none',cursor: 'pointer' }"
          width="40px"
          :src="mobileLogo"
          contain
          @click="goToPage('index')"
        >
      </div>
      <h3 :style="{ cursor: 'pointer' }" class="ml-10 text-purple text-h6 font-weight-bold" @click="goToPage('joinUs')">
        Join us
      </h3>
      <h3 :style="{ cursor: 'pointer' }" class="ml-10 text-purple text-h6 font-weight-bold" @click="goToPage('ohitorisamaTengoku')">
        33rd
      </h3>
      <h3 :style="{ cursor: 'pointer' }" class="ml-10 text-purple text-h6 font-weight-bold" @click="goToPage('member')">
        Member
      </h3>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  box-shadow: none !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px !important;
  border-bottom: 2px solid #1e3653;
  background-color: #fff;
  z-index: 100;
  border-bottom: '1px solid #000';
}
</style>
