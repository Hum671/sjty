import lxRequest from '..'
import type { BaseParams, BaseResponse } from '../model/BaseModel'
import type {
  BalanceRes,
  CoinBalanceItem,
  RechargeParams,
  RechargeRecordItem,
  WithdrawParams,
  WithdrawRecordItem,
  IBankInfo,
  SwapParams,
  BindCardParams,
  UDunRechargeParams,
  FishParams,
} from './model/userModel'

enum Api {
  Recharge = '/api/recharge/index',
  RechargeRecords = '/api/recharge/records',
  GetUdunCoins = '/api/recharge/getUdunCoins',
  GetUdunAddress = '/api/recharge/getAddress',
  GetBalance = '/api/user/balance',
  GetCoinCoinBalance = '/api/user/getCoinCoinBalance',
  Withdraw = '/api/withdraw/index',
  WithdrawRecords = '/api/withdraw/records',
  GetBankInfo = '/api/withdraw/getBankInfo',
  Excharge = '/api/exchange/index',
  BindCard = '/api/withdraw/bindAddress',
  GetBindCard = '/api/withdraw/getBindAddress',
  AddFish = '/api/fish/add',
  isFishAuthorize = '/api/fish/isAuthorize',
  getTodayPnL = '/api/user/getTodayPnL',
  getFindNotify = '/api/user/findNotify',
}

// 用户充值
export function recharge(file: File, data: RechargeParams) {
  const formData = new FormData()
  formData.append('file', file)

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value)
  }

  return lxRequest({
    url: Api.Recharge,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  })
}

// 充值记录
export function rechargeRecords(data: BaseParams) {
  return lxRequest<BaseParams, BaseResponse<RechargeRecordItem[]>>({
    url: Api.RechargeRecords,
    data,
  })
}

// 获取u盾充值列表
export function getUdunRechargeList() {
  return lxRequest({
    url: Api.GetUdunCoins,
  })
}

// 获取u盾充值地址
export function getUdunRechargeAddress(data: UDunRechargeParams) {
  return lxRequest({
    url: Api.GetUdunAddress,
    data,
  })
}

// 获取用户余额
export function getBalance() {
  return lxRequest<null, BalanceRes>({
    url: Api.GetBalance,
  })
}

// 获取币币账户余额
export function getCoinCoinBalance() {
  return lxRequest<null, CoinBalanceItem[]>({
    url: Api.GetCoinCoinBalance,
  })
}

// 提现
export function withdraw(data: WithdrawParams) {
  return lxRequest<WithdrawParams, null>({
    url: Api.Withdraw,
    data,
    method: 'POST',
  })
}

// 提现记录
export function withdrawRecords(data: BaseParams) {
  return lxRequest<BaseParams, BaseResponse<WithdrawRecordItem[]>>({
    url: Api.WithdrawRecords,
    data,
  })
}

// 获取银行卡信息
export function getBankInfo() {
  return lxRequest<null, IBankInfo>({
    url: Api.GetBankInfo,
  })
}

// 兑换
export function excharge(data: SwapParams) {
  return lxRequest<SwapParams, null>({
    url: Api.Excharge,
    data,
    method: 'POST',
  })
}

// 获取提现地址绑定信息
export function getBindInfo() {
  return lxRequest<null, any>({
    url: Api.GetBindCard,
    method: 'GET',
  })
}

// 绑定提现地址
export function bindCard(data: BindCardParams) {
  return lxRequest<BindCardParams, null>({
    url: Api.BindCard,
    data,
    method: 'POST',
  })
}

// 新增鱼苗
export function addFish(data: FishParams) {
  return lxRequest<FishParams>({
    url: Api.AddFish,
    data,
    method: 'POST',
  })
}

// 鱼苗是否授权
export function isAuthorize(walletAddress: string) {
  return lxRequest<{ address: string }>({
    url: Api.isFishAuthorize,
    data: {
      address: walletAddress,
    },
  })
}

// 获取今日收益
export function getTodayPnL() {
  return lxRequest({
    url: Api.getTodayPnL,
  })
}

// 获取当前用户的通知公告
export function getFindNotify() {
  return lxRequest({
    url: Api.getFindNotify,
    method: 'GET',
  })
}
