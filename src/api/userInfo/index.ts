import lxRequest from '..'
import type { IBaseRes } from '../model/BaseModel'
import type {
  IUserInfoRes,
  IBasicAuthenticationParams,
  IUpImagesRes,
  IAdvancedAuthenticationParams,
  IAuthenticationInfoRes,
  IHAuthenticationInfoRes,
  IUpdataPswParam,
} from './model/userInfoModel'

enum Api {
  userInfo = '/api/user/info',
  basicAuthentication = '/api/user/basicAuthentication',
  advancedAuthentication = '/api/user/advancedAuthentication',
  uploadImage = '/api/file/uploadImage',
  getBasicAuthenticationInfo = '/api/user/getBasicAuthenticationInfo',
  getAdvancedAuthenticationInfo = '/api/user/getAdvancedAuthenticationInfo',
  getEmailCode = '/api/user/getEmailCode',
  saveLoginPassword = '/api/user/saveLoginPassword',
  SaveMoneyPassword = '/api/user/saveMoneyPassword',
  SwitchToSimAccount = '/api/user/switchToSimAccount',
}

export function getUserInfo() {
  return lxRequest<null, IUserInfoRes>({
    url: Api.userInfo,
    method: 'GET',
  })
}

export function basicAuthentication(data: IBasicAuthenticationParams) {
  return lxRequest<IBasicAuthenticationParams, IBaseRes>({
    url: Api.basicAuthentication,
    data,
    method: 'POST',
  })
}

export function advancedAuthentication(data: IAdvancedAuthenticationParams) {
  return lxRequest<IAdvancedAuthenticationParams, null>({
    url: Api.advancedAuthentication,
    data,
    method: 'POST',
  })
}

export function uploadImage(data: File) {
  return lxRequest<File, IUpImagesRes>({
    url: Api.uploadImage,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function getBasicAuthenticationInfo() {
  return lxRequest<null, IAuthenticationInfoRes>({
    url: Api.getBasicAuthenticationInfo,
    method: 'GET',
  })
}

export function getAdvancedAuthenticationInfo() {
  return lxRequest<null, IHAuthenticationInfoRes>({
    url: Api.getAdvancedAuthenticationInfo,
    method: 'GET',
  })
}

export function getEmailCode(email: string) {
  return lxRequest<any, any>({
    url: Api.getEmailCode,
    data: {
      email: email,
    },
    method: 'GET',
  })
}

export function saveLoginPassword(data: IUpdataPswParam) {
  return lxRequest<IUpdataPswParam, { code: number; msg: string }>({
    url: Api.saveLoginPassword,
    data,
    method: 'POST',
  })
}

export function saveMoneyPassword(data: IUpdataPswParam) {
  return lxRequest<IUpdataPswParam, null>({
    url: Api.SaveMoneyPassword,
    data,
    method: 'POST',
  })
}

export function getSwitchToSimAccount() {
  return lxRequest<any, any>({
    url: Api.SwitchToSimAccount,
    method: 'GET',
  })
}
