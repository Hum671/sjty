import lxRequest from '..'
import { localCache } from '@/utils/cache'
import type { LangCode } from '@/api/model/BaseModel'
import type { IPromotionRes } from './model/promotionCenterModel'

enum Api {
  getPromotionInfo = '/api/user/promotion',
  promotionRule = '/api/user/promotionRule',
}

export function getPromotionInfo() {
  const langCode: LangCode = localCache.getCache('i18nLocale')

  return lxRequest<LangCode, IPromotionRes>({
    url: `${Api.getPromotionInfo}?lang=${langCode}`,
    method: 'GET',
  })
}

export function getPromotionRule() {
  const langCode: LangCode = localCache.getCache('i18nLocale')
  return lxRequest<LangCode, any>({
    url: `${Api.promotionRule}?lang=${langCode}`,
    method: 'GET',
  })
}
