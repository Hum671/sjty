<script setup lang="ts">
import { useCpnCtrlStore } from '@/stores/cpnCtrl'
import { useCurrencyStore } from '@/stores/currency'
import { useMarketStore } from './stores/market'
import { useConfigStore } from '@/stores/config'
import { statsApi } from '@/api/home'
import { checkDeviceType } from '@/utils/utils'
import { useUserStore } from '@/stores/user'

const { isShowTabbar } = storeToRefs(useCpnCtrlStore())
const currencyStore = useCurrencyStore()
const marketStore = useMarketStore()
const configStore = useConfigStore()
const useStore = useUserStore()

const { userInfo } = storeToRefs(useStore)
const { globalSettingInfo } = storeToRefs(configStore)
const { currencyList } = storeToRefs(currencyStore)
const { isWebsocketConnSuccess } = storeToRefs(marketStore)
const size = 48
const offset = ref({ x: 0, y: 0 })
const websocketTimer = 0

watch(currencyList, (value) => {
  handleRequsetMarket(value)
})

watch(isWebsocketConnSuccess, () => {
  handleRequsetMarket(currencyList.value)
})

onMounted(() => {
  handleInit()
  statsApi()
  document.getElementById('g-loading')!.style.display = 'none'

  const w = window.innerWidth
  const h = window.innerHeight
  offset.value = {
    x: w - size - 4, // 贴右侧，留出 gap（默认 24）
    y: Math.max(20, (h - size + 60) / 2), // 垂直居中，避免越界
  }
})

function handleInit() {
  useStore.requestUserInfo()
  marketStore.handleWebsocket()
  currencyStore.getCurrencyList()
  configStore.requestSettingInfo()
}

// 贯穿全局的ws连接
function handleRequsetMarket(value) {
  if (!value || value.list.length === 0 || !isWebsocketConnSuccess.value) {
    return
  }
  if (websocketTimer) {
    clearInterval(websocketTimer)
  }

  const symbols = value.list.map((item) => item.symbol)
  marketStore.requestTicker24hrData(symbols)
}

function handleServiceClick() {
  let url = globalSettingInfo.value?.onlineCustomer
  if (userInfo.value) {
    url += `&metadata={"name":"${userInfo.value.id}"}`
  }
  const openType = checkDeviceType() ? '_self' : '_blank'
  window.open(url, openType)
}
</script>

<template>
  <div class="app">
    <div class="pages" :class="{ 'has-tabbar': isShowTabbar }">
      <router-view v-slot="{ Component, route }">
        <!-- <transition :name="route.meta.isAnimateIn ? 'in' : 'out'"> -->
        <keep-alive :include="/^keepAlive/">
          <component :is="Component"></component>
        </keep-alive>
        <!-- </transition> -->
      </router-view>
    </div>

    <Tabbar v-show="isShowTabbar" />

    <Langague />

    <!-- <NoticeCpn /> -->
    <!-- <van-floating-bubble
      v-model:offset="offset"
      :gap="6"
      axis="xy"
      magnetic="x"
      @click="handleServiceClick"
    >
      <div class="dragger-box">
        <img src="~@/assets/images/service.png" alt="" />
      </div>
    </van-floating-bubble> -->
  </div>
</template>

<style lang="less" scoped>
.app {
  position: relative;
  /* 现代浏览器 */
  height: 100dvh;

  /* 兼容旧 Safari */
  height: -webkit-fill-available;

  /* JS 注入的兜底 */
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  font-size: 14px;
  overflow: hidden;
}

.service-icon {
  font-size: 50px;
  opacity: 0.8;
}
.dragger-box {
  --van-floating-bubble-z-index: 990;
  position: relative;
  background-color: var(--cb-bubblBgc);
  border-radius: 50%;
  box-sizing: border-box;
  padding: 13px;
  img {
    position: relative;
    bottom: -1px;
    width: 28px;
    height: 28px;
  }
}
.pages {
  overflow-y: auto;
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100);
  overflow-x: hidden;
  background-color: var(--cb-bgc5);
  color: var(--cb-fColor);
}
.has-tabbar {
  height: calc(100dvh - 60px);
  height: calc(-webkit-fill-available - 60px);
  height: calc(var(--vh, 1vh) * 100 - 60px);
}

.in-enter-active,
.in-leave-active,
.out-enter-active,
.out-leave-active {
  transition: all 0.3s ease-in-out;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100%;
  backface-visibility: hidden;
}

.out-enter-from,
.out-leave-to {
  opacity: 0;
  transform: translateX(50%);
}

.in-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
</style>

<style lang="less">
.draggable {
  @size: 44px;
  background-color: transparent;
  display: flex;
  align-items: center;
  .van-icon__image {
    width: @size;
    height: @size;
  }
}
.van-radio-group {
  padding-bottom: 80px;
}
</style>
