import { getUrlConfig } from '@/api/config'
import type { MarketDataItem } from '@/api/market/model/MarketModel'
import { options } from '@/hooks/useKMarketHook'
import { defineStore } from 'pinia'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { requestMarketKLine } from '@/api/market'
import { useCurrencyStore } from '@/stores/currency'

export interface KLineItem {
  amount: number
  close: number
  count: number
  high: number
  id: number
  low: number
  open: number
  vol: number
  price?: number
  turnover?: number
}

export const useMarketStore = defineStore('market', () => {
  let websocket: WebSocket
  let currentKLineSymbol = ''
  let timer = 0
  const urlData = {
    ws: '',
    kline: '',
  }

  const currencyStore = useCurrencyStore()
  const optionIndex = ref(0)
  const currencyMarketList = ref<MarketDataItem[]>([]) // 币种行情数据列表
  const kLineDataList = ref<KLineItem[]>([])
  const newKLineData = ref<KLineItem>()
  const kline24HData = ref<KLineItem>()
  const symbolPriceMap = ref(new Map())
  const typePriceMap = ref(new Map())
  let oldKLineData: KLineItem | undefined
  let oldTotalVol = 0
  let oldLastPrice = 0
  const hasDataChange = ref(false)
  const isWebsocketConnSuccess = ref(false)
  const requestMarketKLineLoading = ref(false)
  // 行情數據是否加載完成，控制交易按鈕是否顯示
  const isGetKLineDataListFinish = computed(() => {
    return kLineDataList.value.length > 0
  })

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      // if (websocket && websocket.readyState !== websocket.OPEN) {
      websocket.close()
      websocket = null
      // }
    } else {
      currencyStore.getCurrencyList()
      // if (!websocket) {
      handleWebsocket()
      // }
    }
  })

  function handleWebsocket() {
    if (websocket) {
      websocket.close()
    }

    if (!urlData.ws) {
      requestUrl().then(() => {
        handleConnWebsocket(urlData.ws)
      })
    } else {
      handleConnWebsocket(urlData.ws)
    }
  }

  function requestUrl() {
    return getUrlConfig().then((res) => {
      if (res.code === SUCCESS_CODE) {
        urlData.ws = res.data.wssUrl
        urlData.kline = res.data.klineUrl
      }
    })
  }

  function handleConnWebsocket(url) {
    websocket = new WebSocket(url)

    websocket.onopen = _handleWebsocketOpen
    websocket.onmessage = _handleWebsocketMessage
    websocket.onclose = _handleWebsocketClose
    websocket.onerror = _handleWebsocketError
  }

  function requestTicker24hrData(symbols: string[]) {
    _wsSend({
      Key: symbols.toString(),
    })
  }

  async function subKLineData(symbol: string, time: string, rows: number) {
    currentKLineSymbol = symbol

    kLineDataList.value = []
    oldKLineData = void 0
    oldTotalVol = 0
    requestMarketKLineLoading.value = true
    // oldLastPrice 清零
    oldLastPrice = 0

    requestMarketKLine({
      code: symbol,
      time,
      rows,
    })
      .then((res) => {
        if (res.code === SUCCESS_CODE && res.data && res.data.length > 0) {
          kLineDataList.value = res.data.map((item) => {
            const [id, open, high, low, close, time, vol] = item
            return {
              amount: 0,
              close,
              count: 0,
              high,
              id,
              low,
              open,
              vol,
              time,
            }
          })
          const [id, open, high, low, close, time, vol] = res.data[res.data.length - 1]
          newKLineData.value = {
            amount: 0,
            close,
            count: 0,
            high,
            id,
            low,
            open,
            vol,
            price: close,
            time,
          }
        }
      })
      .finally(() => {
        requestMarketKLineLoading.value = false
      })
  }

  function _handleWebsocketOpen() {
    console.log('websocket open success!')
    clearInterval(timer)
    timer = window.setInterval(() => {
      _wsSendPong(Math.ceil(Date.now() / 1000))
    }, 10 * 1000)
    isWebsocketConnSuccess.value = true
  }

  function _handleWebsocketMessage(e) {
    try {
      const json = JSON.parse(e.data)
      if (json.body) {
        _handleTicker24hrData(json.body)
      }
    } catch (error) {}
  }

  function _handleTicker24hrData(data: MarketDataItem) {
    const index = currencyMarketList.value.findIndex(
      (item: MarketDataItem) => item.StockCode === data.StockCode,
    )
    if (index === -1) {
      currencyMarketList.value.push(data)
    } else {
      currencyMarketList.value[index] = data
    }

    hasDataChange.value = !hasDataChange.value

    // 处理k线图数据
    _handleKLineData(data)

    // 处理所有金币最新价格数据
    _getAllStockCodeMapPrice(currencyMarketList.value)
  }

  function _getAllStockCodeMapPrice(list: MarketDataItem[]) {
    list?.forEach((item) => {
      symbolPriceMap.value.set(item.StockCode, item.Price)
      typePriceMap.value.set(item.StockCode.replace('usdt', ''), item.Price)
    })
  }

  function _handleKLineData(data: MarketDataItem) {
    // 判断k线图当前币种
    if (!currentKLineSymbol || data.StockCode !== currentKLineSymbol) {
      return
    }

    // 24小时k线图数据
    kline24HData.value = {
      amount: 0,
      close: data.LastClose,
      count: 0,
      high: data.High,
      id: Number(data.LastTime),
      low: data.Low,
      open: data.Open,
      price: data.Price,
      vol: data.TotalVol,
    }

    if (kLineDataList.value.length > 0) {
      let kLineData: KLineItem
      const lastData = kLineDataList.value[kLineDataList.value.length - 1]

      if (oldLastPrice === 0) {
        oldLastPrice = lastData.close ?? 0
      }

      if (oldKLineData) {
        const high = data.Price > oldKLineData.high ? data.Price : oldKLineData.high
        const low = data.Price < oldKLineData.low ? data.Price : oldKLineData.low

        kLineData = {
          id: Number(data.LastTime) * 1000,
          open: oldKLineData.open,
          high,
          low,
          close: data.Price,
          vol: data.TotalVol - oldTotalVol,
          count: 0,
          amount: 0,
          price: data.Price,
        }
      } else {
        kLineData = {
          id: Number(data.LastTime) * 1000,
          open: oldLastPrice ?? data.Price,
          high: data.Price,
          low: data.Price,
          close: data.Price,
          vol: 0,
          count: 0,
          amount: 0,
          price: data.Price,
        }
        oldKLineData = kLineData
        oldTotalVol = data.TotalVol
      }

      if (newKLineData.value.id - lastData.id >= options[unref(optionIndex)].time * 1000) {
        kLineDataList.value.push(kLineData)
        oldKLineData = void 0
        oldTotalVol = 0
        oldLastPrice = data.Price
      }

      newKLineData.value = kLineData
    }
  }

  function _handleWebsocketClose(e) {
    if (websocket) {
      websocket = null
      handleWebsocket()
    }

    clearInterval(timer)
    isWebsocketConnSuccess.value = false

    console.warn('websocket close:', e)
  }

  function _handleWebsocketError(e) {
    websocket = null
    clearInterval(timer)
    isWebsocketConnSuccess.value = false
    console.error('websocket err:', e)
  }

  function _wsSendPong(time) {
    _wsSend({
      ping: time,
    })
  }

  function _wsSend(data: object) {
    if (!websocket) {
      console.warn('websocket disconnected.')
      handleWebsocket()
      return
    }

    try {
      websocket.send(JSON.stringify(data))
    } catch {
      websocket.close()
      websocket = null
    }
  }

  return {
    optionIndex,
    currencyMarketList,
    kLineDataList,
    newKLineData,
    hasDataChange,
    kline24HData,
    isWebsocketConnSuccess,
    handleWebsocket,
    requestTicker24hrData,
    subKLineData,
    symbolPriceMap,
    typePriceMap,
    requestMarketKLineLoading,
    isGetKLineDataListFinish,
  }
})
