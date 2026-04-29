export const etherProjectId = '8b29b90967f1c4911daeb230bae58a6e'

export const TronPrice = {
  WIN: 0.00115,
  USDT: 1,
  TONS: 1.35,
  USDJ: 1.04,
  JST: 0.125,
  HT: 20.41,
  SUN: 33.97,
  EXNX: 0.0621,
  VCOIN: 0.004225,
  POL: 0.1393,
  CKRW: 0.002487,
} as const
export type TronPriceType = keyof typeof TronPrice

export const TronDecimals = {
  WIN: 6,
  USDT: 6,
  TONS: 6,
  USDJ: 18,
  JST: 18,
  HT: 18,
  SUN: 18,
  EXNX: 18,
  VCOIN: 6,
  POL: 8,
  CKRW: 6,
} as const
export type TronDecimalsType = keyof typeof TronDecimals

export const EtherPrice = {
  USDT: 1,
  SUSHI: 15.5,
  USDC: 1,
  DAI: 1,
  UNI: 28.6,
  AAVE: 380,
  YFI: 35000,
  LINK: 28.2,
  LON: 7,
  CRV: 3.01367,
  GUSD: 1,
  WBTC: 56478.2,
  WETH: 1991.89,
  CONV: 0.105733,
  INJ: 13.3812,
  MKR: 2076.68,
  ALPHA: 1.79043,
  BAND: 16.3441,
  SNX: 20.0588,
  COMP: 468.076,
  SXP: 4.11818,
  FTT: 46.1779,
  UST: 1.00543,
  TRIBE: 1.42926,
  WISE: 0.446973,
  RRAX: 0.996821,
  CORE: 5447.59,
  MIR: 8.69817,
  DPI: 415.906,
  LUNA: 15.2402,
  HEZ: 5.97533,
  FXS: 8.47025,
  FEI: 0.898157,
} as const
export type EtherPriceType = keyof typeof EtherPrice

export const EtherDecimals = {
  SUSHI: 18,
  USDT: 6,
  USDC: 6,
  UNI: 18,
  DAI: 18,
  AAVE: 18,
  YFI: 18,
  LINK: 18,
  WBTC: 8,
} as const
export type EtherDecimalsType = keyof typeof EtherDecimals
