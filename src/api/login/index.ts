import lxRequest from '..'
import { SUCCESS_CODE } from '../model/BaseModel'
import { localCache } from '@/utils/cache'

import type {
  ForgetPasswordParams,
  RegisterLoginParams,
  WalletLoginParams,
} from './model/loginModel'

enum Api {
  WalletLogin = '/api/login/wallet',
  RegisterLogin = '/api/login/email',
  GetRegisterCode = '/api/login/getEmailCode',
  ForgetPassword = '/api/login/forgetPassword',
}

// 钱包登录
export function walletLogin(data: WalletLoginParams) {
  return new Promise((resolve, reject) => {
    lxRequest<WalletLoginParams, { token: string }>({
      url: Api.WalletLogin,
      data,
      method: 'POST',
    }).then((res) => {
      if (res.code === SUCCESS_CODE) {
        localCache.setCache('SESSION_TOKEN', res.data.token)
        resolve(res.data.token)
      } else {
        reject(res.msg)
      }
    })
  })
}

// 注册登录同一个接口
export function registerLogin(data: RegisterLoginParams) {
  return new Promise((resolve, reject) => {
    lxRequest<RegisterLoginParams, { token: string }>({
      url: Api.RegisterLogin,
      data,
      method: 'POST',
    }).then((res) => {
      if (res.code === SUCCESS_CODE) {
        localCache.setCache('SESSION_TOKEN', res.data.token)
        resolve(res.data.token)
      } else {
        reject(res.msg)
      }
    })
  })
}

// 获取注册验证码
export function getRegisterCode(email: string) {
  return lxRequest({
    url: `${Api.GetRegisterCode}?email=${email}`,
    method: 'GET',
  })
}

export function forgetPassword(data: ForgetPasswordParams) {
  return lxRequest<ForgetPasswordParams, string>({
    url: Api.ForgetPassword,
    data,
    method: 'POST',
  })
}
