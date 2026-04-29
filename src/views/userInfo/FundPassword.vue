<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import { saveMoneyPassword } from '@/api/userInfo'

import type { IUpdataPswParam } from '@/api/userInfo/model/userInfoModel'
import router from '@/router'

const userStore = useUserStore()
const { t } = useI18n()

const { userInfo } = storeToRefs(userStore)
const showPassword = ref(false)
const showOldPassword = ref(false)
const showConfirmPassword = ref(false)
const data = reactive<IUpdataPswParam>({
  password: '',
  confirmPassword: '',
  oldPassword: '',
})
const loading = ref(false)

onMounted(() => {
  userStore.requestUserInfo()
})

function submitVerify() {
  if (userInfo.value?.moneyPassword && !data.oldPassword) {
    showToast(t('h5.password.fund_old_password_placeholder'))
    return false
  }

  if (!data.password) {
    showToast(t('h5.password.fund_new_password_placeholder'))
    return false
  }

  if (data.password.length < 6) {
    showToast(t('h5.password.psw_leng_notice', { pswLength: 6 }))
    return false
  }

  if (data.password !== data.confirmPassword) {
    showToast(t('h5.password.Passwords_not_match'))
    return false
  }

  return true
}

function handleConfirmClick() {
  if (!submitVerify()) {
    return
  }

  loading.value = true

  const submitData: IUpdataPswParam = {
    password: data.password,
  }

  if (userInfo.value?.moneyPassword) {
    submitData.oldPassword = data.oldPassword
  }

  saveMoneyPassword(submitData)
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        let successText = 'h5.password.set_success'
        if (userInfo.value?.moneyPassword) {
          successText = 'h5.password.update_success'
        }
        showToast(t(successText))
        router.back()
      } else {
        showToast(t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="password-box">
    <Navbar2
      :title="
        userInfo?.moneyPassword
          ? $t('h5.security.change_fund_password')
          : $t('h5.security.set_fund_password')
      "
      back-path="/security"
      :is-show-right="false"
      class="navbar"
    />

    <div class="content">
      <div v-if="userInfo?.moneyPassword" class="item">
        <div class="label">{{ $t('h5.password.fund_old_password') }}</div>
        <div class="inp">
          <input
            v-model="data.oldPassword"
            :type="showOldPassword ? 'text' : 'password'"
            :placeholder="$t('h5.password.fund_old_password_placeholder')"
          />
          <div
            @click="showOldPassword = !showOldPassword"
            class="iconfont font-size-40 eye text-919f"
            :class="showOldPassword ? 'icon-yanjing_yincang' : 'icon-yanjing_xianshi'"
          ></div>
        </div>
      </div>

      <div class="item">
        <div class="label">{{ $t('h5.password.fund_new_password') }}</div>
        <div class="inp">
          <input
            v-model="data.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('h5.password.fund_new_password_placeholder')"
          />
          <div
            @click="showPassword = !showPassword"
            class="iconfont font-size-40 eye text-919f"
            :class="showPassword ? 'icon-yanjing_yincang' : 'icon-yanjing_xianshi'"
          ></div>
        </div>
      </div>

      <div class="item">
        <div class="label">{{ $t('h5.password.Confirm_new_password') }}</div>
        <div class="inp">
          <input
            v-model="data.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('h5.password.Please_enter_the_confirmation_of_the_new_password')"
          />
          <div
            @click="showConfirmPassword = !showConfirmPassword"
            class="iconfont font-size-40 eye text-919f"
            :class="showConfirmPassword ? 'icon-yanjing_yincang' : 'icon-yanjing_xianshi'"
          ></div>
        </div>
      </div>

      <van-button :loading="loading" class="btn-submit" size="large" @click="handleConfirmClick">
        {{ $t('h5.password.Confirm') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.password-box {
  --van-cell-font-size: 14px;
  position: relative;
  height: 100%;
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
    position: absolute;
    left: 50%;
    bottom: 60px;
    transform: translateX(-50%);
    width: calc(100% - 32px);
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
