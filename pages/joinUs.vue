<script lang="ts" setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Lenis from '@studio-freight/lenis'
import { useDisplay } from 'vuetify'
import { IExpansionData, ICards, IDrawerDatas } from '@/model/joinUs'
import BtnCircle from '@/components/base/BtnCircle.vue'
import logo from '@/assets/images/nogizaka46/Nogizaka46_logo.png'
import video from '@/assets/video/2ndAlbum.mp4'

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
// 底部資料
const expansionData: IExpansionData[] = reactive([
  { title: '結成時間', content: '2021/8/21' },
  { title: '專輯數量', content: '33' },
  { title: '紅白次數', content: '8' },
  { title: '成員總期數', content: '5' },
])
const activeExpand = ref(null)
// 卡片資料
const cards: ICards[] = reactive([
  {
    type: '冠名綜藝番組',
    title: '乃木坂工事中',
    content: '2015年（平成27年）4月20日からテレビ愛知の企画・制作により、テレビ東京系列などで放送されている乃木坂46の冠バラエティ番組である',
  },
  {
    type: '冠名歌唱番組',
    title: '超・乃木坂スター誕生!',
    content: '2023年4月25日（24日深夜）から日本テレビで放送されている乃木坂46のバラエティ番組である。',
  },
  {
    type: 'Youtubeチャネル',
    title: '乃木坂配信中',
    content: '乃木坂46 ２つ目の公式YouTubeチャンネルです。このチャンネルでは、主に乃木坂工事中(毎週日曜深夜0:00〜 テレビ愛知発全国ネットにて放送中)の無料配信、また、ここでしか見られないオリジナルコンテンツを不定期で配信予定です！',
  }
])
// 側邊欄
const drawer = ref(false)
const tab = ref(0)
const drawerDatas: IDrawerDatas[] = reactive([
  {
    tab: '冠名綜藝番組',
    title: '乃木坂工事中',
    content: '乃木坂46にとって初の地上波レギュラー冠番組だった『乃木坂って、どこ?』（2011年10月3日 - 2015年4月13日）をリニューアルした後継番組[2]。『乃木坂って、どこ?』に引き続き、MCはバナナマンが担当[2]。番組名の『乃木坂工事中』は乃木坂46の総合プロデューサー・秋元康が考案した[3]。2016年12月30日、『乃木坂って、どこ?』時代から通じて初の特番となる1時間SPを放送[4]。本番組のネット局であるテレビ東京に限り当番組の後に放送されている『欅って、書けない?』（関東ローカル）に出演する[5]、同じ坂道シリーズの欅坂46との合同忘年会企画を行った[6]。以後、2017年12月25日、2018年1月8日、2019年1月7日に拡大1時間SPを放送した[注 1][7][8]。2021年5月17日（16日深夜）放送回より、同月6日に新たに開設された乃木坂46のYouTubeチャンネル「乃木坂配信中」にて放送後に毎週無料配信されている[9][10]。地上波の番組をYouTubeにて公式無料配信するのは異例のことである[9][11]。番組の休止は年末年始を除いてほとんどないが、海外の時差の大きい世界卓球選手権などのスポーツ中継[注 2]が放送されるときは時間繰り下げや休止[注 3]となる場合がある[12]。',
    url: 'https://tv-aichi.co.jp/nogi-kou/',
  },
  {
    tab: '冠名歌唱番組',
    title: '超・乃木坂スター誕生!',
    content: '乃木坂46の5期生が『新・乃木坂スター誕生!』で引き続き「昭和歌謡」「平成の名曲」のヒットソングに挑戦とともに初となるコントにも挑戦する番組。放送終了後、未公開映像を併せて「超・乃木坂スター誕生! 5期生の挑戦」のタイトルでHuluで配信。',
    url: 'https://www.ntv.co.jp/newnogistar/',
  },
  {
    tab: 'Youtubeチャネル',
    title: '乃木坂配信中',
    content: '乃木坂46 ２つ目の公式YouTubeチャンネルです。このチャンネルでは、主に乃木坂工事中(毎週日曜深夜0:00〜 テレビ愛知発全国ネットにて放送中)の無料配信、また、ここでしか見られないオリジナルコンテンツを不定期で配信予定です！※既存の乃木坂46 official YouTubeチャンネルでは、今まで同様に音楽コンテンツを中心に配信していきます。チャンネル登録よろしくお願いします♪',
    url: 'https://www.youtube.com/c/nogizakahaishinchu',
  }
])

