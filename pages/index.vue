<script lang="ts" setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Lenis from '@studio-freight/lenis'
import { useDisplay } from 'vuetify'
import { ICardData } from '@/model/index'
import BtnNormal from '@/components/base/BtnNormal.vue'
import PlayCircle from '@/components/PlayCircle.vue'
import topVideo from '@/assets/video/22nd.mp4'
import centerImg from '@/assets/images/nogizaka46/nogizaka46.jpeg'
import card1Img from '@/assets/images/nogizaka46/Route246.jpg'
import card2Img from '@/assets/images/nogizaka46/32nd.jpg'

definePageMeta({
  middleware: 'return-to-top'
})

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// server時
const isServer = computed(() => {
  return !process.client
})

const router = useRouter()
// 這些斷點是給template用  (gsap要用gsap自己的斷點)
const { name } = useDisplay()
const isMobile = computed(() => {
  return ['xs', 'sm'].includes(name.value)
})
const isSmallDesktop = computed(() => {
  return ['md', 'lg'].includes(name.value)
})

const dialogVideo = ref(false)
const dialogVideo2 = ref(false)
const cardData: ICardData[] = reactive([
  {
    title: 'Route246',
    subTitle: '2020/7/24',
    content:
      '乃木坂46的第3首數位下載限定歌曲，於2020年7月24日由N46Div.推出。',
    img: card1Img,
    link: 'https://www.youtube.com/watch?v=K79X85nyUp0&ab_channel=%E4%B9%83%E6%9C%A8%E5%9D%8246OFFICIALYouTubeCHANNEL',
  },
  {
    title: '人は夢を二度見る',
    subTitle: '2023/3/29',
    content:
      '乃木坂46的第32張單曲，由秋元康作詞、杉山勝彥作曲。2023年3月29日由N46Div.發行。本作採用雙Center制，同名標題曲的Center（中心成員）由山下美月和久保史緒里共同擔任。',
    img: card2Img,
    link: 'https://www.youtube.com/watch?v=DHea-Qcy9g0&ab_channel=%E4%B9%83%E6%9C%A8%E5%9D%8246OFFICIALYouTubeCHANNEL',
  },
])

