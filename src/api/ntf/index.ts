import lxRequest from '..'
import type {
  INtfCardRes,
  INtfCardGroupRes,
  IDrawCountRes,
  INTFRecordParams,
  INTFRecordRes,
} from './model/ntfModel'
import type { IBaseRes } from '../model/BaseModel'

enum Api {
  noticeApi = '/api/NFT/getResources',
  groupApi = '/api/NFT/group',
  startApi = '/api/NFT/start',
  getRecords = '/api/NFT/records',
  exchangeApi = '/api/NFT/exchange',
  getDrawCount = '/api/NFT/getDrawCount',
  buyApi = '/api/NFT/buy',
  getMyResources = '/api/NFT/getMyResources',
}

// 获取图片资源
export function getNtfResources() {
  return lxRequest<null, INtfCardRes>({
    url: Api.noticeApi,
    method: 'GET',
  })
}

// 卡牌组合与集卡进度
export function getNtfGroup() {
  return lxRequest<null, INtfCardGroupRes>({
    url: Api.groupApi,
    method: 'GET',
  })
}

// 开始抽卡
export function startApi(num: number = 1) {
  return lxRequest<{ num: number }, number[]>({
    url: Api.startApi,
    method: 'GET',
    data: { num },
  })
}

// 兑换记录
export function getRecords(data: INTFRecordParams) {
  return lxRequest<INTFRecordParams, INTFRecordRes>({
    url: Api.getRecords,
    method: 'GET',
    data,
  })
}

// 集卡组合兑换为USDT
export function exchangeApi(groupId: number) {
  return lxRequest<{ groupId: number }, IBaseRes>({
    url: Api.exchangeApi,
    method: 'GET',
    data: { groupId },
  })
}

// 获取抽卡次数
export function getDrawCount() {
  return lxRequest<null, IDrawCountRes>({
    url: Api.getDrawCount,
    method: 'GET',
  })
}

// 购买抽卡次数
export function buyApi(num: number = 10) {
  return lxRequest<{ num: number }, IBaseRes>({
    url: Api.buyApi,
    method: 'GET',
    data: { num },
  })
}

// 购买抽卡次数
export function getMyResources() {
  return lxRequest<{ num: number }, number[]>({
    url: Api.getMyResources,
    method: 'GET',
  })
}
