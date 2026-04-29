export interface ApplyParams {
  amount: number // 借贷金额U
  cycle: number // 借贷周期(天)
  rate: number // 借贷利息(%)
  phone: number // 手机号码
  address: string // 地址
  age: number // 年龄
  annualIncome: number // 年收入(USD)
  citizenship: string // 国籍
}

export interface LoanRecordItem {
  amount: number // 借贷金额U
  cycle: number // 借贷周期(天)
  rate: number // 借贷利息(%)
  phone: number // 手机号码
  address: string // 地址
  age: number // 年龄
  annualIncome: number // 年收入(USD)
  citizenship: string // 国籍
  status: 1 | 2 | 3 | 4 // 1-待审核 2-通过 3-拒绝 4-已还款
  repaymentStatus: 1 | 2 | 3 | 4 // 1-未还款 2-还款待审核 3-审核拒绝,重新提交 4-还款完成
}

export interface LoanCurrentPrice {
  eth: number
  btc: number
}

export interface LoanRecordRes {
  currentPrice: LoanCurrentPrice
  list: LoanRecordItem[]
}

export interface loanRepaymentApiParams {
  loanId: number
  currency: string
  address: string
  certificate: number
  needNumber: number
}

export interface getRepaymentRecordRes {
  address: string
  certificate: number
  certificatePath: { id: number; filepath: string; host: string }
  createTime: string
  currency: string
  id: number
  loanId: number
  loanNumber: string
  needNumber: string
  number: string
}