const ctx = ref()

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
    // slide-up fade
    const t = gsap.timeline({
      scrollTrigger: {
        trigger: '.videoText',
        start: 'top bottom',
        // markers: true,
      },
      defaults: {
        opacity: 0,
      },
    })
    t.from('.slide-up', {
      y: 800,
    }).from('.fade', {})

    // 視差
    // section1 影片區 100vh
    ScrollTrigger.create({
      trigger: '.section1',
      start: 'top top',
      pin: true,
      pinSpacing: false,
      // markers: true,
    })
    // section2 內容區 高度由內容撐開 所以必須給end: 'top top' 否則只能看到局部的內容
    ScrollTrigger.create({
      trigger: '.section2',
      start: 'top top',
      end: 'top top',
      pin: true,
      pinSpacing: false,
      // markers: true,
    })

    /*
    // 暫時不用
     // 如果往下滑動 就讓大video top變0
     const videoUp = gsap.to('.wrap', {
       marginTop: 0,
       paused: true,
       duration: 0.2,
     })

     scrollTrigger.create({
       start: 'top top',
       onUpdate: (self) => {
         // 往下滑動是1 往上滑動是-1
         self.direction === 1 ? videoUp.play() : videoUp.reverse()
       },
     })
    */

    // 到第二區域btn
    const section2: HTMLDivElement | null = document.querySelector('.section1')
    const section2Top = ref(0)
    if (section2) {
      section2Top.value = section2.offsetHeight + 80 // 80 header高
    }
    const bannerVideoBtn: HTMLButtonElement | null = document.querySelector('.bannerVideoBtn')
    if (bannerVideoBtn) {
      bannerVideoBtn.addEventListener('click', () => {
        gsap.to(window, {
          duration: 0.5,
          scrollTo: {
            y: section2Top.value,
          }
        })
      })
    }

    // 卡片hover和click
    const cards: HTMLElement[] = gsap.utils.toArray('.processCard')
    const cardBtns: HTMLElement[] = gsap.utils.toArray('.processCard .btnCircle')
    const cardBtnIcons: HTMLElement[] = gsap.utils.toArray('.processCard .btnCircle .v-icon')
    cards.forEach((card, index) => {
      // 點擊就打開側邊欄 並指定tab
      card.addEventListener('click', () => {
        tab.value = index
        drawer.value = true
      })
      card.addEventListener('mouseenter', () => {
        gsap.to(cardBtns[index], {
          backgroundColor: '#fff',
        })
        gsap.to(cardBtnIcons[index], {
          color: '#000',
        })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(cardBtns[index], {
          backgroundColor: 'gray',
        })
        gsap.to(cardBtnIcons[index], {
          color: '#fff',
        })
      })
    })

    // 跑馬燈
    // gsap.utils.toArray 和 document.querySelectorAll 可以通用 但是type不同
    // getBoundingClientRect()  回傳元素的大小，以及其相對於可視範圍 (viewport) 的位置
    const box: HTMLDivElement | null = document.querySelector('.box')
    if (box) {
      const boxWidth: number = box.getBoundingClientRect().width
      const boxQuantity: number = document.querySelectorAll('.box').length
      const totalWidth: number = boxWidth * boxQuantity
      const marqueeWrapper: NodeListOf<Element> = document.querySelectorAll('.box')
      const dirFromRight: string = '-=' + totalWidth

      console.log('boxWidth', boxWidth, 'boxQuantity', boxQuantity)

      const mod = gsap.utils.wrap(0, totalWidth)
      const marquee = (which: NodeListOf<Element>, time: number, direction: string) => {
        gsap.set(which, {
          x (i) {
            return i * boxWidth
          }
        })
        const action = gsap.timeline({
          overwrite: true
        })
          .to(which, {
            x: direction,
            modifiers: {
              x: x => mod(parseFloat(x)) + 'px',
            },
            duration: time,
            ease: 'none',
            repeat: -1,
          })

        return action
      }

      const right = gsap.timeline({
        paused: true
      })
        .add(marquee(marqueeWrapper, 10, dirFromRight))

      right.play()
    }
  })
})

