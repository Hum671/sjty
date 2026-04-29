import { sessionCache } from '@/utils/cache'
import { getToken } from '@/utils/utils'
import type { Router } from 'vue-router'

export default function interceptor(router: Router) {
  router.beforeEach((to, from, next) => {
    // const isNeedLogin = to.meta.isNeedLogin // 判断是否需要登录

    sessionCache.setCache('lastRoute', from.path)

    // if (!isNeedLogin) {
    //   return next()
    // }
    // if (!isNeedLogin) {
    //   return next()
    // }

    const isLogin = getToken()

    // 未登入的情况下，可以打开注册和登入，忘记密码页面
    if (!isLogin && ['/login', '/register', '/password'].includes(to.path)) {
      return next()
    }

    // 未登入的情况下，其他页面全部跳转到登入页面
    if (!isLogin) {
      return next('/login')
    }

    return next()
  })
}