const videoWrap = ref<HTMLDivElement | null>(null)
const greyCircle = ref<HTMLDivElement | null>(null)
const circleWrap = ref<HTMLDivElement | null>(null)

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
  ctx.value = gsap.context((self) => {
    // 設置gsap斷點
    mm.add({
      isMobile: '(max-width: 959px)',
      isDesktop: '(min-width: 960px)'
    }, (context) => {
      // 解構出來
      const { isDesktop, isMobile } = context.conditions ?? {}
      // fadeUp
      const fadeUps: HTMLElement[] = gsap.utils.toArray('.fade-up')
      fadeUps.forEach((fadeUp) => {
        gsap.from(fadeUp, {
          scrollTrigger: {
            trigger: fadeUp,
            // markers: true
          },
          y: 100,
          opacity: 0,
        })
      })
      // videoWrap
      gsap.to(videoWrap.value, {
        // x: 300,
        // rotation: 360,
        duration: 1,
        width: '100%',
        borderRadius: '0px',
        scrollTrigger: {
          trigger: videoWrap.value, // 觸發得物件
          start: 'top +=50%', // (物件開始位置, 卷軸(變化)開始位置) top center bottom px
          end: '+=50%', // (物件結束位置, 卷軸(變化)結束位置)
          pin: false, // 物件執行完動畫會跟著卷軸走，類似 fixed-top
          scrub: true, // 物件動畫根據卷軸捲動程度跑 (可用數字或布林)
          // markers: true, // 顯示標記
        },
      })
      // fade
      gsap.from('.fade', {
        scrollTrigger: {
          trigger: '.fade',
          start: isMobile ? 'center bottom' : 'center center+=200',
          // markers: true,
        },
        opacity: 0,
      })
      // circle
      // 這個會造成爆版 而且還會有bug 必須要在這個頁面最外層放overflow hidden解決
      gsap.to(greyCircle.value, {
        width: isMobile ? '100px' : '200px',
        height: isMobile ? '100px' : '200px',
        scale: 50,
        scrollTrigger: {
          trigger: greyCircle.value,
          start: 'top +=50%', // (物件開始位置, 卷軸開始位置) top center bottom px
          end: '+=50%', // (物件結束位置, 卷軸結束位置)
          pin: false,
          scrub: true,
          // markers: true,
        },
      })
      gsap.to(circleWrap.value, {
        overflow: 'hidden',
        // start: 'top top-=200',
        scrollTrigger: {
          trigger: circleWrap.value,
          start: isMobile ? 'top +=35%' : 'top top-=330', // (物件開始位置, 卷軸開始位置) top center bottom px
          end: 'top', // (物件結束位置, 卷軸結束位置)
          pin: false,
          scrub: true,
          // markers: true,
        },
      })
    })
  })

  // join
  // vuetify的class是important 會造成gsap無法覆蓋
  // css的:hover必須用深層寫法才能改變component的class 所以這裡先用gsap
  const joinArea: HTMLDivElement | null = document.querySelector('.joinArea')
  const joinBtnCircle: HTMLDivElement | null = document.querySelector(
    '.joinBtn > span > .btn-circle'
  )
  const joinBtnText: HTMLParagraphElement | null = document.querySelector('.joinBtn > span > .btn-text')
  console.log('joinBtnCircle', joinBtnCircle)
  console.log('joinBtnText', joinBtnText)
  // ref獲取法 較為麻煩
  // joinArea joinBtn 這兩個要寫到外面
  // const joinArea = ref<any | null>(null)
  // const joinBtn = ref<any | null>(null)
  // if (joinBtn.value) {
  //   const joinBtnCircle = joinBtn.value.$el.childNodes[5].childNodes[2]
  //   const joinBtnText = joinBtn.value.$el.childNodes[5].childNodes[3]
  //   console.log('joinBtnCircle', joinBtnCircle)
  //   console.log('joinBtnText', joinBtnText)
  if (joinArea) {
    joinArea.addEventListener('mouseenter', () => {
      gsap.to(joinArea, {
        duration: 0.3,
        backgroundColor: '#9e3eb2',
      })
      gsap.to(joinBtnCircle, {
        duration: 0.1,
        scale: 50,
      })
      gsap.to(joinBtnText, {
        duration: 0.3,
        color: '#9e3eb2',
      })
    })
    joinArea.addEventListener('mouseleave', () => {
      gsap.to(joinArea, {
        duration: 0.3,
        backgroundColor: '#000',
      })
      gsap.to(joinBtnCircle, {
        duration: 0.1,
        scale: 1,
      })
      gsap.to(joinBtnText, {
        duration: 0.3,
        color: '#fff',
      })
    })
  }
})

