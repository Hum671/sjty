import { defineStore } from 'pinia'

export const useCpnCtrlStore = defineStore('cpnCtrl', () => {
  const route = useRoute()

  const isShowLeftMenus = ref(false)
  const isShowTabbar = ref(true)
  const isShowLangList = ref(false)
  const lang = ref('')

  watchEffect(() => {
    const routeNames = [
      'DefaultHome',
      'Home',
      'MarketsView',
      // 'Contract',
      'Coin',
      'Pledge',
      'AssetsView',
      'NftView',
    ]
    isShowTabbar.value = routeNames.includes(route.name as string)
  })

  return {
    isShowLeftMenus,
    isShowTabbar,
    isShowLangList,
    lang,
  }
})
