<script lang="ts" setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useDisplay } from 'vuetify'
import Lenis from '@studio-freight/lenis'
import { memberInfoList } from '@/data/member'
import { IMemberInfoList } from '@/model/member'
import leftImg from '@/assets/images/nogizaka46/member/left_banner_bg.jpg'
import rightImg from '@/assets/images/nogizaka46/member/right_banner_bg.jpg'
import banner46 from '@/assets/images/nogizaka46/member/banner46.png'
import daughter from '@/assets/images/nogizaka46/member/daughter.png'

const leftBg = computed(() => {
  return {
    backgroundImage: `url(${leftImg})`,
    backgroundSize: 'cover'
  }
})
const rightBg = computed(() => {
  return {
    backgroundImage: `url(${rightImg})`
  }
})

definePageMeta({
  middleware: 'return-to-top'
})

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// server時
const isServer = computed(() => {
  return !process.client
})

// 這些斷點是給template用  (gsap要用gsap自己的斷點)
const { name } = useDisplay()
const isMobile = computed(() => {
  return ['xs', 'sm'].includes(name.value)
})
const isSmallDesktop = computed(() => {
  return ['md', 'lg'].includes(name.value)
})

const infoList: IMemberInfoList = reactive(memberInfoList)

const ctx = ref()
// gsap斷點用
const mm = gsap.matchMedia()

// lenis設定
const lenis = ref()

if (process.client) {
  lenis.value = new Lenis()
  lenis.value.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.value.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
}

// 清除
onUnmounted(() => {
  // gsap
  ctx.value.revert() // <- Easy Cleanup!
  // lenis (要停止和清除 否則換頁時會無法回到頂部)
  lenis.value.stop()
  lenis.value.destroy()
})

onMounted(() => {
  ctx.value = gsap.context(() => {
    mm.add({
      isMobile: '(max-width: 959px)',
      isSmallDesktop: '(min-width: 960px) and (max-width: 1280px)',
      isBigDesktop: '(min-width: 1281px)',
    }, (context) => {
      // 解構出來
      const { isMobile, isSmallDesktop, isBigDesktop } = context.conditions ?? {}

      // banner黑色遮罩
      gsap.to('.overlay', {
        xPercent: 100,
        duration: 1,
        delay: 0.5,
        onComplete: function () {
          gsap.to('.right img, .right h2', {
            opacity: 1,
            duration: 2,
          })
          gsap.to('.daughter', {
            right: 0,
            duration: 2,
          })
        }
      })

      // 給每期的title高度
      gsap.set('.three-area .title-wrap,.four-area .title-wrap,.five-area .title-wrap', {
        height: '1000px',
      })

      const titles: HTMLElement[] = gsap.utils.toArray('.title-wrap h3')
      // 改變title
      titles.forEach((item, index) => {
        const t = gsap.timeline(
          {
            scrollTrigger: {
              trigger: item,
              start: 'top top+=80px', // (物件開始位置, 卷軸(變化)開始位置) top center bottom px
              end: 'bottom+=800px top+=80px', // (物件結束位置, 卷軸(變化)結束位置)
              scrub: true,
              pin: true,
              // markers: true,
            }
          }
        )
        t.to(item, {
          fontSize: '40px',
        })
          .to(item, {
            fontSize: '60px',
          })
          .to(item, {
            fontSize: '80px',
          })
          .to(item, {
            fontSize: '80px',
          })
      })

      const allInfos: HTMLElement[] = gsap.utils.toArray('.infos .info')
      const threeInfos: HTMLElement[] = gsap.utils.toArray('.three-area .infos .info')
      const fourInfos: HTMLElement[] = gsap.utils.toArray('.four-area .infos .info')
      const fiveInfos: HTMLElement[] = gsap.utils.toArray('.five-area .infos .info')

      // 全部成員共用
      allInfos.forEach((info, index) => {
        // console.log('info', info)

        // 圖片如果在client才顯示的時候 gsap會抓不到圖片的高度
        // 所以需要先預設給容器一個高度 gsap會依照那個高度來處理scrollTrigger
        // 高度用min-height 不要直接用height寫死
        gsap.set(info, {
          'min-height': isMobile ? '235px' : isSmallDesktop ? '300px' : '447px',
        })

        info.addEventListener('mouseenter', () => {
          const img = info.querySelector('img')
          gsap.to(img, {
            scale: 1.2
          })
        })
        info.addEventListener('mouseleave', () => {
          const img = info.querySelector('img')
          gsap.to(img, {
            scale: 1
          })
        })
      })
      // 三期
      threeInfos.forEach((info, index) => {
        gsap.set(info, {
          translateX: index % 2 === 0 ? '-700%' : '700%',
        })

        gsap.to(info, {
          scrollTrigger: {
            trigger: info,
            start: 'top center+=10%', // (物件開始位置, 卷軸(變化)開始位置) top center bottom px
            end: 'top center+=10%', // (物件結束位置, 卷軸(變化)結束位置)
            // markers: true,
          },
          translateX: 0,
          duration: 1,
          ease: 'back.out' // 動畫變化方式 (好用)
        })
      })
      // 四期
      fourInfos.forEach((info, index) => {
        gsap.set(info, {
          translateY: '100%',
        })

        gsap.to(info, {
          scrollTrigger: {
            trigger: info,
            start: 'top bottom', // (物件開始位置, 卷軸(變化)開始位置) top center bottom px
            end: 'top bottom', // (物件結束位置, 卷軸(變化)結束位置)
            // markers: true,
          },
          translateY: 0,
          rotationY: index % 2 === 0 ? 360 : -360,
          duration: 0.7,
        })
      })
      // 五期
      fiveInfos.forEach((info, index) => {
        gsap.set(info, {
          translateY: '100%',
          scale: 0.3
        })

        gsap.to(info, {
          scrollTrigger: {
            trigger: info,
            start: 'top bottom', // (物件開始位置, 卷軸(變化)開始位置) top center bottom px
            end: 'top bottom', // (物件結束位置, 卷軸(變化)結束位置)
            // markers: true,
          },
          translateY: 0,
          rotationZ: index % 2 === 0 ? 1080 : -1080,
          scale: 1,
          duration: 0.7,
        })
      })
    })
  })
})

