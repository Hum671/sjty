export interface IHelpItem {
  id: number
  title: string
}

export interface IDetailItemMsg {
  id: number
  title: string
  html: string
}

export interface IHelpDetailItem {
  message: IDetailItemMsg
  type: string
}
