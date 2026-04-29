import lxRequest from '..'
import type { LangCode } from '@/api/model/BaseModel'
import type { IAboutItem } from '@/api/about/model/aboutModel'
import { localCache } from '@/utils/cache'

enum Api {
  abouts = '/api/config/about',
  aboutDetail = '/api/config/aboutDetails',
}

export function getAbout() {
  const langCode: LangCode = localCache.getCache('i18nLocale')

  return lxRequest<LangCode, IAboutItem>({
    url: `${Api.abouts}?lang=${langCode}`,
    method: 'GET',
  })
}
