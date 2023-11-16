<script lang="ts" setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useDisplay } from 'vuetify'
import Lenis from '@studio-freight/lenis'
import { IPic } from '@/model/ohitorisamaTengoku'
import picOne from '@/assets/images/nogizaka46/33rd/1.jpg'
import picTwo from '@/assets/images/nogizaka46/33rd/2.jpg'
import picThree from '@/assets/images/nogizaka46/33rd/3.jpg'
import picFour from '@/assets/images/nogizaka46/33rd/4.jpg'
import picFive from '@/assets/images/nogizaka46/33rd/5.jpg'
// import picSix from '@/assets/images/nogizaka46/31st/6.jpg'
// import picSeven from '@/assets/images/nogizaka46/31st/7.jpg'
// import picEight from '@/assets/images/nogizaka46/31st/8.jpg'
// import picNight from '@/assets/images/nogizaka46/31st/9.jpg'
// import picTen from '@/assets/images/nogizaka46/31st/10.jpg'

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
console.log('isMobile', isMobile.value)
console.log('isSmallDesktop', isSmallDesktop.value)

const pics: IPic[] = reactive([
  {
    number: 'One',
    src: picOne,
  },
  {
    number: 'Two',
    src: picTwo,
  },
  {
    number: 'Three',
    src: picThree,
  },
  {
    number: 'Four',
    src: picFour,
  },
  {
    number: 'Five',
    src: picFive,
  },
  // {
  //   number: 'Six',
  //   src: picSix,
  // },
  // {
  //   number: 'Seven',
  //   src: picSeven,
  // },
  // {
  //   number: 'Eight',
  //   src: picEight,
  // },
  // {
  //   number: 'Night',
  //   src: picNight,
  // },
  // {
  //   number: 'Ten',
  //   src: picTen,
  // },
])

