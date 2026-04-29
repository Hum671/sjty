import lxRequest from '..'
import type { IBaseRes } from '../model/BaseModel'
import type {
  IAiPledgeItem,
  IAiPledgeDetail,
  IBuyAiParam,
  IGetPledgeRecordParam,
  IPledgeRecord,
} from './model/pledgeModel'

enum Api {
  GetAiPledgeList = '/api/transaction/getAiPledgeList',
  GetAiPledgeDetail = '/api/aiPledgeList/detail',
  BuyAiPledge = '/api/aiPledgeList/buy',
  GetTotalIncome = '/api/aiPledgeList/totalIncome',
  GetTodayIncome = '/api/aiPledgeList/todayIncome',
  GetPledgeRecords = '/api/aiPledgeList/records',
  AbortEarlyApi = '/api/aiPledgeList/abortEarly',
  GetIncomeApi = '/api/aiPledgeList/income',
}

// 获取质押列表 此接口不需要登录
export function getAiPledgeList() {
  return lxRequest<null, IAiPledgeItem[]>({
    url: Api.GetAiPledgeList,
    method: 'GET',
  })
}

// 获取AI质押详情
export function getAiPledgeDetail(id: string) {
  return lxRequest<null, IAiPledgeDetail>({
    url: `${Api.GetAiPledgeDetail}?id=${id}`,
    method: 'GET',
  })
}

// 购买质押
export function buyAiPledge(data: IBuyAiParam) {
  return lxRequest<IBuyAiParam, IBaseRes>({
    url: Api.BuyAiPledge,
    method: 'POST',
    data,
  })
}

// 获取总收益
export function getTotalIncome() {
  return lxRequest({
    url: Api.GetTotalIncome,
    method: 'GET',
  })
}

// 获取今日收益
export function getTodayIncome() {
  return lxRequest({
    url: Api.GetTodayIncome,
    method: 'GET',
  })
}

// 购买记录列表
export function getPledgeRecords(data: IGetPledgeRecordParam) {
  return lxRequest<IGetPledgeRecordParam, IPledgeRecord>({
    url: Api.GetPledgeRecords,
    method: 'GET',
    data,
  })
}

// 提前终止进行中的订单
export function abortEarlyApi(id: number) {
  return lxRequest({
    url: Api.AbortEarlyApi,
    method: 'GET',
    data: {
      id,
    },
  })
}
// AI质押的余额与总收益
export function getPeldgeIncomeApi() {
  return lxRequest<null, { income: number; usdt: number }>({
    url: Api.GetIncomeApi,
    method: 'GET',
  })
}
