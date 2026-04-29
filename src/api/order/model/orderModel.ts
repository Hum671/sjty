export interface BuyOrderSecondParams {
  secondListId: number
  number: number
  direction: number // 1-涨 2-跌
  currencyId: number
}

export interface OrderRecordItem {
  id: number
  time: number
  profit: number
  direction: number
  number: string
  gain: string
  status: number
  name: string
  buyPrice: string
  currentPrice: string
  closePrice: string
  finalNumber: string
  subName: string
  createTime: string
  buyTime?: number
  currentTime?: number
  symbol?: string
}

export interface CoinTradeParams {
  type: number // 1-限价，2-市价
  coinName: string
  symbol: string
  number: number
  direction: number
  price?: number // 只有限价委托有
}

export interface CoinRecordsParams {
  page: number
  limit: number
  type?: number
  status?: number
}

export interface CoinRecordsItem {
  id: number
  coin: string
  status: number
  type: number
  price: string
  number: string
  usdt: string
  direction: number
  userId: number
  feeNumber: string
  createTime: string
}