const activePic: IPic = reactive({
  number: 'One',
  src: picOne,
})

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

      // 第一層區域高 要寫在最上面 (重要)
      gsap.set('.section1', {
        height: isMobile || isSmallDesktop ? '750px' : '1350px',
      })

      // 預設那些dom是mobile顯示 哪些是desktop顯示
      // gsap.set 除非有要做個別設定 否則不用gsap.utils.toArray
      gsap.set('.is-mobile', {
        display: isMobile ? '' : 'none',
      })
      gsap.set('.is-desktop', {
        display: !isMobile ? '' : 'none'
      })
      gsap.set('.is-mobile-flex', {
        display: isMobile ? 'flex' : 'none',
        flexWrap: 'wrap'
      })

      // 文字rotate
      const rxs: HTMLElement[] = gsap.utils.toArray('.rx90')
      rxs.forEach((item, index) => {
        gsap.to(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top bottom-=10%',
            end: 'top bottom-=10%',
            scrub: 1,
            // markers: true,
          },
          rotationX: 0,
        })
      })
      // 線條
      const lines: HTMLElement[] = gsap.utils.toArray('.line')
      // 線條預設長度
      const widths = ['100%', '90%', '80%', '70%', '60%']
      // 線條
      lines.forEach((line, index) => {
        gsap.set(line, {
          width: widths[index],
        })
        gsap.to(line, {
          scrollTrigger: {
            trigger: '.lineWrap',
            scrub: 1,
            start: 'top center',
            end: 'top+=150 center-=100',
            // markers: true,
          },
          width: '100%',
          borderRadius: '0',
        })
      })
      // 半圓
      gsap.to('.semiCircle', {
        scrollTrigger: {
          trigger: '.lineWrap',
          scrub: 1,
          start: 'top center',
          end: 'top+=150 center',
          // markers: true,
        },
        yPercent: 100,
      })
      // 整個半圓和線條區域 (position)
      gsap.to('.circleLine', {
        // start end 用 bottom 為基準 兩個內容必須一樣
        // 因為原本fixed有top:35% 所以改成staic必須用translateY35%
        // 開始結束是bottom+=50% 所以translateY必須35%+50%
        scrollTrigger: {
          trigger: '.circleLine',
          start: 'bottom+=30% center',
          end: 'bottom+=30% center',
          scrub: true,
          // markers: true,
          // onUpdate: () => {
          //   const circleLine = document.querySelector('.circleLine')
          //   // 距離頂部的距離 + 自身的高 + 135
          //   // 135 是lineWrap的高度325 扣掉5條line+它們的mb總共190 後的高度
          //   // 不加135的話下方的區域會被擋到
          //   const section1Height =
          //     circleLine.offsetTop + circleLine.offsetHeight + 135
          //   console.log('section1Height', section1Height)
          //   gsap.set('.section1', {
          //     height: () => section1Height,
          //   })
          // },
        },
        position: 'static',
        translateY: '65%',
      })
      // 左右的fixed文字
      const handleCompany = gsap
        .from('.company', {
          xPercent: i => (i === 0 ? -100 : 100),
          paused: true,
        })
        .progress(1)

      ScrollTrigger.create({
        onUpdate: (self) => {
          if (window.scrollY <= 0) {
            handleCompany.play()
          }
          if (window.scrollY > 0) {
            handleCompany.reverse()
          }
        },
      })

      // 第二區域的背景圓球區域
      // 滑到第二區域才顯示
      gsap.to('.circleBgWrap', {
        scrollTrigger: {
          trigger: '.section2',
          start: 'top center',
          end: 'top center',
          scrub: true,
          // markers: true,
        },
        display: 'block',
      })

      // 因為寬和高必須相同 所以在外面用random
      // const random = gsap.utils.random(100, 300, 10, true)
      // const randoms = []
      // for (let i = 0; i < 5; i++) {
      //   randoms.push(random())
      // }

      // 圓球 個別調整
      const circles: HTMLElement[] = gsap.utils.toArray('.circleBg')
      circles.forEach((circle, index) => {
        gsap.set(circle, {
          width: () => {
            let width = '0'
            if (index === 0) {
              width = '100px'
            }
            if (index === 1) {
              width = '125px'
            }
            if (index === 2) {
              width = '500px'
            }
            if (index === 3) {
              width = isMobile ? '0' : '100px'
            }
            if (index === 4) {
              width = isMobile ? '0' : '150px'
            }
            return width
          },
          height: () => {
            let height = '0'
            if (index === 0) {
              height = '100px'
            }
            if (index === 1) {
              height = '125px'
            }
            if (index === 2) {
              height = '500px'
            }
            if (index === 3) {
              height = isMobile ? '0' : '100px'
            }
            if (index === 4) {
              height = isMobile ? '0' : '150px'
            }
            return height
          },
          top: () => {
            let top = ''
            if (index === 0) {
              top = '10%'
            }
            if (index === 1) {
              top = isMobile ? '60%' : '40%'
            }
            if (index === 2) {
              top = '15%'
            }
            if (index === 3) {
              top = isMobile ? '0' : '15%'
            }
            if (index === 4) {
              top = isMobile ? '0' : '70%'
            }
            return top
          },
          left: () => {
            let left = ''
            if (index === 0) {
              left = '5%'
            }
            if (index === 1) {
              left = isMobile ? '0%' : '15%'
            }
            if (index === 2) {
              left = '30%'
            }
            if (index === 3) {
              left = isMobile ? '0' : '85%'
            }
            if (index === 4) {
              left = isMobile ? '0' : '95%'
            }
            return left
          },
          borderRadius: '50%',
        })
      })

      // 讓圓球外觀動畫改變
      gsap.to('.circleBg', {
        keyframes: [
          {
            borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
            duration: 3,
          },
          {
            borderRadius: '40% 60% 45% 55% / 49% 60% 40% 51%',
            duration: 3,
          },
          {
            borderRadius: '50% 50% 34% 66% / 56% 68% 32% 44%',
            duration: 3,
          },
          {
            borderRadius: '46% 54% 50% 50% / 35% 61% 39% 65%',
            duration: 3,
          },
        ],
        repeat: -1,
        yoyo: true,
      })
      // 圖片的list
      // 觸碰到就改變文字顏色並加上底線
      // 其他兄弟選項就恢復原狀
      const picList: HTMLElement[] = gsap.utils.toArray('.picList')
      picList.forEach((item, index) => {
        // 預設選中第一個
        if (index === 0) {
          gsap.set(item, {
            color: '#000',
            borderBottom: '1px solid #000',
          })
        }
        item.addEventListener('mouseenter', () => {
          // item和兄弟item的style必須都要寫 (color、borderBottom、duration)
          // 如果item有duration 兄弟item沒有 就會有bug
          gsap.to(item, {
            color: '#000',
            borderBottom: '1px solid #000',
            duration: 0.3,
          })
          // 其他兄弟item
          picList.forEach((children, index) => {
            if (children !== item) {
              gsap.to(children, {
                color: 'rgba(128,128,128,0.5)',
                borderBottom: 'none',
                duration: 0.3,
              })
            }
          })
        })
      })
      // 大圖片
      gsap.set('.avatar', {
        borderRadius: '61% 39% 57% 43% / 46% 67% 33% 54%',
      })
      // 大圖片外形動畫
      gsap.to('.avatar', {
        keyframes: [
          {
            borderRadius: '58% 42% 59% 41% / 52% 46% 54% 48%',
            duration: 3,
          },
          {
            borderRadius: '46% 54% 40% 60% / 52% 33% 67% 48%',
            duration: 3,
          },
          {
            borderRadius: '65% 35% 71% 29% / 31% 60% 40% 69%',
            duration: 3,
          },
          {
            borderRadius: '60% 40% 43% 57% / 45% 51% 49% 55%',
            duration: 3,
          },
        ],
        repeat: -1,
        yoyo: true,
      })
    })
  })
})

