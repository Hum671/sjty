<script setup lang="ts">
import { useDisconnect } from '@web3modal/ethers/vue'
import { useUserStore } from '@/stores/user'
import { registerLogin, walletLogin } from '@/api/login'
import { getSwitchToSimAccount } from '@/api/userInfo'
// import { useConfigStore } from '@/stores/config'
import { delToken, getToken } from '@/utils/utils'
import { showConfirmDialog, showToast } from 'vant'
import { localCache } from '@/utils/cache'
import useLangHook from '@/hooks/useLangHooks'

import UserHomeSvg from '@/assets/svg/userinfoISvg/UserHomeSvg.vue'
// import UserKuaijieSvg from '@/assets/svg/userinfoISvg/UserKuaijieSvg.vue'
import UserSafeSvg from '@/assets/svg/userinfoISvg/UserSafeSvg.vue'
import UserSaveSvg from '@/assets/svg/userinfoISvg/UserSaveSvg.vue'
import UserAiSvg from '@/assets/svg/userinfoISvg/UserAiSvg.vue'
import UserTradeSvg from '@/assets/svg/userinfoISvg/UserTradeSvg.vue'
import UserCiShanSvg from '@/assets/svg/userinfoISvg/UserCiShanSvg.vue'
// import UserJinrongSvg from '@/assets/svg/userinfoISvg/UserJinrongSvg.vue'
import UserZichanSvg from '@/assets/svg/userinfoISvg/UserZichanSvg.vue'
// import UserTongzhiSvg from '@/assets/svg/userinfoISvg/UserTongzhiSvg.vue'
// import UserDownloadSvg from '@/assets/svg/userinfoISvg/UserDownloadSvg.vue'
import UserHongSvg from '@/assets/svg/userinfoISvg/UserHongSvg.vue'
// import UserHuodongSvg from '@/assets/svg/userinfoISvg/UserHuodongSvg.vue'
import UserXinshouSvg from '@/assets/svg/userinfoISvg/UserXinshouSvg.vue'
import UserZhanghuSvg from '@/assets/svg/userinfoISvg/UserZhanghuSvg.vue'
import UserLangSvg from '@/assets/svg/userinfoISvg/UserLangSvg.vue'
import UserClearSvg from '@/assets/svg/userinfoISvg/UserClearSvg.vue'
import UserLogoutSvg from '@/assets/svg/userinfoISvg/UserLogoutSvg.vue'

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const appName = import.meta.env.VITE_APP_NAME
const router = useRouter()
const { t } = useI18n()
const isLogin = ref(false)
const isLoading = ref(false)
const codeRef = ref()
const showPopover = ref(false)
const { isShowLangList, lang } = useLangHook()
const { disconnect } = useDisconnect()
const useStore = useUserStore()
const { userInfo, userInfoLoading } = storeToRefs(useStore)
const accoutdata = ref({ text: t('h5.user_info_transform_1'), value: 1 })
const userinfoRef = ref()
const activeNames = ref([])
const actions = [
  { text: t('h5.user_info_transform_1'), value: 1 },
  { text: t('h5.user_info_transform_2'), value: 2 },
]

