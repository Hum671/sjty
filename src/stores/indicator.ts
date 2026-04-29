import { defineStore } from 'pinia'

export type IIndicatorItem =
  | 'MA'
  | 'EMA'
  | 'BOLL'
  | 'SAR'
  | 'VOL'
  | 'MACD'
  | 'KDJ'
  | 'RSI'
  | 'WR'
  | 'CCI'
  | 'OBV'
  | 'DMA'
  | 'TRIX'
  | 'BRAR'
  | 'VR'
  | 'EMV'
  | 'DMI'
  | 'PSY'

export const useIndicatorStore = defineStore('indicator', () => {
  const checked = ref([])
  const indicatorList: IIndicatorItem[] = [
    // 'MA',
    // 'MACD',
    'EMA',
    'BOLL',
    'VOL',
    'KDJ',
    'RSI',
    'SAR',
    // 'WR',
    // 'CCI',
    // 'OBV',
    // 'DMA',
    // 'TRIX',
    // 'BRAR',
    // 'VR',
    // 'EMV',
    // 'DMI',
    // 'PSY',
  ]

  return {
    indicatorList,
    checked,
  }
})
