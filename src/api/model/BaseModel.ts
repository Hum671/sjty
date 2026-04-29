export const SUCCESS_CODE = 200

export interface IBaseRes {
  code: 200
  data: null
  msg: string
}

export interface BaseParams {
  page: number
  pageSize: number
}

export interface BaseResponse<T> {
  total: number
  list: T
}

export enum LangCode {
  zh_cn = 'zh-cn',
  zh_tw = 'zh-tw',
  en_us = 'en-us',
  ja_jp = 'ja-jp',
  vi_vn = 'vi-vn',
  ko_kr = 'ko-kr',
  de_at = 'de-at',
  fr_fr = 'fr-fr',
  ru_ru = 'ru-ru',
  th_th = 'th-th',
}
