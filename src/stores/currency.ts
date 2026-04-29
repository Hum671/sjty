import { getSecondList } from '@/api/market'
import type { MarketItem } from '@/api/market/model/MarketModel'
import { SUCCESS_CODE } from '@/api/model/BaseModel'

// 获取币种列表
export const useCurrencyStore = defineStore('currency', () => {
  const currencyList = ref<MarketItem>()
  const symbolCoinNameMap = ref(new Map())
  const digitalCurrencyList = ref<{ type: string; name: string; symbol: string }[]>([])

  function getCurrencyList() {
    getSecondList().then((res) => {
      if (res.code === SUCCESS_CODE) {
        currencyList.value = res.data
        coinNameMap(res.data?.list)
        getDigitalCurrencyList(res.data?.list)
      }
    })
  }

  function coinNameMap(list: MarketItem) {
    list?.forEach((item) => {
      symbolCoinNameMap.value.set(item.symbol, item.name)
    })
  }

  function getDigitalCurrencyList(list: MarketItem) {
    digitalCurrencyList.value = list
      ?.filter((item) => item.type === 'DigitalCurrency')
      .map((iten) => {
        return {
          type: iten.symbol.replace('usdt', ''),
          name: iten.name,
          symbol: iten.symbol,
        }
      })
  }

  return {
    currencyList,
    getCurrencyList,
    symbolCoinNameMap,
    digitalCurrencyList,
  }
})
