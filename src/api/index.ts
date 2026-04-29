import Request from './request'
import type { AxiosResponse } from 'axios'
import type { RequestConfig } from './request/types'
import { localCache } from '@/utils/cache'

export interface LxResponse<T> {
  code: number
  msg: string
  data?: T
}

// 重写返回类型
interface LxRequestConfig<T, R> extends RequestConfig<LxResponse<R>> {
  data?: T
}

const request = new Request({
  baseURL: import.meta.env.BASE_URL,
  timeout: 1000 * 60 * 5,
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config) => {
      config.headers.Authorization = localCache.getCache('SESSION_TOKEN')
      return config
    },

    // 响应拦截器
    responseInterceptors: (result: AxiosResponse) => {
      return result
    },

    // 错误请求拦截
    requestInterceptorsCatch(err) {
      return err
    },

    // 错误相应拦截
    responseInterceptorsCatch(err) {
      return err
    },
  },
})

/**
 * @description: 函数的描述
 * @generic D 请求参数
 * @generic T 响应结构
 * @param {LxRequestConfig} config 不管是GET还是POST请求都使用data
 * @returns {Promise}
 */
const lxRequest = <D = any, T = any>(config: LxRequestConfig<D, T>) => {
  const { method = 'GET' } = config
  if (method === 'get' || method === 'GET') {
    config.params = config.data
  }
  return request.request<LxResponse<T>>(config)
}

export default lxRequest