const list2 = ref([
  {
    icon: markRaw(UserTradeSvg),
    label: 'h5.home.contract_center',
    childs: [
      {
        label: 'h5.tabbar.market2',
        url: '/markets',
      },
      {
        label: 'h5.pledge.top_title2',
        url: '/pledge',
      },
      {
        label: 'h5.tabbar.contract',
        url: '/newContract?type=KMarket',
      },
      {
        label: 'h5.yongxu_top_title',
        url: '/newContract?type=PerMarketsView',
      },
      {
        label: 'h5.contract.market.spot.spotname',
        url: '/newContract?type=SPerMarketsView',
      },
    ],
  },
])
const list3 = ref([
  {
    icon: markRaw(UserHomeSvg),
    label: 'h5.tabbar.home',
    url: '/home',
  },
  {
    icon: markRaw(UserLangSvg),
    label: '',
    url: 'language',
  },
])
const list = ref([
  {
    icon: markRaw(UserZhanghuSvg),
    label: 'h5.userInfo.ID_Verfication',
    url: '/real',
  },
  // {
  //   icon: UserAiSvg,
  //   label: 'h5.userInfo.Settings',
  //   url: '/setting',
  // },
  {
    icon: markRaw(UserSaveSvg),
    label: 'h5.userInfo.Deposit_Center',
    url: '/recharge/index',
  },

  {
    icon: markRaw(UserAiSvg),
    label: 'h5.loan.title',
    url: '/loan',
  },
  // {
  //   icon: UserCiShanSvg,
  //   label: '慈善',
  //   url: '/setting',
  // },
  {
    icon: markRaw(UserZichanSvg),
    label: 'h5.ntf.asset_detail',
    url: '/user-financial',
  },
  // {
  //   icon: UserTongzhiSvg,
  //   label: 'h5.news.news',
  //   url: '/news',
  // },
  {
    icon: markRaw(UserSafeSvg),
    label: 'h5.userInfo.Security',
    url: '/security',
  },
  // {
  //   icon: UserHuodongSvg,
  //   label: 'h5.gridmenu.Perks',
  //   url: '/perks',
  // },
  // {
  //   icon: markRaw(UserHongSvg),
  //   label: 'h5.userInfo.My_Invitation',
  //   url: '/promotionCenter',
  // },
  {
    icon: markRaw(UserXinshouSvg),
    label: 'h5.userInfo.About_us',
    url: '/about',
  },
  {
    icon: markRaw(UserCiShanSvg),
    label: 'h5.passwor.falv',
    url: '/legal',
  },
  {
    icon: markRaw(UserSafeSvg),
    label: 'h5.passwor.Privacy_Policy',
    url: '/article',
  },
  {
    icon: markRaw(UserXinshouSvg),
    label: 'h5.gridmenu.White_Paper',
    url: '/whiteBook',
  },
  // {
  //   icon: markRaw(UserXinshouSvg),
  //   label: 'h5.userInfo.jianguanzhenegshu',
  //   url: '/regulatoryCertificateBook',
  // },
  // {
  //   icon: markRaw(UserXinshouSvg),
  //   label: 'h5.userInfo.falvshuoming',
  //   url: '/legalNoticeBook',
  // },
  // {
  //   icon: markRaw(UserXinshouSvg),
  //   label: 'MSB',
  //   url: '/officialEndorsementBook',
  // },
  {
    icon: markRaw(UserClearSvg),
    label: 'h5.userInfo.clear_cached',
    url: '/',
  },
  {
    icon: markRaw(UserLogoutSvg),
    label: 'h5.login.Logout',
    url: '',
  },
])

// watchEffect(() => {
// handleDownload()
// })

watchEffect(() => {
  isLogin.value = Boolean(getToken())

  const testToken = localCache.getCache('testToken')
  if (isLogin.value) {
    if (testToken) {
      // 测试账户
      accoutdata.value = { text: t('h5.user_info_transform_2'), value: 2 }
    } else {
      // 我的账户
      accoutdata.value = { text: t('h5.user_info_transform_1'), value: 1 }
    }
  }
})

watch(userInfoLoading, () => {
  // 只有用户信息请求完成时才会修改当前页loading为false
  if (!userInfoLoading.value) {
    isLoading.value = false
  }
})

watch(
  lang,
  () => {
    const index = list3.value.findIndex((item) => item.url === 'language')
    list3.value[index].label = lang.value
  },
  {
    immediate: true,
  },
)

// function handleDownload() {
//   if (globalSettingInfo.value?.downloadApp) {
//     list.value.splice(-3, 0, {
//       icon: UserDownloadSvg,
//       label: 'h5.userInfo.APP_download',
//       url: globalSettingInfo.value?.downloadApp,
//     })
//   } else {
//     list.value = list.value.filter((item) => item.label !== 'h5.userInfo.APP_download')
//   }
// }

function handleCellItemClick(item: any, title: any, titleLangCode: any) {
  if (item.url === 'language') {
    isShowLangList.value = true
    emit('onClose')
    return
  }
  switch (item.label) {
    case 'h5.tabbar.home':
      router.push({
        path: '/home',
      })
      break
    case 'h5.login.Logout':
      handleLogoutClick()
      break
    case 'h5.passwor.Privacy_Policy':
      router.push({
        path: '/article',
        query: {
          id: 44,
          name: 'yinsizhengce',
        },
      })
      break
    // case 'h5.passwor.falv':
    //   router.push({
    //     path: '/article',
    //     query: {
    //       id: 44,
    //       name: 'falv',
    //     },
    //   })
    //   break
    case 'h5.userInfo.APP_download':
      if (item.url) {
        window.open(item.url, '_blank')
      }
      break
    case 'h5.userInfo.clear_cached':
      // localCache.deleteCache('langOptions')
      // localCache.deleteCache('i18nLocale')
      // 清空全部缓存
      localStorage.clear()
      window.location.reload()
      break
    case 'h5.passwor.falv':
    case 'h5.tabbar.contract':
    case 'h5.yongxu_top_title':
    case 'h5.contract.market.spot.spotname':
      router.push(item.url)
      break
    default:
      router.push({
        path: item.url,
        query: {
          title,
          titleLangCode: titleLangCode,
        },
      })
  }
  emit('onClose')
}

