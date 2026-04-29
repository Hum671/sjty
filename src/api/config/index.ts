import lxRequest from '..'
import type {
  AssetsItem,
  SecondItem,
  IGloablSettingRes,
  URLConfigItem,
  ContractConfigItem,
} from './model/ConfigModel'

enum Api {
  GetAssetsConfig = '/api/config/assets',
  GetSecondList = '/api/transaction/secondList',
  GetSettingInfo = '/api/config/index',
  GetUrlConfig = '/api/config/getUrl',
  GetContractConfig = '/api/config/getContact',
}

// 获取资产配置(最小充值，最少提现)
export function getAssetsConfig() {
  return lxRequest<null, AssetsItem[]>({
    url: Api.GetAssetsConfig,
    method: 'GET',
  })
}

// 获取秒交易配置
export function getSecondListConfig() {
  return lxRequest<null, SecondItem[]>({
    url: Api.GetSecondList,
    method: 'GET',
  })
}

// 白皮书、客服、菜单
export function getSettingInfo() {
  return lxRequest<null, IGloablSettingRes>({
    url: Api.GetSettingInfo,
    method: 'GET',
  })
}

// 获取URL配置
export function getUrlConfig() {
  return lxRequest<null, URLConfigItem>({
    url: Api.GetUrlConfig,
  })
}

// 获取合约配置
export function getContractConfig() {
  return lxRequest<null, ContractConfigItem>({
    url: Api.GetContractConfig,
  })
}
