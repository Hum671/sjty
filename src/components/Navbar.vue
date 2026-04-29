<script setup lang="ts">
import { useDisconnect } from '@web3modal/ethers/vue'
import { showConfirmDialog } from 'vant'
import { useUserStore } from '@/stores/user'
import { delToken, getToken } from '@/utils/utils'
import useLangHook from '@/hooks/useLangHooks'

withDefaults(
  defineProps<{
    isShowLeftBtn?: boolean
    placeholder?: string
  }>(),
  {
    isShowLeftBtn: true,
    placeholder: '',
  },
)

const isLogin = ref(false)
const router = useRouter()
const route = useRoute()
const { onShowLangClick } = useLangHook()
const { disconnect } = useDisconnect()
const menuRef = ref()
const { t } = useI18n()
const appName = import.meta.env.VITE_APP_NAME
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const navbarRef = ref()

watch(
  route,
  () => {
    isLogin.value = Boolean(getToken())
    if (!userInfo.value) {
      userStore.requestUserInfo()
    }
  },
  {
    immediate: true,
  },
)

function handleUserClick() {
  router.push('/userInfo')
}

function handleSearchClick() {
  router.push('/trade-search')
}

function handleNoticeClick() {
  router.push('/news')
}

function handleLoginClick() {
  router.push('/login')
}

function handleLogoutClick() {
  showConfirmDialog({
    title: t('h5.user_info.logout_confirm_title'),
    message: t('h5.user_info.logout_confirm_content'),
    confirmButtonText: t('h5.common.confirm'),
    cancelButtonText: t('h5.common.cancel'),
  }).then(() => {
    isLogin.value = false
    delToken()
    disconnect()
    userInfo.value = null
  })
}
</script>

<template>
  <div class="nav-bar-box flex-box-sb" ref="navbarRef">
    <div class="flex-box-nm">
      <img v-if="isLogin" class="icon" src="~@/assets/images/user1.png" @click="handleUserClick" />
      <img v-else class="icon" src="~@/assets/images/logo.jpg" />
    </div>
    <div class="right flex-box-sb">
      <!-- <img class="icon" src="~@/assets/images/search.png" @click="handleSearchClick" />

			<img class="icon icon-pd" src="~@/assets/images/message.png" @click="handleNoticeClick" />

			<div class="red-dot"></div> -->

      <div v-if="!isLogin" class="login" @click="handleLoginClick">{{ $t('h5.login.login') }}</div>
      <van-dropdown-menu v-else ref="menuRef">
        <van-dropdown-item :title="`UID: ${userInfo?.id || '-'}`" ref="itemRef">
          <van-cell :title="$t('h5.common.account')" :center="true">
            {{ userInfo?.email || userInfo?.address || '-' }}
          </van-cell>
          <van-cell :title="$t('h5.userInfo.Credit_score')">
            {{ userInfo?.score || '-' }}
          </van-cell>
          <div class="l2-btn" @click="handleLogoutClick">
            {{ $t('h5.login.Logout') }}
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
      <img class="lang-icon" src="~@/assets/images/lang.png" @click="onShowLangClick" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.nav-bar-box {
  --van-dropdown-menu-title-text-color: var(--cb-fColor2);
  --van-dropdown-menu-title-active-text-color: var(--cb-fColor2);
  --van-gray-4: var(--cb-fColor2);
  position: sticky;
  top: 0;
  z-index: 99;
  height: 55px;
  background-color: #fff;
  padding: 0 15px;
  box-shadow: 0 -3px 5px #201f1f;
  .icon {
    text-align: center;
    height: 30px;
    font-size: 30px;
  }
  .l-img {
    margin-right: 6px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    overflow: hidden;
  }
  :deep(.van-cell__title) {
    width: 100px !important;
  }
  :deep(.van-cell__value) {
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    color: var(--cb-fColor2);
  }
  :deep(.van-dropdown-menu__bar) {
    box-shadow: none;
  }
  :deep(.van-popover__content) {
    box-shadow: 0 2px 12px rgba(50, 50, 51, 0.5);
  }
  .pop-content {
    width: 200px;
    box-sizing: border-box;
    font-size: 14px;
    .logout {
      background-color: #ff4d4d;
      color: #fff;
    }
    .text-over-ellip {
      width: 100px;
    }
    .pd {
      padding: 8px 15px;
    }
  }
  .l1-btn {
    background-color: #2ab69c;
  }
  .l2-btn {
    background-color: #ff4d4d;
  }
  .l1-btn,
  .l2-btn {
    color: #fff;
    text-align: center;
    font-size: 14px;
    height: 45px;
    line-height: 45px;
    width: 100%;
  }
  .login {
    font-size: 13px;
    color: var(--cb-fColor2);
    background-color: var(--cb-btnBgc2);
    padding: 8px 20px;
    border-radius: 5px;
  }
  .appname {
    font-size: 16px;
  }
  .lang-icon {
    margin-left: 14px;
    width: 23px;
  }
  .list {
    padding: 20px;
    text-align: center;
  }
  .right {
    position: relative;
    .icon-pd {
      margin-left: 15px;
    }
    .red-dot {
      position: absolute;
      background-color: #fa3534;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      right: -5px;
      top: -5px;
    }
    .userinfo {
      border: 1px solid #ccc;
      padding: 8px 12px;
      border-radius: 10px;
      .arrow {
        margin-left: 12px;
        // color: #ccc;
      }
    }
  }
}
:deep(.van-action-sheet__header) {
  --van-font-bold: 400;
}
</style>
