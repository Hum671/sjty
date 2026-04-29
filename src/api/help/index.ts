import lxRequest from '..'
import { localCache } from '@/utils/cache'
import type { LangCode } from '@/api/model/BaseModel'
import type { IHelpItem, IHelpDetailItem } from './model/helpModel'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import langMap from './langMap'
import { i18n } from '@/utils/i18n'

enum Api {
  helps = '/api/config/helps',
  helpDetail = '/api/config/helpDetail',
}

export function getHelpList() {
  const langCode: LangCode = localCache.getCache('i18nLocale')

  return lxRequest<LangCode, IHelpItem[]>({
    url: `${Api.helps}?lang=${langCode}`,
    method: 'GET',
  })
}

export function getHelpDetail(id: number) {
  return lxRequest<number, Array<IHelpDetailItem>>({
    url: `${Api.helpDetail}?id=${id}`,
    method: 'GET',
  })
}

export function getYinsiZhengce(id: number) {
  const langCode: LangCode = localCache.getCache('i18nLocale')
  return new Promise((resolve) => {
    resolve({
      code: SUCCESS_CODE,
      data: [
        {
          html: langMap['yinsizhengce'][langCode],
          title: i18n.global.t('h5.passwor.Privacy_Policy'),
        },
      ],
    })
  })
}

export function getFalv(id: number) {
  const langCode: LangCode = localCache.getCache('i18nLocale')
  return new Promise((resolve) => {
    resolve({
      code: SUCCESS_CODE,
      data: [
        {
          html: langMap['falv'][langCode],
          title: i18n.global.t('h5.passwor.falv'),
        },
      ],
    })
  })
}
