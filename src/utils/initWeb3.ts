import { etherProjectId } from '@/global'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers'

export function initEtherModel() {
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

  ;(window as any).etherModel = createWeb3Modal({
    ethersConfig,
    chains: [mainnet],
    projectId: etherProjectId,
    themeMode: 'light',
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
  })
}
