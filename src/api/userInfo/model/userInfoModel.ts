export interface IUserInfoRes {
  id: number // UID
  address: string // 钱包地址
  verify: number // 0-未认证 1-完成初级认证 2-完成高级认证(表示所有的认证都已经完成)
  email: any
  password: boolean // true修改密码
  score: number
  moneyPassword: boolean // true修改密码
}

export interface IBasicAuthenticationParams {
  name: string
  identification: string
  // birthday: string
  // front: number
  // backend: number
}

export interface IAdvancedAuthenticationParams {
  assets: number | null
  occupation: string | null
  incomeSource: string | null
  front: number
  back: number
  holding: number
}

export interface IUpImagesRes {
  id: number
  url: string
}

export interface IAuthenticationInfoRes {
  id: number
  name: string
  identification: string
  status: 1 | 2 | 3 // 1-认证中 2-认证成功 3-认证失败
  userId: number
  createTime: string
  updateTime: string

  backend: null
  backendId: null
  front: null
  frontId: null
  host: string
  phone: null
}

export interface IHAuthenticationInfoRes {
  id: number
  name: string
  identification: string
  status: 1 | 2 | 3 // 1-认证中 2-认证成功 3-认证失败
  userId: number
  createTime: string
  updateTime: string
  front: number
  back: number
  holding: number
  filepath: string
}

export interface IUpdataPswParam {
  password: string
  oldPassword?: string
  confirmPassword?: string
}
