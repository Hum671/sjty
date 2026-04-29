import lxRequest from '..'
import { localCache } from '@/utils/cache'
import type { LangCode } from '@/api/model/BaseModel'
import type { INoticeItem, INoticeDetailItem } from './model/noticeBarModel'

enum Api {
  noticeApi = '/api/config/getNotice',
  noticeDetail = '/api/config/getNoticeDetailsById',
}

export function getNoticeList() {
  const langCode: LangCode = localCache.getCache('i18nLocale')

  return lxRequest<LangCode, Array<INoticeItem>>({
    url: `${Api.noticeApi}?lang=${langCode}`,
    method: 'GET',
  })
}

export function getNoticeDetail(id: number) {
  return lxRequest<number, Array<INoticeDetailItem>>({
    url: `${Api.noticeDetail}?id=${id}`,
    method: 'GET',
  })
}
