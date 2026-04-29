import { showConfirmDialog } from 'vant'
import { i18n } from '@/utils/i18n'

const { t } = i18n.global

export function confirm(messageLangKey: string) {
  return new Promise((resolve, reject) => {
    showConfirmDialog({
      title: t('h5.common.prompt'),
      confirmButtonText: t('h5.common.confirm'),
      cancelButtonText: t('h5.common.cancel'),
      confirmButtonColor: '#7691e2',
      cancelButtonColor: '#97a3b6',
      message: t(messageLangKey),
    })
      .then(() => {
        resolve(null)
      })
      .catch(() => {
        reject()
      })
  })
}