</script>
<script lang="ts">
export default {
  name: 'JoinUs',
}
</script>

<template>
  <!-- <div v-if="isServer" :style="{ height: '200vh' }" class="bg-black" /> -->
  <div v-if="!isServer" class="wrap text-white">
    <!--
      server時 避免讓用戶看到主要的畫面 所以先佔畫面
      因為gsap是在client才會啟用
    -->

    <!-- section1 -->
    <!-- ,clipPath: 'inset(0)' *現在沒在用 -->
    <div :style="{position:'relative',width:'100%',height:'100%',zIndex:0}" class="section1">
      <!-- 背景影片 -->
      <!-- transform:'rotateY(180deg)' *現在沒在用 -->
      <!-- objectFit:'cover' 手機版一定要加這個 影片才會100vh高 -->
      <!-- height:isMobile ? '100vh' : '' -->
      <video
        ref="bannerVideo"
        :style="{width:'100%', height: '100vh',objectFit:'cover'}"
        :src="video"
        autoplay
        muted
        loop
      />
      <!-- 黑色遮罩 -->
      <div class="video-bg" />
      <!-- 文字內容 -->
      <v-container :style="{position:'absolute',bottom:'85px',left:'0',zIndex:2}" class="d-flex justify-space-between align-end">
        <div class="videoText">
          <h1 class="slide-up section1Title mb-10" :class="isMobile ? 'text-h5' : isSmallDesktop ? 'text-h3' : 'text-h1'">
            乃木坂46 新メンバー募集開始
          </h1>
          <p class="fade section1Content" :class="isMobile ? '' : isSmallDesktop ? 'text-body-1' : 'text-h5'">
            誰にも言えていない、夢がある？
            <br>
            あの人のどこに、憧れている？
            <br>
            本気で、泣いて笑って、青春してる？
            <br>
            背中を押してくれる何かを、待ってる？
            <br>
            たった一度の夏、
            <br>
            たった一度の、きみへ。
            <br>
            乃木坂46 新メンバー募集開始
            <br>
            この世界の、未完成は美しい。
          </p>
        </div>
        <!-- gsap控制 -->
        <BtnCircle
          :icon-name="'mdi-chevron-down'"
          :btn-color="'#fff'"
          :btn-hover-color="'gray'"
          :icon-color="'#000'"
          :icon-hover-color="'#fff'"
          :time="'0.3'"
          class="bannerVideoBtn"
        />
      </v-container>
    </div>

    <!-- section2 -->
    <div class="section2 bg py-10">
      <!-- card -->
      <v-container class="mb-15">
        <h1 class="mb-10" :class="isMobile ? 'text-h5' : 'text-h2'">
          私たちの番組
        </h1>
        <v-row>
          <v-col v-for="(card,index) in cards" :key="index" cols="12" md="4">
            <div class="processCard rounded-lg py-8 px-5">
              <!-- 背景影片 -->
              <!-- scale 和 rotate不能同時寫在同一個tag裡 需要的話要外面再包一層 -->
              <video :src="video" autoplay muted loop />
              <!-- 文字區域 -->
              <div :style="{position:'relative',height:'100%'}" class="d-flex flex-column justify-space-between">
                <div>
                  <p>{{ `${index + 1}. ${card.type}` }}</p>
                  <h3 class="mb-8">
                    {{ card.title }}
                  </h3>
                  <p>{{ card.content }}</p>
                </div>
                <div class="d-flex justify-space-between align-end">
                  <div :style="{width:'120px'}">
                    <v-img :src="logo" />
                  </div>
                  <BtnCircle :icon-name="'mdi-plus'" :btn-color="'gray'" :btn-hover-color="'#fff'" :icon-color="'#fff'" :icon-hover-color="'#000'" />
                  <!-- <v-btn width="50" height="50" icon class="plusBtn">
                    <v-icon size="30">mdi-plus</v-icon>
                  </v-btn> -->
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <!-- 跑馬燈 -->
      <div class="marquee my-15">
        <div class="boxes">
          <div class="box">
            Nogizaka46
          </div>
          <div class="box">
            乃木坂46
          </div>
          <div class="box">
            Nogizaka46
          </div>
          <div class="box">
            乃木坂46
          </div>
          <div class="box">
            Nogizaka46
          </div>
          <div class="box">
            乃木坂46
          </div>
        </div>
      </div>

      <v-container>
        <v-row justify="center">
          <v-col>
            <v-expansion-panels v-model="activeExpand" variant="accordion" tile dark>
              <v-expansion-panel v-for="(item,index) in expansionData" :key="index" eager :style="{borderTop:index === 0 ? '1px solid #fff' : '',borderBottom:'1px solid #fff'}">
                <v-expansion-panel-title color="#0e0e0e" class="text-white" hide-actions>
                  <div :style="{width:'100%'}" class="d-flex justify-space-between align-center">
                    <h4 class="text-16">
                      {{ item.title }}
                    </h4>
                    <div class="expandArea">
                      <v-btn icon class="expandBtn">
                        <v-icon size="30" class="text-white" :style="{transform: index === activeExpand ? 'rotate(180deg)' : ''}">
                          mdi-chevron-down
                        </v-icon>
                      </v-btn>
                      <div class="btnOverlay" />
                    </div>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text eager class="text-white bg">
                  <span class="text-16">{{ item.content }}</span>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- 卡片側邊欄 -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      :location="isMobile ? 'bottom' : 'right'"
      :width="isMobile ? '' : '500'"
      :class="isMobile ? 'py-15 px-3' : 'py-5 px-15'"
    >
      <v-icon :style="{ position: 'absolute', top: '10px', right: '20px' }" size="45px" color="#000" @click="drawer = false">
        mdi-close
      </v-icon>
      <v-tabs
        v-model="tab"
        :show-arrows="isMobile ? true : false"
        bg-color="transparent"
        color="#000"
        grow
        class="mb-5"
      >
        <v-tab v-for="(item,index) in drawerDatas" :key="index" class="mx-3">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item v-for="(item,index) in drawerDatas" :key="index">
          <v-card flat>
            <v-card-text>
              <h3 class="text-h5 font-weight-bold mb-3">
                {{ item.title }}
              </h3>
              <p>{{ item.content }}</p>
              <a :href="item.url" target="_blank" class="text-purple">ここをクリック</a>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-navigation-drawer>
  </div>
