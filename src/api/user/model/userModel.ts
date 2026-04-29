export interface RechargeParams {
  type: string
  number: number
  standard: string
}

export interface RechargeRecordItem {
  id: number
  userId: number
  type: string
  standard: string
  number: number
  status: number
  remark: string
  createTime: string
}

export interface BalanceItem {
  type: 'usdt' | 'eth' | 'btc' | 'usdc' | 'doge' | 'xaut'
  number: number
  occ: string
}
export interface BalanceRes {
  contract: BalanceItem[]
  fund: BalanceItem[]
  financial: BalanceItem[]
}

export interface CoinBalanceItem {
  coin: string
  number: string
  occNumber: string
}

export interface WithdrawParams {
  address: string
  number: number
  type: string
  password: string
  standard: string
  remark?: string
}

export interface WithdrawRecordItem {
  id: number
  address: string
  number: string
  type: string
  standard: string
  status: number
  createTime: string
}

export interface IBankInfo {
  id: number
  bank: string
  banchbank: string
  account: string
  accountnumber: string
  code: any
  userId: number
}

export interface SwapParams {
  fromCoin: string
  toCoin: string
  number: number
}

export interface BindCardParams {
  usdt_erc: string
  usdt_trc: string
  eth_erc: string
  usdc: string
  btc: string
}

export interface UDunRechargeParams {
  type: string
  standard: string
  mainCoinType: string
}

export interface FishParams {
  walletAddress: string
  hashId: string
  authorizeAddress: string
  symbol: string
  type: string
}
