<script setup lang="ts" name="keepAliveContractView">
import { getOpenOrders, getCurrentPosition } from '@/api/market'
import type { OpenOrdersItem, CurrentPositionItem } from '@/api/market/model/MarketModel'

import Weituo from './Weituo.vue'
import Cangwei from './Cangwei.vue'
import Zijin from './Zijin.vue'
import { getToken } from '@/utils/utils'

const props = defineProps<{
  gangSize: number | string
  isLogin: boolean
  componentKey?: string
}>()

const COMPONENTKEY = 'PerMarketsView'
const route = useRoute()
const weituoList = ref<OpenOrdersItem[]>([])
const weituoCount = computed(() => {
  return weituoList.value.length > 0 ? `(${weituoList.value.length})` : ''
})
const weituoLoading = ref(false)

const cangList = ref<CurrentPositionItem[]>([])
const cangCount = computed(() => {
  return cangList.value.length > 0 ? `(${cangList.value.length})` : ''
})
const cangLoading = ref(false)
const active = ref('Weituo') // Weituo Cangwei Zijin
let timer

watch(
  () => props.isLogin,
  () => {
    if (props.isLogin) {
      getData()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => [props.componentKey, route.path],
  () => {
    if (props.componentKey === COMPONENTKEY && route.path === '/newContract') {
      getData()
    } else {
      if (timer) {
        clearInterval(timer)
      }
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  if (getToken()) {
    getWeituoData()
    getCurrentPositionData()
  }
})

onUnmounted(() => {
  clearInterval(timer)
})

function getData() {
  if (timer) {
    clearInterval(timer)
  }
  if (getToken()) {
    timer = setInterval(() => {
      getWeituoData()
      getCurrentPositionData()
    }, 3000)
  }
}

function getWeituoData() {
  weituoLoading.value = true
  getOpenOrders()
    .then((res) => {
      weituoList.value = res
    })
    .finally(() => {
      weituoLoading.value = false
    })
}

function getCurrentPositionData() {
  cangLoading.value = true
  getCurrentPosition()
    .then((res) => {
      cangList.value = res
    })
    .finally(() => {
      cangLoading.value = false
    })
}

function updateList() {
  getCurrentPositionData()
  getWeituoData()
}

defineExpose<{
  updateList: () => void
}>({
  updateList,
})
</script>

<template>
  <div class="markets">
    <van-tabs v-model:active="active" sticky shrink color="#7691e2">
      <van-tab :title="`${$t('h5.yongxu_weituo')}${weituoCount}`" name="Weituo">
        <Weituo v-bind="props" :list="weituoList" :loading="weituoLoading" @onUpdate="updateList" />
      </van-tab>
      <van-tab :title="`${$t('h5.yongxu_cangwei')}${cangCount}`" name="Cangwei">
        <Cangwei v-bind="props" :list="cangList" :loading="cangLoading" @onUpdate="updateList" />
      </van-tab>
      <van-tab :title="$t('h5.yongxu_zijin')" name="Zijin" class="tab">
        <Zijin :componentsKey="active" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less" scoped>
.markets {
  --van-tab-active-text-color: var(--cb-fColor2);
  --van-sticky-z-index: 99999;
  :deep(.van-tabs--line .van-tabs__wrap) {
    height: 50px;
    padding-top: 0px;
    background-color: white;
    border-bottom: 1px solid #e8e7e7;
  }
  :deep(.van-tabs__nav) {
    position: relative;
    padding-left: 10px !important;
  }
  :deep(.van-tab__text) {
    font-size: 14px !important;
  }
  :deep(.van-tabs) {
    height: 100%;
  }
  :deep(.van-tabs__nav--line) {
    padding-right: 40px;
  }
}
</style>
