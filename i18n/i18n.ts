import ar from '@/translations/ar'
import de from '@/translations/de'
import en from '@/translations/en'
import es from '@/translations/es'
import fr from '@/translations/fr'
import ja from '@/translations/ja'
import ko from '@/translations/ko'
import pl from '@/translations/pl'
import pt from '@/translations/pt'
import ru from '@/translations/ru'
import tw from '@/translations/zh-TW'
import zh from '@/translations/zh'

// 這個i18n的config不要放到plugins 因為nuxt的plugins會自動解析
// 會噴這個警告 [warn] [nuxt] You are using a plugin that has not been wrapped in `defineNuxtPlugin`. It is advised to wrap your plugins as in the future this may enable enhancements: message

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'tw',
  messages: {
    ar,
    de,
    en,
    es,
    fr,
    ja,
    ko,
    pl,
    pt,
    ru,
    tw,
    zh
  }
}))
