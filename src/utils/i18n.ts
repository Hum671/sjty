import { createI18n, type I18n } from 'vue-i18n'
import { App } from 'vue'
import messages from '@/locales'
import { localCache } from './cache'
import type { ILangItem } from '@/api/config/model/ConfigModel'
import { SUCCESS_CODE } from '@/api/model/BaseModel'

// 多语言
let langOptions: ILangItem[] = []
const cache = localCache.getCache('langOptions')
let systemLang = localCache.getCache('i18nLocale')

initLang()

function initLang() {
  if (!cache) {
    const request = new XMLHttpRequest()
    request.open('GET', '/api/config/langs', false)
    request.send(null)

    if (request.status === 200) {
      const res = JSON.parse(request.responseText)
      if (res.code === SUCCESS_CODE) {
        langOptions = res.data
        localCache.setCache('langOptions', langOptions)
      }
    }
  }

  if (!systemLang) {
    systemLang = 'en-us'
    localCache.setCache('i18nLocale', systemLang)
  }
}

export const i18n: I18n = createI18n({
  locale: systemLang,
  fallbackLocale: 'en-us',
  legacy: false,
  messages,
  silentFallbackWarn: true,
  missingWarn: false,
  silentTranslationWarn: false,
  fallbackWarn: false,
})

export default {
  install(app: App) {
    app.config.globalProperties.$t = i18n.global.t
    app.use(i18n)
  },
}
