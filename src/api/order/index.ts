import lxRequest from '..'
import type { BaseParams, BaseResponse } from '../model/BaseModel'
import type {
  BuyOrderSecondParams,
  CoinRecordsItem,
  CoinRecordsParams,
  CoinTradeParams,
  OrderRecordItem,
} from './model/orderModel'

enum Api {
  BuyOrderSecond = '/api/orderSecond/buy',
  GetRecordsSecond = '/api/orderSecond/historyRecords',
  GetRealtimeRecords = '/api/orderSecond/realTimeRecords',
  GetOrderDetails = '/api/orderSecond/detail',
  CoinTrade = '/api/orderCoinCoin/trade',
  GetCoinRecords = '/api/orderCoinCoin/records',
  CoinCancel = '/api/orderCoinCoin/cancel',
}

// 购买秒合约交易订单
export function buyOrderSecond(data: BuyOrderSecondParams) {
  return lxRequest<BuyOrderSecondParams, number>({
    url: Api.BuyOrderSecond,
    method: 'POST',
    data,
  })
}

// 交易记录
export function getRecordsSecond(data: BaseParams) {
  return lxRequest<BaseParams, BaseResponse<OrderRecordItem[]>>({
    url: Api.GetRecordsSecond,
    data,
  })
}

// 获取实时交易记录
export function getRealtimeRecords() {
  return lxRequest<null, OrderRecordItem[]>({
    url: Api.GetRealtimeRecords,
  })
}

// 获取订单交易详情
export function getOrderDetilas(id: number) {
  return lxRequest<{ id: number }, OrderRecordItem>({
    url: Api.GetOrderDetails,
    data: { id },
  })
}

// 币币交易
export function coinTrade(data: CoinTradeParams) {
  return lxRequest<CoinTradeParams, string>({
    url: Api.CoinTrade,
    method: 'POST',
    data,
  })
}

// 现货交易记录
export function getCoinRecords(data: CoinRecordsParams) {
  return lxRequest<CoinRecordsParams, BaseResponse<CoinRecordsItem[]>>({
    url: Api.GetCoinRecords,
    method: 'GET',
    data,
  })
}

// 撤销
export function coinCancel(id: number) {
  return lxRequest({
    url: Api.CoinCancel,
    method: 'GET',
    data: { id },
  })
}
