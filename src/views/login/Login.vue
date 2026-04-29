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
import DOMPurify from 'dompurify'
import { showToast, showDialog } from 'vant'
import { localCache } from '@/utils/cache'
import { registerLogin, walletLogin } from '@/api/login'
import { getFindNotify } from '@/api/user'
import { WalletLoginParams } from '@/api/login/model/loginModel'
import { useUserStore } from '@/stores/user'
import useLangHook from '@/hooks/useLangHooks'
import { SUCCESS_CODE } from '@/api/model/BaseModel'

const { t } = useI18n()
const useStore = useUserStore()
const { accoutInfo } = storeToRefs(useStore)
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
  themeMode: 'dark',
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
})

const model = useWeb3Modal()
const { address, isConnected } = useWeb3ModalAccount()
const { walletProvider } = useWeb3ModalProvider()
const { disconnect } = useDisconnect()
const { isShowLangList, lang } = useLangHook()
const accout = ref('')
const password = ref('')
const router = useRouter()
const isSavePsw = ref(true)
const isLogining = ref(false)
const isLogin = ref(false)
const savedTheme = localStorage.getItem('theme-mode') as 'dark' | 'light'

useParticlesBackground(canvasRef, {
  bgColor: savedTheme === 'dark' ? '#08080b' : '#f4f8ff',
  dotSize: 5,
  lineWidth: 1,
  dotColor: savedTheme === 'dark' ? '#7691e2' : '#5b8de3',
  lineColor: savedTheme === 'dark' ? 'rgba(234, 232, 250, 0.5)' : 'rgba(91, 141, 227, 0.4)',
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
    .then((token) => {
      localCache.setCache('loginModel', 'wallet')
      localCache.setCache('userToken', token)
      localCache.setCache('userloginModel', 'wallet')
      useStore.requestUserInfo()
      // 通知
      noticeFnc()
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
    .then((token) => {
      localCache.setCache('loginModel', 'email')
      localCache.setCache('userToken', token)
      localCache.setCache('userloginModel', 'wallet')
      useStore.requestUserInfo()
      // 通知
      noticeFnc()
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

function openModal() {
  isLogin.value = true
  model.open()
}

function noticeFnc() {
  getFindNotify().then((res) => {
    if (res.code === SUCCESS_CODE && res.data) {
      showDialog({
        title: t('h5.news.news_title'),
        message: DOMPurify.sanitize(res.data),
        allowHtml: true,
        className: 'user-notice-dialog',
        confirmButtonText: t('h5.common.confirm'),
      })
    }
  })
}
</script>

<template>
  <div class="login">
    <van-nav-bar :right-text="$t('h5.login.Register')" @click-right="handleRegister" />
    <canvas ref="canvasRef" class="canvasRef"></canvas>
    <div class="section">
      <div class="title">
        <!-- <div class="t1">{{ $t('h5.login.Welcome_notice') }}</div> -->
        <div></div>
        <!-- <HexStar class="logo" /> -->
        <img class="logo" src="~@/assets/images/logo.jpg" />
      </div>
      <div class="content">
        <div class="c-top flex-box-sb">
          <div class="t-title">{{ $t('h5.login.Account_login') }}</div>
          <div class="t-lang" @click="isShowLangList = true">
            {{ lang }}
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
  </div>
</template>

<style lang="less" scoped>
.login {
  @bgColor1: #eae8fa;
  @fontColor1: #7691e2;
  --van-nav-bar-background: var(--cb-bgc4);
  --van-nav-bar-arrow-size: 20px;
  --van-nav-bar-height: 55px;
  --van-font-size-md: 16px;
  --van-nav-bar-text-color: var(--cb-fColor2);
  --van-nav-bar-icon-color: var(--cb-fColor2);
  --van-border-width: 0;
  // --van-nav-bar-background: @bgColor1;
  color: @fontColor1;
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;
  position: relative;
  :deep(.van-nav-bar) {
    position: absolute;
    top: 0;
    width: 100%;
    box-shadow: 0 -2px 5px #7691e2;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    color: var(--cb-fColor);
    .t1 {
      font-size: 24px;
      font-weight: 600;
    }
    .logo {
      width: 32px;
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
    backdrop-filter: blur(3px);
    border-radius: 12px;
    border: 1px solid var(--cb-login-content-border-color);
    background-color: var(--cb-login-content-bgc);
    box-shadow: 0 8px 20px var(--cb-login-content-shadow);

    .c-top {
      margin-bottom: 40px;
      .t-title {
        font-size: 18px;
        font-weight: 700;
        color: var(--cb-fColor5);
      }
      .t-lang {
        color: @fontColor1;
        text-decoration: underline;
        text-align: right;
      }
    }
    .form {
      input {
        margin-top: 20px;
        display: block;
        width: 100%;
        height: 42px;
        border-bottom: 1px solid #858fb8;
        border-radius: 0;
        background: transparent;
        outline: none;
        transition: border-color 0.3s;
        color: var(--cb-fColor);
        font-size: 14px;
        &::placeholder {
          color: var(--cb-fColor);
        }
        &:focus {
          border-color: #7691e2;
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
          color: transparent;
          border-radius: 3px;
          width: 11px;
          height: 11px;
          border: 1px solid @fontColor1;
        }
        .label {
          margin-left: 6px;
          color: var(--cb-fColor);
          font-weight: 500;
          font-size: 12px;
          font-weight: 400;
        }
        .active {
          background: linear-gradient(135deg, var(--cb-btnBgc), #7691e2);
          color: #fff;
        }
      }

      .f-psw {
        color: var(--cb-fColor2);
        text-decoration: underline;
        font-size: 14px;
        text-align: right;
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
      span {
        color: var(--cb-fColor);
      }
    }
    .btn {
      background: var(--cb-login-content-btn-bgc1);
      color: #fff;
      padding: 10px 40px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      width: 100%;
      transition: 0.3s;
      border: none;
    }
    .wallet-btn {
      width: 100%;
      background: var(--cb-login-content-btn-bgc2);
      color: #fff;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      border: none;
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