const openVideo = (val:boolean) => {
  dialogVideo.value = val
}
const openVideo2 = (val:boolean) => {
  dialogVideo2.value = val
}
const closeDialog = (val: boolean) => {
  dialogVideo.value = val
  dialogVideo2.value = val
}
// 觸碰到card
const showCard = (cardClass:string) => {
  // 手機版不做改變
  if (isMobile.value) { return }

  // 獲取card和底下的子元素
  const card: HTMLDivElement | null = document.querySelector(`.${cardClass}`)
  const cardImg: HTMLImageElement | null = document.querySelector(`.${cardClass} > .cardImg`)
  const cardTitle: HTMLHeadingElement | null = document.querySelector(
      `.${cardClass} > .cardText > .title`
  )
  const cardContent: HTMLParagraphElement | null = document.querySelector(
      `.${cardClass} > .cardText > .content`
  )
  const linkIcon: HTMLDivElement | null = document.querySelector(`.${cardClass} > .linkIcon`)

  // 卡片寬度
  if (card) {
    card.style.width = 'calc(80% - 10px)'
  }
  // 卡片圖片顯示
  if (cardImg) {
    cardImg.style.opacity = '1'
  }
  // 標題顏色
  if (cardTitle) {
    cardTitle.style.color = '#fff'
  }
  // 文字內容顯示
  if (cardContent) {
    cardContent.style.opacity = '1'
  }
  // icon背景色
  if (linkIcon) {
    linkIcon.style.backgroundColor = 'rgba(236, 236, 236,0.3)'
  }
  // 獲取其他卡片修改
  if (card && card.parentNode) {
    const p = card.parentNode.children
    const pArray = Array.from(p)
    // 其他卡片寬度修改
    pArray.forEach((children: Element) => {
      if (children !== card) {
        (children as HTMLElement).style.width = 'calc(20% - 10px)'
      }
    })
  }
}
// 從card移開
const closeCard = (cardClass:string) => {
  if (isMobile.value) { return }
  // 獲取card和底下的子元素
  const card: HTMLDivElement | null = document.querySelector(`.${cardClass}`)
  const cardImg: HTMLImageElement | null = document.querySelector(`.${cardClass} > .cardImg`)
  const cardTitle: HTMLHeadingElement | null = document.querySelector(
    `.${cardClass} > .cardText > .title`
  )
  const cardContent: HTMLParagraphElement | null = document.querySelector(
    `.${cardClass} > .cardText > .content`
  )
  const linkIcon: HTMLDivElement | null = document.querySelector(`.${cardClass} > .linkIcon`)

  // 卡片寬度
  if (card) {
    card.style.width = 'calc(50% - 10px)'
  }
  // 卡片圖片顯示
  if (cardImg) {
    cardImg.style.opacity = '0.3'
  }
  // 標題顏色
  if (cardTitle) {
    cardTitle.style.color = '#000'
  }
  // 文字內容顯示
  if (cardContent) {
    cardContent.style.opacity = '0.3'
  }
  // icon背景色
  if (linkIcon) {
    linkIcon.style.backgroundColor = 'rgba(236, 236, 236,1)'
  }
  // 獲取其他卡片修改
  if (card && card.parentNode) {
    const p = card.parentNode.children
    const pArray = Array.from(p)
    // 其他卡片寬度修改
    pArray.forEach((children: Element) => {
      if (children !== card) {
        (children as HTMLElement).style.width = 'calc(50% - 10px)'
      }
    })
  }
}
// 開啟卡片連結
const openPage = (link:string) => {
  const a = document.createElement('a')
  a.href = link
  a.target = '_blank'
  a.click()
}
const goToPage = (pageName:string) => {
  router.push({ name: pageName })
}

</script>
<script lang="ts">
export default {
  name: 'Home',
}
</script>

