interface CurrencyClassifyItem {
  classifyLangKey: string
}

interface ClassifyItem {
  ws: string
  sourceType: string
}

interface IconAttachementsItem {
  id?: number
  filepath?: string
  host: string
}

interface DepthItem {
  [key: string]: number // 买卖单价及数量
}

export interface Depth {
  Buy: DepthItem[]
  Sell: DepthItem[]
}

interface BSItem {
  time: string
  price: number
  size: number
  direction: number
}

export interface MarketDataItem {
  StockCode: string
  Price: number
  Open: number
  LastClose: number
  High: number
  Low: number
  Time: string
  LastTime: string
  BP1: number
  BV1: number
  SP1: number
  SV1: number
  TotalVol: number
  Depth: Depth
  BS: BSItem[]
  Info: any[] // 你可以替换成相应的类型
  lastSize: number
  Diff: number
  DiffRate: number
}

export interface MarketListItem {
  id: number
  name: string
  symbol: string
  sort: number
  type: string
  classify: ClassifyItem
  subName: string
  iconAttachments: IconAttachementsItem
  isMarketClose?: 0 | 1
  data?: MarketDataItem
}

export interface MarketItem {
  classify: CurrencyClassifyItem
  list: MarketListItem[]
}

export interface KLineParams {
  code: string
  time: string
  rows: number
}

export interface CoinData {
  ch: string
  tick: {
    amount: number
    ask: number
    askSize: number
    bid: number
    bidSize: number
    close: number
    count: number
    high: number
    lastPrice: number
    lastSize: number
    low: number
    open: number
    vol: number
  }
}

export interface CoinCoinItem {
  id: number
  name: string
  symbol: string
  sort: number
  fee: string
  icon: number
  attachments: { host: string; filepath: string }
  data?: CoinData
}

export interface OpenPositionParam {
  orderType: 1 | 2 // 委托类型（1-市价委托，2-限价委托）
  direction: 1 | -1 // 委托方向（1-开多，-1-开空）
  currency: string // 交易对
  margin: string | number // 委托保证金
  lever: string | number // 杠杆倍数
  type: 1 | 2 // 仓位模式 1-逐仓 2-全仓
  entrustPrice?: string | number // 委托价格(只有限价委托才带这个)
}

export interface ClosePositionParam {
  currency: string
  direction: 1 | -1 // 1-开多 -1-开空
  number: string | number // 平仓数量
  entrustPrice?: string | number // 委托价格（限价的时候才有）
  orderType: 1 | 2 // 1-市价 2-限价
  lever: number
}

export interface OpenOrdersItem {
  createTime: string
  direction: 1 | -1 // 委托方向（1-开多，-1-开空）
  entrustPrice: string | number // 委托价格(只有限价委托才带这个)
  id: number
  number: string
  orderType: 1 | 2 // 委托类型（1-市价委托，2-限价委托）
  type: 1 | 2 // 类型 1-开仓 2-平仓
  currency: string
  positionType: 1 | 2 // 仓位模式 1-逐仓 2-全仓
}
export interface CurrentPositionItem {
  createTime: string
  currency: string
  direction: 1 | -1 // 委托方向（1-开多，-1-开空）
  entrustPrice: string | number // 委托价格(只有限价委托才带这个)
  id: number
  lever: number
  margin: string
  number: string
  openPrice: string
  status: string
  stopLess: string
  takeProfit: string
  userId: number
  // orderType: 1 | 2; // 委托类型（1-市价委托，2-限价委托）
  type: 1 | 2 // 仓位模式 1-逐仓 2-全仓
}

export interface ExecuteTPnSLParam {
  id: number
  stopLess?: string // 止損
  takeProfit?: string // 止盈
}

export interface TradeHistoryItem {
  closeNumber: string // 平仓量
  closePrice: string // 平仓均价
  closeTime: number // 平仓时间（空就是-）
  createTime: string
  currency: string // 把usdt过滤掉，然后eth转为大写就是单位
  direction: 1 | -1 // 委托方向（1-开多，-1-开空）
  entrustPrice: string // 委托价格(只有限价委托才带这个)
  id: number
  type: 1 | 2 // 类型 1-逐仓 2-全仓
  income: string // 已实现收益
  isFinish: 0 | 1 // 是否全部平仓(0-就是)部分平仓
  lever: number // 杠杆
  number: string // 最大持仓
  openPrice: string // 开仓均价
  isEntrust: 0 // 是否委托
  osId: number
  updateTime: string
  userId: number
  yield: number // 收益率
}

export interface DepthInfoItem {
  bids: string[]
  asks: string[]
}
