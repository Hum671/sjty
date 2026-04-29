import pako from 'pako'

import { getCoinList } from '@/api/market'
import type { CoinCoinItem, CoinData } from '@/api/market/model/MarketModel'
import { deepCopy } from '@/utils/utils'

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

const huobiWssUrl = 'wss://api.huobi.pro/ws'

export const useCoinMarketStore = defineStore('coinMarket', () => {
  let websocket: WebSocket

  const coinList = ref<CoinCoinItem[]>()
  const marketDepthList = ref<{ asks: number[]; bids: number[] }>()
  const isCoinWebsocketConnSuccess = ref(false)

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      if (websocket && websocket.readyState !== websocket.OPEN) {
        websocket.close()
        websocket = null
      }
    } else {
      if (!websocket) {
        _handleWebsocket()
      }
    }
  })

  onMounted(() => {
    // _handleCoinList();
  })

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

  // 订阅行情深度
  function subMarketDepth(symbol: string) {
    _wsSend({
      sub: `market.${symbol.toLowerCase()}.depth.step1`,
    })
  }

  // 取消订阅行情深度
  function unsubMarketDepth(symbol: string) {
    _wsSend({
      unsub: `market.${symbol.toLowerCase()}.depth.step1`,
    })
  }

  // 订阅行情数据
  function _subTicker24hrData(symbols: string[]) {
    for (const value of symbols) {
      _wsSend({
        sub: `market.${value.toLowerCase()}.ticker`,
      })
    }
  }

  // 请求币币列表
  function _handleCoinList() {
    if (coinList.value && websocket) {
      return
    }
    getCoinList().then((res) => {
      coinList.value = res.data
      _handleWebsocket()
    })
  }

  // ws连接
  function _handleWebsocket() {
    if (websocket) {
      return
    }

    websocket = new WebSocket(huobiWssUrl)

    websocket.onopen = _handleWebsocketOpen
    websocket.onmessage = _handleWebsocketMessage
    websocket.onclose = _handleWebsocketClose
    websocket.onerror = _handleWebsocketError
  }

  function _handleWebsocketOpen() {
    if (!coinList.value) {
      return
    }

    console.log('coin websocket open success!')
    isCoinWebsocketConnSuccess.value = true

    const symbols = coinList.value.map((item) => item.symbol)
    _subTicker24hrData(symbols)
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

      // 匹配行情深度数据
      const marketDepthRule = /^market\.[a-zA-Z0-9]+\.depth.step[0-9]*$/
      if (json.ch && marketDepthRule.test(json.ch)) {
        marketDepthList.value = json.tick
      }
    }

    reader.readAsArrayBuffer(e.data)
  }

  function _handleWebsocketClose(e) {
    websocket = null
    isCoinWebsocketConnSuccess.value = false
    console.warn('websocket close:', e)
  }

  function _handleWebsocketError(e) {
    websocket = null
    isCoinWebsocketConnSuccess.value = false
    console.error('websocket err:', e)
  }

  function _handleTicker24hrData(data: CoinData) {
    const tempList = deepCopy(coinList.value)
    const find = tempList.find((item) => `market.${item.symbol}.ticker` === data.ch)
    if (find) {
      find.data = data
    }
    coinList.value = tempList
  }

  function _wsSendPong(time) {
    _wsSend({
      pong: time,
    })
  }

  function _wsSend(data: object) {
    if (!websocket) {
      console.warn('websocket coin disconnected.')
      _handleWebsocket()
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
    coinList,
    marketDepthList,
    isCoinWebsocketConnSuccess,

    handlePriceChangePercent,
    handlePriceColor,

    subMarketDepth,
    unsubMarketDepth,
  }
})
