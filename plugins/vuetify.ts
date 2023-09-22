// vuetify要升到3.1以上才可以引入labsComponents (專案現在是3.3.10)
import { createVuetify } from 'vuetify'
// 指令
import * as directives from 'vuetify/directives'
// 引入vuetify的components
import * as components from 'vuetify/components'
// 引入vuetify的labsComponents (還在實驗開發中的)
import * as labsComponents from 'vuetify/labs/components'
import '@mdi/font/css/materialdesignicons.css'
import { zhHant } from 'vuetify/locale'
import tw from '@/translations/zh-TW'
// import configs from '@/configs'

import { BLUE_THEME, AQUA_THEME, PURPLE_THEME, GREEN_THEME, CYAN_THEME, ORANGE_THEME } from '@/theme/LightTheme'
import { DARK_BLUE_THEME, DARK_AQUA_THEME, DARK_ORANGE_THEME, DARK_PURPLE_THEME, DARK_GREEN_THEME, DARK_CYAN_THEME } from '@/theme/DarkTheme'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    components: {
      ...components,
      ...labsComponents
    },
    directives,
    // 不確定這個icons有沒有作用
    // icons: {
    //     defaultSet: 'mdi',
    //     aliases,
    //     sets: {
    //         mdi
    //     }
    // },
    locale: {
      locale: 'zhHant',
      fallback: 'zhHant',
      messages: { zhHant, tw }
    },
    theme: {
      defaultTheme: 'BLUE_THEME',
      themes: {
        BLUE_THEME,
        AQUA_THEME,
        PURPLE_THEME,
        GREEN_THEME,
        CYAN_THEME,
        ORANGE_THEME,
        DARK_BLUE_THEME,
        DARK_AQUA_THEME,
        DARK_ORANGE_THEME,
        DARK_PURPLE_THEME,
        DARK_GREEN_THEME,
        DARK_CYAN_THEME
      }
      // defaultTheme: configs.theme.globalTheme,
      // themes: {
      //   dark: {
      //     dark: true,
      //     colors: { ...configs.theme.dark }
      //   },
      //   light: {
      //     dark: false,
      //     colors: { ...configs.theme.light }
      //   }
      // }
    },
    // 全局的vuetify component設定
    defaults: {
      VCard: {
        rounded: 'md'
      },
      VTextField: {
        variant: 'underlined',
        density: 'comfortable',
        color: 'primary'
      },
      VTextarea: {
        variant: 'outlined',
        density: 'comfortable',
        color: 'primary'
      },
      VSelect: {
        variant: 'underlined',
        density: 'comfortable',
        color: 'primary'
      },
      VListItem: {
        minHeight: '45px'
      },
      VTooltip: {
        location: 'top'
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
