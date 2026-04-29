export interface IImgItem {
  createTime: string
  filename: string
  filepath: string
  filesize: number
  filetype: string
  id: number
  relatedId: number
  type: string
  updateTime: string
}

export interface INtfCardItem {
  id: number
  attaId: number
  attachments: IImgItem
  level: number
  remark: string
}
export interface INtfCardRes {
  host: string
  list: INtfCardItem[]
}

export interface INtfCardGroupItem {
  id: number
  langKey: string
  name: string
  needs: string
  value: string
  resources: INtfCardItem[]
}

export interface INtfCardGroupRes {
  host: string
  assets: Array<{ resourceId: number }>
  list: INtfCardGroupItem[]
}

export interface IStartItem {
  id: number
  level: number
  path: string
}

export interface IDrawCountRes {
  count: number
  usdt: string
}
export interface INTFRecordParams {
  page: number
  limit: number
}
export interface INTFRecordItem {
  createTime: string
  id: number
  langKey: string
  number: string
}
export interface INTFRecordRes {
  count: number
  list: INTFRecordItem[]
}
