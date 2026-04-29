import { useCpnCtrlStore } from '@/stores/cpnCtrl'
import { localCache } from '@/utils/cache'

export default function useLangHook() {
  const { isShowLangList, lang } = storeToRefs(useCpnCtrlStore())
  const langOptions = localCache.getCache('langOptions')
  const { locale } = useI18n()

  onMounted(() => {
    const langKey = localCache.getCache('i18nLocale') ?? ''
    const find = localCache.getCache('langOptions').find((item) => item.lang === langKey)
    if (find) {
      lang.value = find.name
    }
  })

  function handleLangItemClick(item: any) {
    locale.value = item.lang
    isShowLangList.value = false
    lang.value = item.name
    localCache.setCache('i18nLocale', locale.value)
  }

  function onShowLangClick() {
    isShowLangList.value = true
  }

  return {
    locale,
    lang,
    langOptions,
    isShowLangList,

    onShowLangClick,
    handleLangItemClick,
  }
}
