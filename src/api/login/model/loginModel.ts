export interface RegisterLoginParams {
  email: string
  password: string
  code?: string
  aid?: number
  pid?: number
  isLogin?: boolean
}

export interface WalletLoginParams {
  address: string
  signature: string
  aid: number
  pid: number
}

export interface ForgetPasswordParams {
  email: string
  password: string
  code: string
}
