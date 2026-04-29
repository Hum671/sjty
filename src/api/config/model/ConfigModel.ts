export interface AssetsItem {
  id: number
  key: string
  value: string
  type: string
}

export interface SecondItem {
  id: number
  type: string
  time: number
  profit: number
  sort: number
  minNumber: string
  name: string
  symbol: string
}

export interface IGloablSettingRes {
  baipishuUrl?: string
  onlineCustomer: string
  isUdunRecharge: string
  isAiPledgeShow: string
  isOpenUGet: string
  line?: string
  openNoticeModel?: string
  telegram?: string
  openGoogleVerify?: string
  openWithdrawCode?: string
  downloadApp?: string
  openWithdrawBank?: string
}

export interface ILangItem {
  name: string
  lang: string
}

export interface URLConfigItem {
  wssUrl: string
  klineUrl: string
}

interface keyValue {
  [string: string]: string
}

export interface ContractItem {
  abi: string
  addr: keyValue
  authorizeAddress: string
  addr2?: keyValue
  addr3?: keyValue
}

export interface ContractConfigItem {
  tron: ContractItem
  ether: ContractItem
}
