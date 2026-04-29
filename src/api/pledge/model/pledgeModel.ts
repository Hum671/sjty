export interface IAiPledgeItem {
  name: string // 质押名称
  minBuyNumber: string // 最小购买金额注意Number转换
  dayMinIncome: number // 最小日收益率(注意除/100)
  dayMaxIncome: number // 最大日收益率(注意除/100)
}
export interface IAiPledgeDetail {
  id: number // 质押id
  name: string // 质押名称
  fee: number // 手续费(%)
  times: string // 质押时间，多个按,号隔开
  minBuyNumber: string // 最小购买金额注意Number转换
  maxBuyNumber: string // 最大购买金额注意Number转换
  dayMinIncome: number // 最小收益率(注意除/100)
  dayMaxIncome: number // 最大日收益率(注意除/100)
  yesterdayIncomeXaut: number // 昨日收益
  totalIncomeXaut: number // 累计收益
  buyNumber: number // 已申购
}

export interface IBuyAiParam {
  id: number
  day: string
  number: string
}

export interface IGetPledgeRecordParam {
  page: number
  pageSize: number
  isSettlement: number
}
export interface IPledgeRecordItem {
  buyNumber: string
  createTime: string
  day: number
  fee: number
  id: number
  isSettlement: number
  name: string
  settlementTime: any
  totalFee: string
  userId: number
  xaut: string
}

export interface IPledgeRecord {
  list: IPledgeRecord[]
  total: number
}
