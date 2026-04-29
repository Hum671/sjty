<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getRegisterCode, forgetPassword } from '@/api/login'
import { showToast } from 'vant'
import router from '@/router'

const { t } = useI18n()
const route = useRoute()
const isShowP1 = ref(false)
const isShowP2 = ref(false)
const email = ref('')
const emailVCode = ref('')
const newPassword = ref('')
const checkPassword = ref('')
const isUploading = ref(false)
const isCountFinish = ref(true)
const time = ref(120)
let timer = 0

watch(isCountFinish, (value) => {
  if (value) {
    return
  }
  clearInterval(timer)
  timer = window.setInterval(() => {
    time.value = time.value - 1
    if (time.value === 0) {
      isCountFinish.value = true
      time.value = 120
      clearInterval(timer)
    }
  }, 1000)
})

// 获取验证码
function handleGetVCodeClick() {
  if (!isCountFinish.value) {
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showToast(t('emailservice.api_emailname_error'))
    return
  }

  if (email.value.length) {
    time.value = 120
    isCountFinish.value = false
    getRegisterCode(email.value).then((res) => {
      if (res.code === SUCCESS_CODE) {
        emailVCode.value = res.data.code
      }
    })
  } else {
    showToast(t('h5.password.pls_enter_Email'))
  }
}

function handleConfirmClick() {
  // 参数校验
  if (checkParams()) {
    isUploading.value = true
    forgetPassword({
      password: newPassword.value,
      code: emailVCode.value,
      email: email.value,
    })
      .then((res) => {
        if (res.code !== SUCCESS_CODE) {
          showToast(t(res.msg))
        } else {
          showToast(t('h5.password.update_success'))
          router.back()
        }
      })
      .finally(() => {
        isUploading.value = false
      })
  }
}

function checkParams() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showToast(t('emailservice.api_emailname_error'))
    return
  }

  if (newPassword.value.length < 6) {
    showToast(t('h5.password.psw_leng_notice', { pswLength: 6 }))
    return
  }

  if (newPassword.value !== checkPassword.value) {
    showToast(t('h5.password.Passwords_not_match'))
    return
  }

  if (!emailVCode.value.length) {
    showToast(t('h5.password.Please_enter_the_email_verification_code_1'))
    return
  }

  return true
}
</script>

<template>
  <div class="password-box">
    <Navbar2 :title="route.query.title" :is-show-right="false" class="navbar" back-path="/login" />

    <div class="content">
      <div class="item">
        <div class="label">{{ $t('h5.password.Email') }}</div>
        <div class="inp">
          <input v-model="email" :placeholder="$t('h5.password.pls_enter_Email')" />
        </div>
      </div>

      <div class="item">
        <div class="label">{{ $t('h5.password.Email_verification_code') }}</div>
        <div class="inp">
          <input
            v-model="emailVCode"
            :placeholder="$t('h5.password.Please_enter_the_email_verification_code')"
          />
          <div @click="handleGetVCodeClick">
            {{ isCountFinish ? $t('h5.password.Get_verification_code') : time }}
          </div>
        </div>
      </div>

      <div class="item">
        <div class="label">{{ $t('h5.password.New_login_password') }}</div>
        <div class="inp">
          <input
            v-model="newPassword"
            :type="isShowP1 ? 'text' : 'password'"
            :placeholder="$t('h5.password.Please_enter_the_new_login_password')"
          />
          <div
            @click="isShowP1 = !isShowP1"
            class="iconfont font-size-40 eye text-919f"
            :class="isShowP1 ? 'icon-yanjing_yincang' : 'icon-yanjing_xianshi'"
          ></div>
        </div>
      </div>

      <div class="item">
        <div class="label">{{ $t('h5.password.Confirm_new_password') }}</div>
        <div class="inp">
          <input
            v-model="checkPassword"
            :type="isShowP2 ? 'text' : 'password'"
            :placeholder="$t('h5.password.Please_enter_the_confirmation_of_the_new_password')"
          />
          <div
            @click="isShowP2 = !isShowP2"
            class="iconfont font-size-40 eye text-919f"
            :class="isShowP2 ? 'icon-yanjing_yincang' : 'icon-yanjing_xianshi'"
          ></div>
        </div>
      </div>

      <van-button
        :loading="isUploading"
        class="btn-submit"
        size="large"
        @click="handleConfirmClick"
      >
        {{ $t('h5.password.Confirm') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.password-box {
  --van-cell-font-size: 14px;
  .content {
    padding: 30px 16px 20px;
    color: var(--cb-fColor);
    .item {
      margin-bottom: 20px;
      .inp {
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: var(--cb-bgc);
        padding: 10px 15px;
        border-radius: 3px;
        height: 28px;
        border: 1px solid var(--cb-borderColor2);
        input {
          flex: 1;
          color: var(--cb-fColor);
        }
        .iconfont {
          color: #888;
          font-size: 20px;
        }
      }
    }
  }
  .btn-submit {
    margin: 50px 0;
    border: none;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 22px;
    background-color: var(--cb-btnBgc);
    color: #fff;
  }
}
</style>
