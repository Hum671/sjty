import { usePerMarketStore } from '@/stores/perMarket'
import { useCurrencyStore } from '@/stores/currency'
import type { MarketListItem } from '@/api/market/model/MarketModel'

export default function useMarketHook() {
  const marketStore = usePerMarketStore()
  const currencyStore = useCurrencyStore()
  const currencyMarketDataList = ref<MarketListItem[]>([])

  const { currencyList } = storeToRefs(currencyStore)
  const { currencyMarketList, hasDataChange } = storeToRefs(marketStore)

  watch(hasDataChange, () => {
    _handleMarketDataList()
  })

  function _handleMarketDataList() {
    const marketDataList = currencyList.value.list.map((item) => {
      if (!currencyMarketList.value) {
        return item
      }
      const marketItem = currencyMarketList.value.find(
        (node) => `market.${item.symbol.toLowerCase()}.ticker` === node.ch,
      )

      if (marketItem) {
        item.data = marketItem
      }
      return item
    })

    currencyMarketDataList.value = marketDataList
  }

  function handlePriceChangePercent(tick) {
    if (!tick) {
      return '0.00%'
    }

    const changePrice = tick.close - tick.open
    const percent = (changePrice / tick.open) * 100

    if (percent === 0) {
      return '0.00%'
    }
    if (percent > 0) {
      return `+${percent.toFixed(2)}%`
    }
    return `${percent.toFixed(2)}%`
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

  return {
    currencyMarketDataList,
    handlePriceChangePercent,
    handlePriceColor,
  }
}
