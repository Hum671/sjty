import 'amfe-flexible'
import 'normalize.css/normalize.css'
import '@/assets/global.less'
import { Lazyload } from 'vant'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/utils/fixVant'
import i18n from './utils/i18n'
// import 'virtual:svg-icons-register'
import xssPlugin from '@/directivePlugin/xssPlugin'
import { localCache } from '@/utils/cache'
import { getCurrentURLParams } from '@/utils/utils'

const paramObj: any = getCurrentURLParams()
localCache.setCache('pid', paramObj?.pid)
localCache.setCache('aid', paramObj?.aid)
;(window as any).projectId = '8b29b90967f1c4911daeb230bae58a6e'

const app = createApp(App)

app.use(createPinia())
app.use(xssPlugin)
app.use(Lazyload)
app.use(i18n)
app.use(router)
app.mount('#app')
