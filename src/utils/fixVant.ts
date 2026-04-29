import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
import { Locale, ConfigProvider } from 'vant'

// 引入英文语言包
import enUS from 'vant/es/locale/lang/en-US'

Locale.use('en-US', enUS)

export default {
  install(app) {
    app.use(ConfigProvider)
  },
}
