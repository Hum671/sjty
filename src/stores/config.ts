import type { AssetsItem, SecondItem, IGloablSettingRes } from '@/api/config/model/ConfigModel'
import { getAssetsConfig, getSecondListConfig, getSettingInfo } from '@/api/config'
import { SUCCESS_CODE } from '@/api/model/BaseModel'

export const useConfigStore = defineStore('config', () => {
  const assetConfig = ref<AssetsItem[]>()
  const secondListConfig = ref<SecondItem[]>()
  const globalSettingInfo = ref<IGloablSettingRes>()
  const isAiPledgeShow = ref(false)
  const isWithdrawBankShow = ref(false)

  // assets配置
  function requestAssetsConfig() {
    if (assetConfig.value) {
      return
    }

    getAssetsConfig().then((res) => {
      if (res.code === SUCCESS_CODE) {
        assetConfig.value = res.data
      }
    })
  }

  // 秒合约下注金额时间配置
  function requestSecondListConfig() {
    if (secondListConfig.value) {
      return
    }

    getSecondListConfig().then((res) => {
      if (res.code === SUCCESS_CODE) {
        secondListConfig.value = res.data
      }
    })
  }

  // 白皮书、客服
  function requestSettingInfo() {
    if (globalSettingInfo.value) {
      return
    }

    getSettingInfo().then((res) => {
      if (res.code === SUCCESS_CODE) {
        globalSettingInfo.value = res.data
        isAiPledgeShow.value = res.data.isAiPledgeShow === '1'
        isWithdrawBankShow.value = res.data?.openWithdrawBank === '1'
      }
    })
  }

  return {
    secondListConfig,
    requestSecondListConfig,

    assetConfig,
    requestAssetsConfig,

    globalSettingInfo,
    requestSettingInfo,

    isAiPledgeShow,
    isWithdrawBankShow,
  }
})