function handleLogoutClick() {
  showConfirmDialog({
    title: t('h5.user_info.logout_confirm_title'),
    message: t('h5.user_info.logout_confirm_content'),
    confirmButtonText: t('h5.common.confirm'),
    cancelButtonText: t('h5.common.cancel'),
  }).then(() => {
    delToken()
    disconnect()
    localCache.deleteCache('testToken')
    localCache.deleteCache('userToken')
    localCache.deleteCache('userloginModel')
    localCache.deleteCache('loginModel')
    userInfo.value = null
    isLogin.value = false
    window.location.reload()
  })
}

function handleCopyCode() {
  try {
    const text = codeRef.value.textContent
    navigator.clipboard.writeText(text)
    showToast(t('h5.share.Copy_successful'))
  } catch (error) {
    showToast(t('h5.share.Copy_failed'))
  }
}

function onSelect(action: { text: string; value: 1 | 2 }) {
  if (accoutdata.value.value === action.value) {
    return
  }

  // 切换状态
  isLoading.value = true

  accoutdata.value = action

  const userToken = localCache.getCache('userToken')
  const userloginModel = localCache.getCache('userloginModel')

  // 我的账户
  if (action.value === 1 && userToken) {
    if (userloginModel === 'email') {
      // 邮箱登入
      localCache.setCache('loginModel', 'email')
    } else {
      // 钱包登入
      localCache.setCache('loginModel', 'wallet')
    }

    localCache.setCache('SESSION_TOKEN', userToken)
    localCache.setCache('testToken', '')
    useStore.requestUserInfo()
  }

  // 测试账户
  if (action.value === 2) {
    // 获取账号密码
    getSwitchToSimAccount().then((res) => {
      if (res.code === 200) {
        const testAccountInfo = res.data
        if (res.data.accountType === 'email') {
          // 邮箱登入
          accountLoginTest(testAccountInfo.account)
        }
        if (res.data.accountType === 'wallet') {
          // 钱包登入
          walletLoginTest(testAccountInfo.account)
        }
      }
    })
  }
}

function accountLoginTest(account) {
  registerLogin({
    email: account,
    password: 'Aa123123',
    isLogin: true,
  })
    .then((token) => {
      localCache.setCache('loginModel', 'email')
      localCache.setCache('testToken', token)
      useStore.requestUserInfo()
    })
    .catch((msg) => {
      showToast(t(msg))
      isLoading.value = false
    })
}

