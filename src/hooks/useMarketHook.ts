import { useMarketStore } from '@/stores/market'
import { useCurrencyStore } from '@/stores/currency'
import type { MarketListItem } from '@/api/market/model/MarketModel'
import CONST from '@/const/index'
import { sessionCache } from '@/utils/cache'

export default function useMarketHook() {
  const marketStore = useMarketStore()
  const currencyStore = useCurrencyStore()
  const currencyMarketDataList = ref<MarketListItem[]>([])

  const { currencyList } = storeToRefs(currencyStore)
  const { currencyMarketList, hasDataChange } = storeToRefs(marketStore)

  watch(hasDataChange, () => {
    _handleMarketDataList()
  })

  function _handleMarketDataList() {
    const marketDataList = currencyList.value?.list.map((item) => {
      if (!currencyMarketList.value) {
        return item
      }

      const marketItem = currencyMarketList.value.find((node) => item.symbol === node.StockCode)

      if (marketItem) {
        item.data = marketItem
      }
      return item
    })

    const sessionCurrencyMarket = sessionCache.getCache(CONST.CONTRACTKEY)
    if (!sessionCurrencyMarket) {
      sessionCache.setCache(CONST.CONTRACTKEY, marketDataList[0])
    }

    currencyMarketDataList.value = marketDataList
  }

  function handlePriceColor(tick) {
    if (handlePriceChangePercent(tick) === '0.00%') {
      return ''
    }

    if (handlePriceChangePercent(tick).includes('+')) {
      return 'green'
    }

    return 'red'
  }

  function handlePriceChangePercent(tick) {
    if (!tick) {
      return '0.00%'
    }

    let changePrice
    let openPrice

    if (tick.price) {
      changePrice = tick.price - tick.open
      openPrice = tick.open
    }

    if (tick.Price) {
      changePrice = tick.Price - tick.Open
      openPrice = tick.Open
    }

    const percent = (changePrice / openPrice) * 100

    if (Number(percent.toFixed(2)) === 0) {
      return '0.00%'
    }
    if (Number(percent.toFixed(2)) > 0) {
      return `+${percent.toFixed(2)}%`
    }
    return `${percent.toFixed(2)}%`
  }

  return {
    currencyMarketDataList,
    handlePriceChangePercent,
    handlePriceColor,
  }
}
