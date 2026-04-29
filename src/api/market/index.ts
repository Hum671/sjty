import lxRequest from '..'
import type {
  CoinCoinItem,
  KLineParams,
  MarketItem,
  OpenPositionParam,
  ClosePositionParam,
  OpenOrdersItem,
  CurrentPositionItem,
  ExecuteTPnSLParam,
  TradeHistoryItem,
  DepthInfoItem,
} from './model/MarketModel'

enum Api {
  GetSecondList = '/api/market/secondList',
  RequestMarketKLine = '/api/market/requestMarketKLine',
  GetCoinCoinList = '/api/transaction/getCoinCoinList',

  OpenPosition = '/api/orderSustainable/openPosition',
  ClosePosition = '/api/orderSustainable/closePosition',
  GetOpenOrders = '/api/orderSustainable/getOpenOrders',
  CancelOrder = '/api/orderSustainable/cancelOrder',
  GetCurrentPosition = '/api/orderSustainable/getCurrentPosition',
  ExecuteTPnSL = '/api/orderSustainable/executeTPnSL',
  GetTradeHistory = '/api/orderSustainable/getTradeHistory',

  GetDepthList = '/api/market/getDepthList',
}

// 获取秒合约币种
export function getSecondList() {
  return lxRequest<null, MarketItem>({
    url: Api.GetSecondList,
    method: 'GET',
  })
}

// 请求k线图数据
export function requestMarketKLine(data: KLineParams) {
  return lxRequest<KLineParams, number[][]>({
    url: Api.RequestMarketKLine,
    method: 'GET',
    data,
  })
}

// 获取币币种
export function getCoinList() {
  return lxRequest<null, CoinCoinItem[]>({
    url: Api.GetCoinCoinList,
    method: 'GET',
  })
}

// 开仓
export function openPositionApi(data: OpenPositionParam) {
  return lxRequest<OpenPositionParam, any>({
    url: Api.OpenPosition,
    data,
    method: 'POST',
  })
}

// 平仓
export function closePositionApi(data: ClosePositionParam) {
  return lxRequest<ClosePositionParam, any>({
    url: Api.ClosePosition,
    data,
    method: 'POST',
  })
}

// 當前委托
export function getOpenOrders() {
  return lxRequest<null, OpenOrdersItem[]>({
    url: Api.GetOpenOrders,
    method: 'GET',
  })
}

// 委托撤單
export function cancelOrderApi(data: { type: 1 | 2; id: number }) {
  return lxRequest<{ type: 1 | 2; id: number }, any>({
    url: Api.CancelOrder,
    data,
    method: 'POST',
  })
}

// 當前倉位
export function getCurrentPosition() {
  return lxRequest<null, CurrentPositionItem[]>({
    url: Api.GetCurrentPosition,
    method: 'GET',
  })
}

// 止盈止損
export function executeTPnSL(data: ExecuteTPnSLParam) {
  return lxRequest<ExecuteTPnSLParam, any>({
    url: Api.ExecuteTPnSL,
    data,
    method: 'POST',
  })
}

// 永續交易歷史
export function getTradeHistory() {
  return lxRequest<null, TradeHistoryItem[]>({
    url: Api.GetTradeHistory,
    method: 'GET',
  })
}

// 深度信息
export function getDepthList(symbol: string) {
  return lxRequest<any, DepthInfoItem>({
    url: Api.GetDepthList,
    method: 'GET',
    data: {
      symbol,
    },
  })
}
