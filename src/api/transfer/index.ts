import lxRequest from '..'
import type { TransferParams } from './model'

enum Api {
  Transfer = '/api/transfer/index',
}

export function transfer(data: TransferParams) {
  return lxRequest<TransferParams, string>({
    url: Api.Transfer,
    method: 'POST',
    data,
  })
}
