<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import useLangHook from '@/hooks/useLangHooks'
import FulyIcom from './svgCpn/FulyIcom.vue'
import GongGao from './svgCpn/GongGao.vue'
import KeFu from './svgCpn/KeFu.vue'
import { checkDeviceType, getToken } from '@/utils/utils'
import { useConfigStore } from '@/stores/config'
import { useThemeHook } from '@/hooks/useThemeHook'

const props = withDefaults(
  defineProps<{
    isShowLeftBtn?: boolean
    placeholder?: string
    type?: 1 | 2
    title?: string
  }>(),
  {
    isShowLeftBtn: true,
    placeholder: '',
    type: 1,
  },
)

const isShowUserInfo = ref(false)
const isLogin = ref(false)
const route = useRoute()
const router = useRouter()
const { theme, toggleTheme } = useThemeHook()
const { onShowLangClick, lang } = useLangHook()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const configStore = useConfigStore()
const { globalSettingInfo } = storeToRefs(configStore)
const appName = import.meta.env.VITE_APP_NAME

watchEffect(() => {
  const routeUpdateList = ['Home', 'MarketsView']
  if (routeUpdateList.includes(route.name)) {
    isLogin.value = getToken()
  }
})

function handlePerksClick() {
  router.push('/perks')
}

function handleNoticeClick() {
  // router.push('/news')
  let url = globalSettingInfo.value?.onlineCustomer
  if (userInfo.value) {
    url += `&metadata={"name":"${userInfo.value.id}"}`
  }
  const openType = checkDeviceType() ? '_self' : '_blank'
  window.open(url, openType)
}

function handleLoginClick() {
  router.push('/login')
}

function handleServiceClick() {
  const openType = checkDeviceType() ? '_self' : '_blank'
  window.open('https://t.me/Agora_VIP', openType)
}
</script>

<template>
  <div class="nav-bar-box flex-box-sb theme-bgc">
    <template v-if="type === 1">
      <van-icon class="wap-nav" name="wap-nav" @click="isShowUserInfo = true" />
      <div class="right flex-box-sb">
        <template v-if="!isLogin">
          <div class="login btn1 sm-font" @click="handleLoginClick">
            {{ $t('h5.login.login') }}
          </div>
          <div class="lang btn2 sm-font" @click="onShowLangClick">{{ lang }}</div>
        </template>
        <!-- <div class="flex-box-nm">
            <img class="logo" src="@/assets/images/logo.jpg" alt="" />
            <div class="appname">{{ appName }}</div>
          </div> -->
        <div class="flex-box-nm icons">
          <!-- <FulyIcom @click="handlePerksClick" /> -->
          <KeFu @click="handleNoticeClick" />
          <!-- <img class="telImg" src="@/assets/images/telagram.jpg" @click="handleServiceClick" /> -->
          <div class="line"></div>
          <div class="flex-box-nm" @click="toggleTheme">
            <img v-if="theme === 'light'" class="logo" src="@/assets/svg/dark-theme.svg" alt="" />
            <img v-else class="logo" src="@/assets/svg/light-theme.svg" alt="" />
            <!-- <img class="logo" src="@/assets/images/logo.jpg" alt="" /> -->
            <!-- <div class="appname">{{ appName }}</div> -->
          </div>
        </div>
      </div>
    </template>
    <template v-if="type === 2">
      <div class="flex-box-sb">
        <div class="flex-box-nm">
          <ArrowBack class="back-icon" />
          {{ props.title }}
        </div>
        <div class="r-text"></div>
      </div>
    </template>

    <van-popup
      v-model:show="isShowUserInfo"
      position="left"
      :style="{ width: '80%', height: '100%' }"
    >
      <UserInfo @onClose="isShowUserInfo = false" />
    </van-popup>
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
  height: var(--cb-headerH);
  padding: 0 15px;
  box-sizing: border-box;
  box-shadow: 0 -3px 5px #201f1f;
  color: var(--cb-fColor);
  font-size: 18px;
  .logo {
    width: 24px;
    margin-right: 5px;
  }
  .appname {
    font-size: 20px;
    font-weight: bold;
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
  .icons {
    color: var(--cb-fColor5);
    gap: 10px;
    font-size: 16px;
    .meiImg {
      width: 20px;
      border-radius: 50%;
    }
    .telImg {
      width: 20px;
      border-radius: 50%;
    }
    .line {
      width: 2px;
      height: 18px;
      background-color: var(--cb-bgc2);
    }
  }
  .wap-nav {
    font-size: 25px;
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
  .lang {
    margin: 0 14px;
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

  .back-icon {
    text-align: center;
    height: 20px;
    font-weight: normal;
  }
  .r-text {
    color: var(--cb-fColor);
  }
}
:deep(.van-action-sheet__header) {
  --van-font-bold: 400;
}
</style>