const changePic = (pic: IPic) => {
  Object.assign(activePic, pic)
}

</script>

<script lang="ts">
export default {
  name: 'OhitorisamaTengoku',
}
</script>

<template>
  <div v-if="!isServer" :style="{paddingTop:isMobile ? '200px' :isSmallDesktop ? '150px' : '300px'}">
    <!-- transformOrigin:'top left' -->
    <span :style="{position:'fixed',top:'50%',left:'-10px',zIndex:'2',transform:'rotate(270deg)'}" class="company font-weight-bold">乃木坂合同會社</span>
    <span :style="{position:'fixed',top:'50%',right:'0',zIndex:'2',transform:'rotate(270deg)'}" class="company font-weight-bold">sony music</span>

    <div class="section1">
      <h1 :style="{position:'relative',lineHeight:'110%',zIndex:'2',width:'50%'}" class="rx90 text-center mx-auto" :class="isMobile ? 'text-h4' : isSmallDesktop ? 'text-h3' : 'text-h1'">
        乃木坂46は太陽みたいなグループ
      </h1>
      <div :style="{position: 'fixed',top:'35%',left:'0',width:'100%'}" class="circleLine">
        <div :style="{position:'relative'}" class="semiCircle" />
        <div :style="{position:'relative'}" class="lineWrap d-flex flex-column align-center">
          <div v-for="(line) in 5" :key="line" class="line" :class="isSmallDesktop ? 'mb-5' : 'mb-7'" />
        </div>
      </div>
    </div>

    <v-container class="section2 py-10">
      <h1 :style="{position:'relative',zIndex:'2'}" class="rx90 text-center" :class="isMobile ? 'text-h5 mb-7' : isSmallDesktop ? 'text-h4 mb-10' : 'text-h3 mb-15'">
        33rd「おひとりさま天国」
      </h1>
      <div class="d-flex" :class="isMobile ? 'flex-column' : 'justify-space-around'">
        <!-- flex底下的元素好像可以直接用index 不用relative -->
        <div :style="{zIndex:'2'}" :class="isSmallDesktop ? 'd-flex' : ''">
          <div class="is-mobile-flex">
            <h4 v-for="(pic,index) in pics" :key="index" class="rx90 picList" :class="'text-h6 ml-4'" @mouseenter="changePic(pic)">
              {{ pic.number }}
            </h4>
          </div>
          <div class="is-desktop">
            <h4 v-for="(pic,index) in pics.slice(0,5)" :key="index" class="rx90 picList" :class="isSmallDesktop ? 'text-h5' : 'text-h4'" @mouseenter="changePic(pic)">
              {{ pic.number }}
            </h4>
          </div>
          <div class="is-desktop" :class="isSmallDesktop ? 'ml-10' : ''">
            <h4 v-for="(pic,index) in pics.slice(5)" :key="index" class="rx90 picList" :class="isSmallDesktop ? 'text-h5' : 'text-h4'" @mouseenter="changePic(pic)">
              {{ pic.number }}
            </h4>
          </div>
        </div>
        <div :style="{zIndex:'2'}" class="avatar">
          <img class="img" :src="activePic.src">
        </div>
      </div>
    </v-container>

    <div class="circleBgWrap">
      <div v-for="circle in 5" :key="circle" class="circleBg" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rx90 {
  transform: rotateX(90deg);
}
.semiCircle {
  width: 650px;
  height: 325px;
  margin: 0 auto;
  border-radius: 650px 650px 0 0;
  background: linear-gradient(
    to right,
    lightblue,
    rgb(173, 173, 255),
    lightpink
  );

  @media screen and (max-width: '1280px') {
    width: 350px;
    height: 175px;
    border-radius: 350px 350px 0 0;
  }
}
.lineWrap {
  min-height: 325px;
  background-color: rgba(246, 249, 252);
  @media screen and (max-width: '1280px') {
    min-height: 175px;
  }

  .line {
    height: 10px;
    border-radius: 0 0 10px 10px;
    background: linear-gradient(
      to right,
      lightblue,
      rgb(173, 173, 255),
      lightpink
    );
  }
}

.picList {
  cursor: pointer;
  font-weight: bold;
  margin: 0 0 20px 0;
  color: rgba(128, 128, 128, 0.5);
}

.avatar {
  width: 600px;
  height: 600px;
  max-width: 100%;
  object-fit: 'cover';
  overflow: hidden;

  @media screen and (max-width: '1280px') {
    width: 450px;
    height: 450px;
  }

  .img {
    width: 100%;
    height: 100%;
  }
}
.circleBgWrap {
  display: none;
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .circleBg {
    position: absolute;
    opacity: 0.6;
    background: linear-gradient(to right, #d964e6, #9198e5);
  }
}
</style>