</template>

<style lang="scss" scoped>
/*
  這個overflow: hidden一定要加
  否則navigation-drawer在手機會爆版
*/
.wrap{
  overflow: hidden
}
.bg {
  background-color: #0e0e0e;
}

.video-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 0;
}

.processCard {
  position: relative;
  height: 600px;
  border: 1px solid gray;
  cursor: pointer;
  overflow: hidden;
  @media screen and (max-width: '960px') {
    height: 500px;
  }
  video {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    opacity: 0;
    transition: 0.3s;
  }
  &:hover video {
    opacity: 1;
    transition: 0.3s;
  }
}

/* width 150% 會造成爆版 這頁最外層用overflow hidden */
.marquee {
  width: 150%; // width必須大一點 否則有些字會瞬間消失
  height: 50px;
  /* overflow: hidden; */

  .boxes {
    position: relative;
    left: -16.6666%; // 會消除掉的位置
    height: 50px;
    @media screen and (max-width: 960px) {
      left: -33.3333%;
    }
  }
  .box {
    position: absolute;
    width: 16.6666%;
    height: 50px;
    font-size: 40px;
    font-weight: 700;
    line-height: 50px;
    text-align: center;
    @media screen and (max-width: 960px) {
      width: 33.3333%;
      font-size: 30px;
    }
  }
}

.expandArea {
  position: relative;
  border-radius: 50%;
  overflow: hidden;

  &:hover {
    .expandBtn {
      background-color: transparent;
    }
    .btnOverlay {
      right: 0;
    }
  }

  .expandBtn {
    position: relative;
    background-color: rgb(130, 130, 130, 0.3);
    z-index: 1;
    transition: 0.3s;
  }

  .btnOverlay {
    position: absolute;
    top: 0;
    right: -60px;
    width: 60px;
    height: 52px;
    background-image: linear-gradient(to right, black, purple);
    transition: 0.3s;
  }
}
</style>
