<script setup lang="ts">
import { showToast, showDialog } from 'vant'
import { localCache } from '@/utils/cache'
import { getFindNotify } from '@/api/user'
import { registerLogin, getRegisterCode } from '@/api/login'
import { RegisterLoginParams } from '@/api/login/model/loginModel'
import { useParticlesBackground } from '@/hooks/useStartHook'
import useLangHook from '@/hooks/useLangHooks'
import DOMPurify from 'dompurify'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { useUserStore } from '@/stores/user'

const email = ref('')
const verificationCode = ref('')
const password = ref('')
const checkPassword = ref('')
const canvasRef = ref('')
const router = useRouter()
const { isShowLangList, lang } = useLangHook()
const useStore = useUserStore()
const { t } = useI18n()
const isSavePsw = ref(true)
const isLogining = ref(false)
const isCountFinish = ref(true)
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

function toLogin() {
  router.replace('/login')
}

function handleRegisterClick() {
  if (!checkParams()) {
    return
  }

  isLogining.value = true
  const data: RegisterLoginParams = {
    email: email.value,
    password: password.value,
    code: verificationCode.value,
  }

  const pid = localCache.get('pid')
  const aid = localCache.get('aid')
  if (pid && pid !== 'undefined') {
    data.pid = JSON.parse(pid)
  }

  if (aid && aid !== 'undefined') {
    data.pid = JSON.parse(aid)
  }

  registerLogin(data)
    .then((token) => {
      localCache.setCache('loginModel', 'email')
      localCache.setCache('userToken', token)
      useStore.requestUserInfo()
      noticeFnc()
      router.replace('/')
    })
    .catch((msg) => {
      showToast(t(msg))
    })
    .finally(() => {
      isLogining.value = false
    })
}

function checkParams() {
  // 1、邮箱
  if (!email.value.length) {
    showToast(t('h5.password.pls_enter_Email'))
    return false
  }

  // 2、密码
  if (password.value.length < 6) {
    showToast(t('h5.password.psw_leng_notice', { psw_length: 6 }))
    return false
  }

  // 3、新旧密码是否相同
  if (password.value !== checkPassword.value) {
    showToast(t('h5.password.Passwords_not_match'))
    return false
  }

  // 4、验证码
  if (verificationCode.value.length === 0) {
    showToast(t('h5.password.Please_enter_the_email_verification_code'))
    return false
  }

  // 隐私政策
  if (!isSavePsw.value) {
    showToast(t('h5.register.save_pws'))
    return false
  }

  // 5、校验通过
  return true
}

function handlePPClick() {
  router.push({
    path: '/article',
    query: {
      id: 44,
      name: 'yinsizhengce',
    },
  })
}

function handelSendCode() {
  if (!email.value.length) {
    showToast(t('h5.password.pls_enter_Email'))
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showToast(t('emailservice.api_emailname_error'))
    return
  }

  isCountFinish.value = false
  getRegisterCode(email.value)
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
    <van-nav-bar :right-text="$t('h5.login.login')" @click-right="toLogin" />

    <canvas ref="canvasRef"></canvas>
    <div class="section">
      <div class="title">
        <div></div>
        <!-- <div class="t1">{{ $t('h5.login.Welcome_notice') }}</div> -->
        <!-- <HexStar class="logo" /> -->
        <img class="logo" src="~@/assets/images/logo.jpg" />
      </div>
      <div class="content">
        <div class="c-top flex-box-sb">
          <div class="tab">
            <div class="t-title">{{ $t('h5.passwor.account_registry') }}</div>
          </div>
          <div class="t-lang" @click="isShowLangList = true">
            {{ lang }}
          </div>
        </div>
        <div class="form">
          <input v-model="email" type="text" :placeholder="$t('h5.password.Email')" />
          <div class="email-box">
            <input
              v-model="verificationCode"
              type="text"
              :placeholder="$t('h5.password.Email_verification_code')"
            />
            <div class="email-btn">
              <div class="time-b" v-if="!isCountFinish">
                <van-count-down
                  class="count-time"
                  :time="120000"
                  format="sss"
                  @finish="isCountFinish = true"
                />
              </div>
              <div v-else class="send-code" @click="handelSendCode">
                {{ $t('h5.password.send_verification_code') }}
              </div>
            </div>
          </div>
          <input v-model="password" type="password" :placeholder="$t('h5.login.psw')" />
          <input v-model="checkPassword" type="password" :placeholder="$t('h5.passwor.confirm')" />
        </div>

        <div class="tool">
          <div class="flex-b">
            <div
              class="u-icon__icon uicon-checkbox-mark u-iconfont t-color"
              :class="isSavePsw && 'active'"
              @click="isSavePsw = !isSavePsw"
            ></div>
            <div class="label" @click="isSavePsw = !isSavePsw">
              {{ $t('h5.passwor.read_agree') }}
            </div>
            <span class="l2" @click="handlePPClick">{{ $t('h5.passwor.Privacy_Policy') }}</span>
          </div>
        </div>
        <van-button :loading="isLogining" class="btn" @click="handleRegisterClick">
          {{ $t('h5.login.Register') }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@bgColor1: #eae8fa;
.login {
  --van-nav-bar-background: var(--cb-bgc4);
  --van-nav-bar-arrow-size: 20px;
  --van-nav-bar-height: 55px;
  --van-font-size-md: 16px;
  --van-nav-bar-text-color: var(--cb-fColor2);
  --van-nav-bar-icon-color: var(--cb-fColor2);
  --van-border-width: 0;
  // --van-nav-bar-background: @bgColor1;
  color: #08080b;
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;
  color: var(--cb-fColor2);
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
      // width: 60px;
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
        color: var(--cb-fColor);
      }
      .t-lang {
        color: var(--cb-fColor2);
        text-decoration: underline;
        text-align: right;
      }
    }
    .form {
      .email-box {
        position: relative;
        width: 100%;
        .email-btn {
          position: absolute;
          right: 0;
          bottom: 0;
          text-align: right;
          .send-code {
            color: var(--cb-fColor2);
            height: 42px;
            line-height: 42px;
            max-width: 100px;
            text-align: right;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .time-b {
            display: flex;
            align-items: center;
            height: 42px;
            line-height: 42px;
            .count-time {
              padding: 2px 10px;
              border-radius: 10px;
              color: var(--cb-fColor2);
            }
          }
        }
      }
      input {
        margin-top: 14px;
        display: block;
        width: 100%;
        height: 42px;
        border-bottom: 1px solid #858fb8;
        background: transparent;
        outline: none;
        transition: border-color 0.3s;
        color: var(--cb-fColor);
        font-size: 14px;
        border-radius: 0;
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
      margin-top: 20px;
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
          border: 1px solid var(--cb-fColor2);
        }
        .label {
          margin: 0 3px;
          color: var(--cb-fColor);
          font-size: 12px;
          font-weight: 400;
        }
        .l2 {
          font-size: 12px;
          color: var(--cb-fColor2);
          text-decoration: underline;
          text-align: right;
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
      }
    }

    .btn {
      margin-top: 40px;
      background: var(--cb-login-content-btn-bgc1);
      color: #fff;
      padding: 10px 40px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      width: 100%;
      transition: 0.3s;
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
