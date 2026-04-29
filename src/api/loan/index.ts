import lxRequest from '..'
import {
  ApplyParams,
  LoanRecordRes,
  loanRepaymentApiParams,
  getRepaymentRecordRes,
} from './model/loanModel'

enum Api {
  GetLoanConfig = '/api/loan/config',
  LoanApplyApi = '/api/loan/apply',
  GetLoanRecords = '/api/loan/records',
  LoanrepaymentApi = '/api/loan/repayment',
  GetRepaymentRecord = '/api/loan/repaymentRecord',
}

// 获取贷款配置
export function getLoanConfig() {
  return lxRequest({
    url: Api.GetLoanConfig,
    method: 'GET',
  })
}

// 申请贷款
export function loanApplyApi(data: ApplyParams) {
  return lxRequest<ApplyParams, any>({
    url: Api.LoanApplyApi,
    data,
    method: 'POST',
  })
}

// 贷款记录
export function getLoanRecords() {
  return lxRequest<null, LoanRecordRes>({
    url: Api.GetLoanRecords,
    method: 'GET',
  })
}

// 还款
export function loanrePaymentApi(data: loanRepaymentApiParams) {
  return lxRequest<loanRepaymentApiParams, any>({
    url: Api.LoanrepaymentApi,
    data,
    method: 'POST',
  })
}

// 还款记录
export function getRepaymentRecord(id: number) {
  return lxRequest<null, getRepaymentRecordRes>({
    url: `${Api.GetRepaymentRecord}?loanId=${id}`,
    method: 'GET',
  })
}