function walletLoginTest(account) {
  const data = {
    signature: 'Aa123123',
    address: account,
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

  walletLogin(data)
    .then((token) => {
      localCache.setCache('loginModel', 'wallet')
      localCache.setCache('testToken', token)
      useStore.requestUserInfo()
    })
    .catch((msg) => {
      showToast(t(msg))
      isLoading.value = false
    })
}
</script>

<template>
  <div class="userinfo-box" ref="userinfoRef">
    <div class="top-name flex-box-nm">
      <img class="logo" src="@/assets/images/logo.jpg" alt="" />{{ appName }}
    </div>
    <div class="info flex-box-sb">
      <div class="left flex-box-nm">
        <img class="avator" src="@/assets/images/user-avator.png" alt="headimg" />
        <div class="user-info">
          <div class="user-id">
            <span ref="codeRef" class="text-over-ellip">
              {{ userInfo?.accounttext || '-' }}
            </span>
            <div class="copy-icon" @click="handleCopyCode">
              <img src="~@/assets/icons/copy.png" />
            </div>
          </div>
          <div class="rp-score">UID: {{ userInfo?.id || '-' }}</div>
          <van-popover
            v-model:show="showPopover"
            :actions="actions"
            :teleport="userinfoRef"
            @select="onSelect"
          >
            <template #reference>
              <div v-if="isLogin" class="transform">
                {{ accoutdata.text }}
                <van-loading v-if="isLoading" type="spinner" class="loading" color="#7f60e8" />
                <img v-else src="@/assets/images/transform.png" alt="" />
              </div>
            </template>
          </van-popover>
        </div>
      </div>
      <div class="wrap flex-box-ce">{{ userInfo?.score || '-' }}</div>
    </div>

    <div
      v-for="(item, index) of list3"
      :key="index"
      class="cell flex-box-nm"
      @click="handleCellItemClick(item, $t(item.label), item.label)"
    >
      <component :is="item.icon" class="cell-icon" />
      <div class="custom-title">{{ $t(item.label) }}</div>
    </div>

    <van-collapse v-model="activeNames">
      <van-collapse-item
        v-for="(item, index) of list2"
        :title="$t(item.label)"
        :name="item.label"
        :key="index"
      >
        <template #icon>
          <component :is="item.icon" class="cell-icon" />
        </template>
        <div
          v-for="iten in item.childs"
          :key="iten.label"
          @click="handleCellItemClick(iten, $t(iten.label), iten.label)"
        >
          {{ $t(iten.label) }}
        </div>
      </van-collapse-item>
    </van-collapse>

    <div
      v-for="(item, index) of list"
      :key="index"
      class="cell flex-box-nm"
      @click="handleCellItemClick(item, $t(item.label), item.label)"
    >
      <component :is="item.icon" class="cell-icon" />
      <div class="custom-title">{{ $t(item.label) }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.userinfo-box {
  --van-cell-text-color: var(--cb-fColor);
  --van-popup-background: var(--cb-contantBgc);
  --van-cell-right-icon-color: var(--cb-fColor3);
  --van-collapse-item-content-text-color: var(--cb-fColor6);
  --van-cell-background: var(--cb-contantBgc);
  --van-collapse-item-content-background: var(--cb-contantBgc);
  --van-cell-border-color: transparent;
  --van-cell-active-color: transparent;
  --van-border-color: transparent;
  --van-collapse-item-content-line-height: 30px;
  --van-collapse-item-content-padding: 0 16px;
  --van-popover-light-background: var(--cb-bgc2);
  --van-popover-light-text-color: var(--cb-fColor);
  background-color: var(--cb-userInfo-bgc);
  min-height: 100%;
  padding: 0 6px;
  padding-bottom: 50px;
  box-sizing: border-box;
}
.top-name {
  padding: 20px 10px 0;
  font-size: 20px;
  font-weight: bold;
  transform-origin: left bottom;
  animation: rotate 0.5s linear;
  .logo {
    width: 24px;
    margin-right: 10px;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(-50deg);
  }
  100% {
    transform: rotate(0);
  }
}

.cell {
  padding: 14px 12px;
}
:deep(.van-cell) {
  align-items: center;
  padding: 14px 12px;
  height: 45px;
  line-height: 45px;
}
:deep(.van-ellipsis) {
  font-size: 14px;
}
:deep(.van-cell__title) {
  span {
    font-size: 14px;
  }
}
:deep(.van-dropdown-menu__bar) {
  box-shadow: none;
}
.info {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 10px;
  border-bottom: 1px solid var(--cb-borderColor2);
  .avator {
    width: 40px;
    border-radius: 10px;
  }
  .user-info {
    margin-left: 8px;
    line-height: 20px;
    .user-id {
      display: flex;
      align-items: center;
      font-size: 16px;
      width: 180px;
      span {
        font-size: 14px;
        // width: 105px;
      }
      .icon {
        margin-left: 8px;
        font-size: 14px;
      }
      .copy-icon {
        width: 30px;
        height: 30px;
        background-color: rgba(51, 51, 51, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        img {
          width: 17px;
          height: 17px;
        }
      }
    }
    .rp-score {
      color: #999999;
      font-size: 12px;
    }
    .transform {
      font-size: 12px;
      display: flex;
      align-items: center;
      img {
        width: 20px;
      }
      .loading {
        width: 20px;
        margin-left: 8px;
      }
    }
  }
  .wrap {
    color: #999999;
    width: 45px;
    height: 45px;
    background: url(@/assets/svg/score1.svg) no-repeat;
    background-size: 100% 100%;
    color: #1ee827;
    font-size: 12px;
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
  margin: auto;
  color: #fff;
  margin: 40px 16px;
  height: 45px;
  width: calc(100% - 32px);
}
:deep(.van-cell__value) {
  span {
    font-size: 14px;
  }
}
:deep(.van-cell__title) {
  display: flex;
  align-items: center;
}
.cell-icon {
  width: 16px;
  margin-right: 10px;
  color: var(--cb-fColor);
}
.custom-title {
  width: 200px;
  font-size: 14px;
  color: var(--cb-fColor);
}
</style>
