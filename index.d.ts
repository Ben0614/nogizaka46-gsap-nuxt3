// 處理build時nuxt-icon會噴的錯誤
import * as _nuxt_schema from '@nuxt/schema'

interface NuxtIconModuleOptions {
  size?: string | false
  class?: string
  aliases?: { [alias: string]: string }
}

declare module '@nuxt/schema' {
  interface AppConfig {
    nuxtIcon?: NuxtIconModuleOptions
  }
}