<template>
  <div v-if="!isServer">
    <!-- section-1  -->
    <div
      :style="{ padding: isMobile ? '80px 50px 50px' : isSmallDesktop ? '220px 50px 50px' : '400px 50px 50px' }"
      class="bg-white mb-15 d-flex justify-space-between"
      :class="isMobile ? 'flex-column align-start' : 'align-end'"
    >
      <h1 class="fade-up font-weight-bold" :class="isMobile ? 'text-h3 mb-3' : 'text-h1'">
        乃木坂46は
        <br>
        未来です
      </h1>
      <h4 class="fade-up font-weight-bold" :class="isMobile ? 'text-h6' : 'text-h4'">
        僕は信じます
      </h4>
    </div>

    <!-- video 伸縮 -->
    <div :style="{ position: 'relative', margin: '0 0 300px' }" class="d-flex justify-center">
      <div ref="videoWrap" class="videoWrap" :style="{ position: 'relative', width: '95%', borderRadius: '30px', overflow: 'hidden' }">
        <!-- 影片區域 -->
        <!-- objectFit:'cover' 對圖片進行剪切，保留原始比例 -->
        <video
          :style="{ width: '100%', height: isMobile ? '100vh' : '100%', objectFit: 'cover' }"
          autoplay
          muted
          loop
          :src="topVideo"
        />
        <!-- 黑色遮罩 -->
        <div class="video-bg" />
        <!-- 文字內容區域 -->
        <div
          :style="{ position: 'absolute', top: isMobile ? '0' : isSmallDesktop ? '10%' : '15%', left: isMobile ? '0' : isSmallDesktop ? '0' : '20%', zIndex: '2', width: '800px', maxWidth: '100%' }"
          class="text-white mx-auto pa-10"
        >
          <h2 class="fade-up mb-3" :class="isMobile ? 'text-h5' : isSmallDesktop ? 'text-h4' : 'text-h3'">
            乃木坂46
          </h2>
          <h4 class="fade-up" :class="isMobile ? 'mb-10' : isSmallDesktop ? 'text-h5 mb-5' : 'text-h4 mb-15'">
            のぎざか フォーティーシックス
          </h4>
          <p class="fade-up" :class="isMobile ? '' : isSmallDesktop ? 'text-body-1' : 'text-h6'">
            日本の女性アイドルグループである。秋元康のプロデュースにより、2011年8月21日に結成した
          </p>
          <p class="fade-up" :class="isMobile ? '' : isSmallDesktop ? 'text-body-1' : 'text-h6'">
            2011年にソニー・ミュージックエンタテインメント
            (SME) と秋元康の合同プロデュースによる新たな女性アイドルグループが企画され、乃木坂46の結成に至った。
          </p>
          <p class="fade-up mb-10" :class="isMobile ? '' : isSmallDesktop ? 'text-body-1' : 'text-h6'">
            乃木坂46はAKB48グループに所属せず、AKB48の公式ライバルとして存在する[7]。AKB48グループが専用劇場を持つのに対し、乃木坂46は専用劇場を持たない[7]。AKB48グループが選抜総選挙を実施するのに対し、乃木坂46は舞台『16人のプリンシパル』における配役決定で投票を実施するという差別化を図っている[8]。このような差別化は乃木坂46の1stシングル『ぐるぐるカーテン』のミュージック・ビデオ
            (MV) における私立女子校の風景から提示され始めた[9]。
          </p>
          <BtnNormal
            class="fade-up"
            :content="'Nogizaka46'"
            :btn-color="'#fff'"
            :text-color="'#fff'"
            :text-hover-color="'#000'"
            :circle-color="'#fff'"
            :time="'0.3'"
          />
        </div>
      </div>
      <!-- play按鈕 -->
      <div class="playCirclePosition">
        <PlayCircle
          :dialog-visible="dialogVideo"
          :youtube-path="'https://www.youtube.com/embed/s1cgEj5JowM'"
          :is-mobile="isMobile"
          @open-video="openVideo"
          @dialog-close="closeDialog"
        />
      </div>
    </div>

    <!-- 圓球背景 -->
    <div ref="circleWrap" :style="{ margin: '0 0 100px', position: 'relative' }" class="d-flex justify-center pb-15">
      <!-- 圓球 -->
      <div
        ref="greyCircle"
        :style="{ position: 'absolute', top: '0', zIndex: '2', background: 'gray', width: '0', height: '0', borderRadius: '50%' }"
      />
      <!-- 圖片外層 -->
      <div
        :style="{ position: 'relative', margin: '400px 0 60px', width: isMobile ? '100%' : '80%' }"
        class="d-flex justify-center"
      >
        <!-- 圖片區域 -->
        <v-img
          :style="{ position: 'relative', zIndex: '2' }"
          :src="centerImg"
          class="fade"
          cover
        >
          <!-- 圖片遮罩 -->
          <div class="img-bg" />
          <!-- 文字內容區域 -->
          <div
            :style="{ position: 'relative', zIndex: '1', width: '800px', maxWidth: '100%' }"
            class="text-white mx-auto py-15 px-3"
          >
            <h2 class="fade-up text-h3 mb-15">
              乃木坂46
            </h2>
            <p class="fade-up text-h6">
              日本大型女子偶像團體，成立於2011年8月21日；其出道時定位為另一女子偶像團體AKB48的「官方對手」（公式ライバル），但有獨立的幕後團隊，行銷策略及團體風格也與AKB48系列團體不同，惟總製作人同樣是秋元康。目前共有36名成員，其中隊長為梅澤美波。
            </p>
            <p class="fade-up text-h6">
              乃木坂46最初是做為「AKB48官方對手」而成立的女子團體。與AKB48及其姊妹團體（如SKE48等）不同，舉行公演時並不擁有專屬表演場地（如AKB48劇場），但操作方式較為專業。根據秋元康所說，團體名稱中的「46」象徵「就算人數比AKB48少，也具有不遜於AKB48的幹勁」。
            </p>
            <p class="fade-up text-h6 mb-10">
              乃木坂46全體成員所屬的經紀公司為「乃木坂46合同會社」（乃木坂46LLC）。附屬於乃木坂46合同會社的「乃木坂46營運委員會」（乃木坂46運営委員会）負責整個團體的營運工作。
            </p>
            <BtnNormal
              class="fade-up"
              :content="'Nogizaka46'"
              :btn-color="'#fff'"
              :text-color="'#fff'"
              :text-hover-color="'#000'"
              :circle-color="'#fff'"
              :time="'0.3'"
            />
          </div>
        </v-img>
        <!-- play按鈕 -->
        <div class="playCirclePosition">
          <PlayCircle
            :dialog-visible="dialogVideo2"
            :youtube-path="'https://www.youtube.com/embed/Yy6zMAOgCXc'"
            :is-mobile="isMobile"
            @open-video="openVideo2"
            @dialog-close="closeDialog"
          />
        </div>
      </div>
    </div>

    <!-- card -->
    <v-container class="mb-10">
      <div class="d-flex justify-space-between" :class="isMobile ? 'flex-column' : ''">
        <div
          v-for="(card, index) in cardData"
          :key="index"
          class="fade-up myCard rounded"
          :class="`card${index}`"
          @mouseenter="showCard(`card${index}`)"
          @mouseleave="closeCard(`card${index}`)"
          @click="openPage(card.link)"
        >
          <img
            class="cardImg"
            :style="{ width:'100%', height:'100%', objectFit: 'cover' }"
            :src="card.img"
          >
          <div :style="{ height: '100%' }" class="cardText">
            <div class="title">
              <h3>{{ card.title }}</h3>
              <p>{{ card.subTitle }}</p>
            </div>
            <p class="content">
              {{ card.content }}
            </p>
          </div>
          <div class="linkIcon">
            <v-icon>mdi-link-variant</v-icon>
          </div>
        </div>
      </div>
    </v-container>

    <!-- join -->
    <div
      ref="joinArea"
      :style="{ backgroundColor: '#000', cursor: 'pointer', padding: '100px 0' }"
      class="joinArea text-white mb-15"
      @click="goToPage('joinUs')"
    >
      <p class="text-center mb-5">
        オーディション
      </p>
      <h1 class="text-h1 text-center mb-10">
        Join Us!
      </h1>
      <div class="d-flex justify-center">
        <BtnNormal
          ref="joinBtn"
          class="joinBtn"
          :content="'募集一覧 / 応募'"
          :btn-color="'#fff'"
          :text-color="'#fff'"
          :text-hover-color="'#9e3eb2'"
          :circle-color="'#fff'"
          :time="'0.3'"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.v-field{
  cursor: pointer;
  &:hover{
    .v-field__outline {
      outline: 1px solid blue;
    }
  }

}
.video-bg,
.img-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 0;
}

.playCirclePosition {
  position: absolute;
  z-index: 2;
  bottom: -80px;
  right: 100px;

  @media screen and (max-width: '960px') {
    right: 20px;
  }
}

.myCard {
  position: relative;
  width: calc(50% - 10px);
  height: 500px;
  border: 1px solid #000;
  transition: 0.3s;
  cursor: pointer;

  @media screen and (max-width: '960px') {
    width: 100%;
    margin: 0 0 10px;
  }

  .cardImg {
    position: absolute;
    opacity: 0.3;
    transition: 0.3s;
    z-index: 0;

    @media screen and (max-width: '960px') {
      opacity: 1;
    }
  }

  .cardText {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px;

    .title {
      transition: 0.3s;
    }

    .content {
      color: #fff;
      opacity: 0;
      transition: 0.3s;
      width: 80%;

      @media screen and (max-width: '960px') {
        opacity: 1;
      }
    }
  }

  .linkIcon {
    position: absolute;
    bottom: 50px;
    right: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(236, 236, 236, 1);
    transition: 0.3s;

    @media screen and (max-width: '960px') {
      bottom: 20px;
      right: 20px;
    }
  }
}</style>
