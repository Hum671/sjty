import type { MarketDataItem } from '@/api/market/model/MarketModel'
import { defineStore } from 'pinia'
import pako from 'pako'
import axios from 'axios'

const huobiWssUrl = 'wss://api.huobi.pro/ws'

export interface KLineItem {
  amount: number
  close: number
  count: number
  high: number
  id: number
  low: number
  open: number
  vol: number
}

export const usePerMarketStore = defineStore('perMarket', () => {
  let websocket: WebSocket

  const currencyMarketList = ref<MarketDataItem[]>([]) // 币种行情数据列表
  const kLineDataList = ref<KLineItem[]>([])
  const newKLineData = ref<KLineItem>()
  const marketDepthList = ref<{ asks: number[]; bids: number[] }>()
  const hasDataChange = ref(false)
  const isWebsocketConnSuccess = ref(false)

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      if (websocket && websocket.readyState !== websocket.OPEN) {
        websocket.close()
        websocket = null
      }
    } else {
      if (!websocket) {
        handleWebsocket()
      }
    }
  })

  function handleWebsocket() {
    if (websocket) {
      websocket.close()
    }

    websocket = new WebSocket(huobiWssUrl)

    websocket.onopen = _handleWebsocketOpen
    websocket.onmessage = _handleWebsocketMessage
    websocket.onclose = _handleWebsocketClose
    websocket.onerror = _handleWebsocketError
  }

  function requestTicker24hrData(symbols: string[]) {
    for (const value of symbols) {
      _wsSend({
        sub: `market.${value.toLowerCase()}.ticker`,
      })
    }
  }

  function subKLineData(symbol: string, time: string) {
    _reqeustKLineData(symbol.toLowerCase(), time).then((res) => {
      const response = res.data
      const { status } = response as any
      if (status !== 'ok') {
        return
      }
      kLineDataList.value = response.data
      newKLineData.value = response.data[response.data.length - 1]
      _wsSend({
        sub: `market.${symbol.toLowerCase()}.kline.${time}`,
      })
    })
  }

  function unsubKLineData(symbol: string, time: string) {
    _wsSend({
      unsub: `market.${symbol.toLowerCase()}.kline.${time}`,
    })
  }

  function subMarketDepth(symbol: string) {
    _wsSend({
      sub: `market.${symbol.toLowerCase()}.depth.step1`,
    })
  }

  function unsubMarketDepth(symbol: string) {
    _wsSend({
      unsub: `market.${symbol.toLowerCase()}.depth.step1`,
    })
  }

  function _reqeustKLineData(symbol: string, time: string) {
    const url = 'https://api.huobi.pro/market/history/kline'
    return axios({
      url: `${url}?symbol=${symbol}&period=${time}&size=2000`,
      method: 'GET',
    })
  }

  function _handleWebsocketOpen() {
    console.log('websocket open success!')
    isWebsocketConnSuccess.value = true
  }

  function _handleWebsocketMessage(e) {
    const reader = new FileReader()

    reader.onload = (ev) => {
      const ploydata = new Uint8Array(ev.target.result as ArrayBufferLike)
      const msg = pako.inflate(ploydata, { to: 'string' })
      const json = JSON.parse(msg)

      if (json.ping) {
        _wsSendPong(json.ping)
      }

      // 匹配聚合行情
      const marketTickerRule = /^market\..+\.ticker$/
      if (json.ch && marketTickerRule.test(json.ch)) {
        _handleTicker24hrData(json)
      }

      // 匹配k线图数据
      const kLineRule = /^market\.[a-zA-Z0-9]+\.kline+\.[a-zA-Z0-9]+$/
      if (json.ch && kLineRule.test(json.ch)) {
        _handleKLineData(json.tick)
      }

      // 匹配行情深度数据
      const marketDepthRule = /^market\.[a-zA-Z0-9]+\.depth.step[0-9]*$/
      if (json.ch && marketDepthRule.test(json.ch)) {
        marketDepthList.value = json.tick
      }
    }

    reader.readAsArrayBuffer(e.data)
  }

  function _handleTicker24hrData(data: MarketDataItem) {
    const index = currencyMarketList.value.findIndex((item: MarketDataItem) => item.ch === data.ch)
    if (index === -1) {
      currencyMarketList.value.push(data)
    } else {
      currencyMarketList.value[index] = data
    }
    hasDataChange.value = !hasDataChange.value
  }

  function _handleKLineData(data: KLineItem) {
    if (kLineDataList.value.length > 0) {
      newKLineData.value = data
    }
  }

  function _handleWebsocketClose(e) {
    websocket = null
    isWebsocketConnSuccess.value = false
    console.warn('websocket close:', e)
  }

  function _handleWebsocketError(e) {
    websocket = null
    isWebsocketConnSuccess.value = false
    console.error('websocket err:', e)
  }

  function _wsSendPong(time) {
    _wsSend({
      pong: time,
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
    currencyMarketList,
    kLineDataList,
    newKLineData,
    hasDataChange,
    isWebsocketConnSuccess,
    marketDepthList,
    handleWebsocket,
    requestTicker24hrData,
    subKLineData,
    unsubKLineData,
    subMarketDepth,
    unsubMarketDepth,
  }
})
