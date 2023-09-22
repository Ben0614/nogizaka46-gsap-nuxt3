<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import logo from '@/assets/images/nogizaka46/Nogizaka46_logo_long.png'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const header = ref<HTMLDivElement | null>(null)
const router = useRouter()
const goToPage = (paegName:string) => {
  router.push({ name: paegName })
}

onMounted(() => {
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
</script>

<template>
  <div ref="header" class="header bg-white">
    <v-container class="d-flex align-center">
      <div>
        <img :style="{ cursor: 'pointer' }" width="200px" :src="logo" contain @click="goToPage('index')">
      </div>
      <h3 :style="{ cursor: 'pointer' }" class="ml-10 text-purple text-h6 font-weight-bold" @click="goToPage('joinUs')">
        Join us
      </h3>
      <h3 :style="{ cursor: 'pointer' }" class="ml-10 text-purple text-h6 font-weight-bold" @click="goToPage('ohitorisamaTengoku')">
        33rd
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