</script>

<script lang="ts">
export default {
  name: 'Member',
}
</script>

<template>
  <div v-if="!isServer" class="wrap">
    <div class="banner">
      <div class="left" :style="leftBg">
        <div class="overlay" />
      </div>
      <div class="right" :style="rightBg">
        <img :src="banner46">
        <div>
          <h2>今が思い出になるまで</h2>
        </div>
      </div>
      <div class="daughter">
        <img :src="daughter">
      </div>
    </div>
    <div class="member-area">
      <v-container>
        <h2 class="text-purple">
          Member
        </h2>
        <div class="three-area">
          <div class="title-wrap">
            <h3>3期</h3>
          </div>
          <div class="infos">
            <div v-for="(member,index) in infoList.three" :key="index" class="info">
              <div class="info-pic">
                <img :src="member.src" alt="">
              </div>
              <p>{{ member.name }}</p>
            </div>
          </div>
        </div>
        <div class="four-area">
          <div class="title-wrap">
            <h3>4期</h3>
          </div>
          <div class="infos">
            <div v-for="(member,index) in infoList.four" :key="index" class="info">
              <div class="info-pic">
                <img :src="member.src" alt="">
              </div>
              <p>{{ member.name }}</p>
            </div>
          </div>
        </div>
        <div class="five-area">
          <div class="title-wrap">
            <h3>5期</h3>
          </div>
          <div class="infos">
            <div v-for="(member,index) in infoList.five" :key="index" class="info">
              <div class="info-pic">
                <img :src="member.src" alt="">
              </div>
              <p>{{ member.name }}</p>
            </div>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap{
  overflow: hidden;
}
.banner{
  display: flex;
  height: calc(100vh - 80px);
  position: relative;
  margin: 0 0 100px 0;
  @media screen and (max-width: '959px') {
    flex-direction: column;
  }

  .left{
    width: 60%;
    overflow: hidden;
    .overlay{
      width:100%;
      height:100%;
      background: #000;
    }

    @media screen and (max-width: '959px') {
      height:100%;
      width: 100%;
    }
  }
  .right{
    width: 40%;
    padding: 50px;

    @media screen and (max-width: '959px') {
      width: 100%;
    }

    h2{
      color: #e0ae6b;
      text-align: center;
      font-size: 25px;
      letter-spacing: 10px;
      font-weight: 400;
      margin: 20px 0 0 0;

      @media screen and (max-width: '959px') {
        font-size: 25px;
        margin: 20px 0 0 0;
      }
      @media screen and (min-width: '1281px') {
        font-size: 40px;
        margin: 50px 0 0 0;
      }
    }

    h2,img{
      opacity: 0
    }
  }

  .daughter{
    position: absolute;
    bottom: -100px;
    right: -20%;
    width: 120px;
    @media screen and (max-width: '959px') {
      right: -50%;
    }
    @media screen and (min-width: '1281px') {
      bottom: -150px;
      width: 200px;
    }
  }
}

.member-area{
  h2{
    font-size: 50px;
    text-align: center;
  }
  .three-area,
  .four-area,
  .five-area
  {
    margin: 0 0 200px 0;
    h3{
      font-size: 30px;
      margin:0 0 20px 0
    }

    .infos{
      display:flex;
      flex-wrap: wrap;
      gap: 10px
    }
    .info{
      width: calc(20% - 10px);
      margin:0 0 10px 0;

      @media screen and (max-width: '959px') {
        width: calc(50% - 10px);
      }

      .info-pic{
      overflow:hidden;
      }

      p{
        text-align: center;
        font-size: 18px;
      }
    }
  }
}

img {
  width:100%;
  max-width:100%;
}

</style>
