import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    isNeedLogin?: boolean
    title?: string
  }
}
