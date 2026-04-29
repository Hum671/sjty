import axios, { type AxiosResponse } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type { RequestConfig, RequestInterceptors, CreateRequestConfig } from './types'
import router from '@/router'
import { confirm } from '@/utils/dialog'
import { delToken } from '@/utils/utils'

class Request {
  // axios 实例
  instance: AxiosInstance
  // 拦截器对象
  interceptorsObj?: RequestInterceptors<AxiosResponse>
  // * 存放取消请求控制器Map
  abortControllerMap: Map<string, AbortController>

  constructor(config: CreateRequestConfig) {
    this.instance = axios.create(config)
    // * 初始化存放取消请求控制器Map
    this.abortControllerMap = new Map()
    this.interceptorsObj = config.interceptors

    // 拦截器执行顺序 接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
    this.instance.interceptors.request.use(
      (res: InternalAxiosRequestConfig) => {
        const controller = new AbortController()
        const url = res.url || ''
        res.signal = controller.signal
        this.abortControllerMap.set(url, controller)
        return res
      },
      (err: any) => err,
    )

    // 使用实例拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch,
    )

    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch,
    )

    // 全局响应拦截器保证最后执行
    this.instance.interceptors.response.use(
      // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
      (res: AxiosResponse) => {
        const url = res.config.url || ''

        if ((res as any)?.response?.status === 401) {
          delToken()
          router.replace('/login')
          return null
        }

        if (
          (res as any)?.response?.status === 400 &&
          (res as any)?.response?.data === 'NEED_TO_FUND_PASSWORD'
        ) {
          // 需要设置资金密码
          confirm('h5.password.no_set_fund_password').then(() => {
            router.push('/fundPassword')
          })
          return null
        }

        this.abortControllerMap.delete(url)
        return res.data
      },
      (err: any) => {
        const { response } = err
        const { status, data } = response

        if (status === 401) {
          // 需要登录
          router.push('/login')
        }

        if (status === 400 && data === 'NEED_TO_FUND_PASSWORD') {
          // 需要设置资金密码
          confirm('h5.password.no_set_fund_password').then(() => {
            router.push('/fundPassword')
          })
        }
      },
    )
  }

  request<T>(config: RequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config as any)
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors(res)
          }

          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }

  cancelAllRequest() {
    for (const [, controller] of this.abortControllerMap) {
      controller.abort()
    }
    this.abortControllerMap.clear()
  }

  /**
   * 取消指定的请求
   * @param url 待取消的请求URL
   */
  cancelRequest(url: string | string[]) {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      this.abortControllerMap.get(_url)?.abort()
      this.abortControllerMap.delete(_url)
    }
  }
}

export default Request
export { RequestConfig, RequestInterceptors }
