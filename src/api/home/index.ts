import lxRequest from '..'
import { localCache } from '@/utils/cache'
import type { LangCode } from '@/api/model/BaseModel'
import type { IBannerItem } from '@/api/home/model/homeModel'

enum Api {
  banner = '/api/config/getCarouselImage',
  stats = '/api/config/stats',
  perkDetail = '/api/config/rechargeWelfare',
}

export const getBanners = () => {
  const langCode: LangCode = localCache.getCache('i18nLocale')
  return lxRequest<LangCode, IBannerItem[]>({
    url: `${Api.banner}?lang=${langCode}`,
    method: 'GET',
  })
}

export const statsApi = () => {
  return lxRequest({
    url: Api.stats,
    method: 'GET',
  })
}

export function getPerksDetail() {
  const langCode: LangCode = localCache.getCache('i18nLocale')
  return lxRequest<null, string>({
    url: `${Api.perkDetail}?lang=${langCode}`,
    method: 'GET',
  })
}
