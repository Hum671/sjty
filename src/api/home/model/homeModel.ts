export interface IImgItem {
  id: number
  filepath: string
  host: string
}

export interface IBannerItem {
  id: number
  imgAttachments: IImgItem
}
export interface IPerksDetailItem {
  id: number
  title: string
  html: string
}
