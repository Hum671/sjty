import BTCIcon from '@/assets/coinLogo/BTC.png'
import ETHIcon from '@/assets/coinLogo/ETH.png'
import USDTIcon from '@/assets/coinLogo/USDT.png'
import USDCIcon from '@/assets/coinLogo/USDC.png'
import DOGEIcon from '@/assets/coinLogo/DOGE.png'
import XAUTIcon from '@/assets/coinLogo/XAUT.png'
import SOLIcon from '@/assets/coinLogo/SOL.png'
import LTCIcon from '@/assets/coinLogo/LTC.png'
import XRPIcon from '@/assets/coinLogo/XRP.png'

export default function useCurrencyHook() {
  // 资产币种列表
  const assetCurrencyList = [
    {
      icon: USDTIcon,
      key: 'USDT-TRC',
      iconKey: 'USDT-TRC',
      type: '',
    },
    {
      icon: USDTIcon,
      key: 'USDT-ERC',
      iconKey: 'USDT-ERC',
      type: '',
    },
    {
      icon: ETHIcon,
      key: 'ETH',
      iconKey: 'ETH',
      type: '',
    },
    {
      icon: USDCIcon,
      key: 'USDC-ERC',
      iconKey: 'USDC',
      type: '',
    },
    {
      icon: BTCIcon,
      key: 'BTC',
      iconKey: 'BTC',
      type: '',
    },
    {
      icon: DOGEIcon,
      key: 'DOGE',
      iconKey: 'DOGE',
      type: '',
    },
    {
      icon: SOLIcon,
      key: 'SOL',
      iconKey: 'SOL',
      type: '',
    },
    {
      icon: XRPIcon,
      key: 'XRP',
      iconKey: 'XRP',
      type: '',
    },
    {
      icon: LTCIcon,
      key: 'LTC',
      iconKey: 'LTC',
      type: '',
    },
    {
      icon: USDCIcon,
      key: 'USDC-BASE',
      iconKey: 'USDC',
      type: '',
    },
  ]

  const iconMapType = {
    usdt: USDTIcon,
    eth: ETHIcon,
    btc: BTCIcon,
    usdc: USDCIcon,
    doge: DOGEIcon,
    xaut: XAUTIcon,
  }

  return {
    assetCurrencyList,
    iconMapType,
  }
}
