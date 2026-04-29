<script setup lang="ts" name="keepAliveContractView">
import SpotWeituo from './SpotWeituo.vue'
import SPerMarketRecord from './SPerMarketRecord.vue'
import { getToken } from '@/utils/utils'
import { getCoinRecords } from '@/api/order'

const props = defineProps<{
  gangSize: number | string
  isLogin: boolean
  componentKey?: string
  list?: any[]
}>()

const COMPONENTKEY = 'SPerMarketsView'
const route = useRoute()
const SPerMarketRecordRef = ref()
const SpotWeituoRef = ref()
const historyList = ref([])
const weituoList = ref([])
const weituoCount = ref('')
const weituoLoading = ref(false)
const historyCount = ref('')
const cangLoading = ref(false)
const active = ref('Weituo') // Weituo Cangwei Zijin
let timer

// watch(
//   () => props.isLogin,
//   () => {
//     if (props.isLogin) {
//       getData()
//     }
//   },
//   {
//     immediate: true,
//   },
// )

watch(
  () => [props.componentKey, route.path],
  () => {
    if (props.componentKey === COMPONENTKEY && route.path === '/newContract') {
      if (getToken()) {
        getData()
      }
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
    getData()
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

// 委托订单
function getWeituoData() {
  weituoLoading.value = true
  getCoinRecords({ page: 1, limit: 15, type: 1, status: 1 })
    .then((res) => {
      weituoList.value = res.data?.list
      weituoCount.value = res.data.total > 0 ? `(${res.data.total})` : ''
    })
    .finally(() => {
      weituoLoading.value = false
    })
}

// 历史订单
function getCurrentPositionData() {
  cangLoading.value = true
  getCoinRecords({ page: 1, limit: 15, status: 2 })
    .then((res) => {
      historyList.value = res.data?.list
      historyCount.value = res.data.total > 0 ? `(${res.data.total})` : ''
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
      <van-tab :title="`${$t('h5.market.order_history')}${historyCount}`" name="SPerMarketRecord">
        <SPerMarketRecord
          v-bind="props"
          ref="SPerMarketRecordRef"
          :list="historyList"
          :activeKey="active"
          :loading="cangLoading"
          @onUpdate="updateList"
        />
      </van-tab>
      <van-tab :title="`${$t('h5.yongxu_weituo')}${weituoCount}`" name="SpotWeituo">
        <SpotWeituo
          v-bind="props"
          ref="SpotWeituoRef"
          :list="weituoList"
          :activeKey="active"
          :loading="cangLoading"
          @onUpdate="updateList"
        />
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
