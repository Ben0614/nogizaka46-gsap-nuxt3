// https://nuxt.com/docs/api/configuration/nuxt-config
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
export default defineNuxtConfig({
  ssr: true,
  app: {
    baseURL: process.env.NUXT_BASE_URL,
  },

  runtimeConfig: {
    apiSecret: '',
    public: {
      baseURL: process.env.NUXT_APP_REQUEST_BASE_URL,
      timeout: process.env.NUXT_APP_REQUEST_TIMEOUT,
      metaImage: process.env.NUXT_APP_META_IMAGE_URL
    }
  },

  css: ['@/assets/scss/style.scss'],

  // 開啟後在頁面上會有Nuxt Devtools 面板輔助
  // @nuxt/devtools
  devtools: { enabled: false },

  typescript: {
    typeCheck: true
  },

  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-lodash',
    '@nuxtjs/google-fonts',
    'nuxt-icon',
  ],

  // 這邊設定完 要到$body-font-family做修改
  googleFonts: {
    families: {
      'Noto Sans TC': {
        wght: [100, 300, 400, 500, 700, 900],
      },
    },
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    preconnect: false,
    prefetch: false,
    download: false,
    base64: false,
  },
  i18n: {
    vueI18n: './i18n/i18n.ts'
  },

  vite: {
    plugins: [
      viteCompression({ ext: '.gz', algorithm: 'gzip', threshold: 10240, verbose: false, deleteOriginFile: false }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 20
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      })
    ],
  },

  build: {
    // transpile 選項中可以配置需要轉譯的文件或模塊的名稱，這些文件或模塊會在編譯過程中被轉譯，以保證其兼容性
    transpile: ['vuetify', 'vue-toastification', 'gsap'],
    analyze: {
      analyzerMode: true // 'static'
    }
  },
})
