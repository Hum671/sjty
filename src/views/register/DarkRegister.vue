<script setup lang="ts" name="keepAliveLogin">
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalProvider,
  useDisconnect,
} from '@web3modal/ethers/vue'
import { useWeb3ModalAccount } from '@web3modal/ethers/vue'
import { BrowserProvider } from 'ethers'
import { useParticlesBackground } from '@/hooks/useStartHook'

import { showToast } from 'vant'
import { localCache } from '@/utils/cache'
import { registerLogin, walletLogin } from '@/api/login'
import { WalletLoginParams } from '@/api/login/model/loginModel'
import { useUserStore } from '@/stores/user'

const { t, locale } = useI18n()
const useStore = useUserStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const projectId = (window as any).projectId
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
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  themeMode: 'light',
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
})

const model = useWeb3Modal()
const { address, isConnected } = useWeb3ModalAccount()
const { walletProvider } = useWeb3ModalProvider()
const { disconnect } = useDisconnect()

const accout = ref('')
const password = ref('')
const router = useRouter()
const langOptions = localCache.getCache('langOptions')
const langName = ref(getLangName())
const isShowLangList = ref(false)
const isSavePsw = ref(true)
const isLogining = ref(false)
const isLogin = ref(false)

useParticlesBackground(canvasRef, {
  bgColor: '#0F1A2B',
  lineColor: 'rgba(160, 127, 255, 0.6)',
  dotColor: '#A07FFF',
  particleCount: 35,
  maxDistance: 150,
})

watchEffect(() => {
  if (!address.value || !isConnected.value || !isLogin.value) {
    return
  }
  isLogin.value = false
  handleWeb3Signer()
})

onActivated(() => {
  accout.value = localCache.getCache('accout')
  password.value = localCache.getCache('psw')
})

async function handleWeb3Signer() {
  const provider = new BrowserProvider(walletProvider.value)
  const signer = await provider.getSigner()
  signer
    ?.signMessage('Login')
    .then((signature) => {
      handleWalletLogin(signature)
    })
    .catch(() => {
      disconnect()
    })
}

// 处理钱包登录
function handleWalletLogin(signature) {
  const data: WalletLoginParams = {
    signature,
    address: address.value,
    aid: 0,
    pid: 0,
  }

  const pid = localCache.get('pid')
  const aid = localCache.get('aid')
  if (pid && pid !== 'undefined') {
    data.pid = JSON.parse(pid)
  }

  if (aid && aid !== 'undefined') {
    data.pid = JSON.parse(aid)
  }

  model.close()
  disconnect()
  walletLogin(data)
    .then(() => {
      localCache.setCache('loginModel', 'wallet')
      useStore.requestUserInfo()
      router.replace('/')
    })
    .catch((msg) => {
      showToast(t(msg))
      disconnect()
    })
    .finally(() => {
      isLogining.value = false
    })
}

function handleLangItemClick(item: any) {
  locale.value = item.lang
  isShowLangList.value = false
  langName.value = item.name
  localCache.setCache('i18nLocale', locale.value)
}

function handleRegister() {
  router.replace('/register')
}

function handleForgetClick(title: any) {
  router.push({
    path: '/password',
    query: {
      title,
    },
  })
}

function handleLoginClick() {
  if (!checkParams()) {
    return
  }

  isLogining.value = true
  registerLogin({
    email: accout.value,
    password: password.value,
    isLogin: true,
  })
    .then(() => {
      localCache.setCache('loginModel', 'email')
      useStore.requestUserInfo()
      router.replace('/')
    })
    .catch((msg) => {
      showToast(t(msg))
    })
    .finally(() => {
      isLogining.value = false
    })

  if (isSavePsw.value) {
    localCache.setCache('accout', accout.value)
    localCache.setCache('psw', password.value)
  } else {
    localCache.deleteCache(['psw', 'accout'])
  }
}

function checkParams() {
  // 1、账号
  if (!accout.value.length) {
    showToast(t('h5.login.pls_enter_accout'))
    return
  }

  // 2、密码
  if (password.value.length < 6) {
    showToast(t('h5.password.psw_leng_notice', { psw_length: 6 }))
    return
  }

  // 4、校验通过
  return true
}

function getLangName() {
  const langCode = localCache.getCache('i18nLocale')
  const langOptions = localCache.getCache('langOptions')
  const findItem = langOptions.find((item) => item.lang === langCode)

  return findItem?.name ?? ''
}

function openModal() {
  isLogin.value = true
  model.open()
}
</script>

