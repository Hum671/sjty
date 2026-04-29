export interface TransferParams {
  type: 1 | 2 //1-资产到合约 2-合约到资产
  coinType: string
  number: number
}