<template>
  <div class="login">
    <van-nav-bar
      :right-text="$t('h5.login.Register')"
      :left-text="$t('h5.common.back')"
      left-arrow
      @click-left="router.go(-1)"
      @click-right="handleRegister"
    />
    <canvas ref="canvasRef"></canvas>
    <div class="section">
      <div class="title">
        <div class="t1">{{ $t('h5.login.Welcome_notice') }}</div>
        <!-- <HexStar class="logo" /> -->
        <img class="logo" src="~@/assets/images/logo.jpg" />
      </div>
      <div class="content">
        <div class="c-top flex-box-sb">
          <div class="t-title">{{ $t('h5.login.Account_login') }}</div>
          <div class="t-lang" @click="isShowLangList = true">
            {{ langName }}
          </div>
        </div>
        <div class="form">
          <input v-model="accout" type="text" :placeholder="$t('h5.login.email_or_phone')" />
          <input v-model="password" type="password" :placeholder="$t('h5.login.psw')" />
        </div>
        <div class="tool">
          <div class="flex-b" @click="isSavePsw = !isSavePsw">
            <div
              class="u-icon__icon uicon-checkbox-mark u-iconfont t-color"
              :class="isSavePsw && 'active'"
            ></div>
            <div class="label">{{ $t('h5.login.Remember_psw') }}</div>
          </div>
          <div class="f-psw" @click="handleForgetClick($t('h5.login.Forgot_psw'))">
            {{ $t('h5.login.Forgot_psw') }}？
          </div>
        </div>

        <div class="btn-group">
          <van-button :loading="isLogining" class="btn" @click="handleLoginClick">
            {{ $t('h5.login.email_login') }}
          </van-button>
          <span>{{ $t('h5.login.or') }}</span>
          <van-button type="default" class="wallet-btn" @click="openModal">
            {{ $t('h5.login.wallet_login') }}
          </van-button>
        </div>
      </div>
    </div>
    <van-action-sheet
      v-model:show="isShowLangList"
      :title="$t('h5.setting.pls_select_lang')"
      :closeable="false"
    >
      <van-radio-group v-model="$i18n.locale" name="code" checked-color="red">
        <van-cell-group inset>
          <van-cell
            v-for="item of langOptions"
            :key="item.name"
            :title="item.name"
            clickable
            :style="{
              backgroundColor: $i18n.locale === item.lang ? '#f2f6ff' : '',
            }"
            @click="handleLangItemClick(item)"
          >
            <template #right-icon>
              <van-icon
                v-if="$i18n.locale === item.lang"
                name="success"
                size="24"
                color="#2267f8"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-action-sheet>
  </div>
</template>

<style lang="less" scoped>
.login {
  --van-nav-bar-arrow-size: 20px;
  --van-nav-bar-height: 55px;
  --van-font-size-md: 16px;
  --van-nav-bar-text-color: var(--cb-fColor2);
  --van-nav-bar-icon-color: var(--cb-fColor2);
  --van-border-width: 0;
  --van-nav-bar-background: #0f1a2b;
  color: #e0cfff;
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100);
  overflow: scroll;
  :deep(.van-nav-bar) {
    position: absolute;
    top: 0;
    width: 100%;
    box-shadow: 0 -2px 5px #b392ff;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .t1 {
      font-size: 24px;
      font-weight: 600;
    }
    .logo {
      width: 35px;
      // height: 60px;
      // animation: start_1 6s linear infinite;
    }
  }
  .section {
    position: absolute;
    top: 53%;
    left: 50%;
    width: calc(100vw - 42px);
    transform: translate(-50%, -50%);
  }
  .content {
    height: 420px;
    padding: 25px;
    background: linear-gradient(90deg, rgba(30, 45, 70, 0.3), rgba(28, 38, 60, 0.3));
    backdrop-filter: blur(8px);
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);

    .c-top {
      margin-bottom: 40px;
      .t-title {
        font-size: 18px;
        font-weight: 700;
        color: #e0cfff;
      }
      .t-lang {
        color: #bfa3ff;
        text-decoration: underline;
      }
    }
    .form {
      input {
        margin-top: 20px;
        display: block;
        width: 100%;
        height: 42px;
        border-bottom: 1px solid #bfa3ff;
        background: transparent;
        outline: none;
        transition: border-color 0.3s;
        color: #bfa3ff;
        font-size: 14px;
        &::placeholder {
          color: rgba(191, 163, 255, 0.4);
        }
        &:focus {
          border-bottom-color: #ffccff;
          transform: scaleY(1.05);
          font-size: 15px;
        }
      }
    }
    .tool {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      .flex-b {
        display: flex;
        align-items: baseline;
        .t-color {
          font-size: 11px;
          color: #fff;
          border-radius: 3px;
          width: 11px;
          height: 11px;
          border: 1px solid #a0a0a0;
        }
        .label {
          margin-left: 6px;
          color: #bfa3ff;
          opacity: 0.9;
          font-weight: 500;
          font-size: 12px;
          font-weight: 400;
        }
        .active {
          background: linear-gradient(135deg, var(--cb-btnBgc), #d28eff);
        }
      }

      .f-psw {
        color: #bfa3ff;
        text-decoration: underline;
        font-size: 14px;
      }
    }

    .btn-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: calc(100% - 50px);
      gap: 10px;
      bottom: 35px;
    }
    .btn {
      background: linear-gradient(135deg, var(--cb-btnBgc), #d28eff);
      color: #fff;
      padding: 10px 40px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      width: 100%;
      transition: 0.3s;
    }
    .wallet-btn {
      width: 100%;
      background: transparent;
      border: 1px solid #bfa3ff;
      color: #bfa3ff;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
    }
  }
  @keyframes start_1 {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
