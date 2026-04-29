<script setup lang="ts" name="keepAliveContractView">
import KMarket from './KMarket.vue'
import PerMarketsView from '../perMarkets/PerMarketsView.vue'
import SPerMarketsView from '../SpotMarkets/SPerMarketsView.vue'
import { localCache } from '@/utils/cache'
import CONST from '@/const/index'

const route = useRoute()
const router = useRouter()
const active = ref()
const tabs = ref([
  {
    name: 'h5.gridmenu.Perpetual_Contracts',
    key: 'KMarket',
    component: markRaw(KMarket),
  },
  {
    name: 'h5.yongxu_top_title',
    key: 'PerMarketsView',
    component: markRaw(PerMarketsView),
  },
  {
    name: 'h5.contract.market.spot.spotname',
    key: 'SPerMarketsView',
    component: markRaw(SPerMarketsView),
  },
])

watch(active, () => {
  localCache.setCache(CONST.CONTRACT_TAB_KEY, active.value)
})

onMounted(() => {
  active.value =
    localCache.getCache(CONST.CONTRACT_TAB_KEY) || (route.query.type as any) || 'KMarket'
})

onActivated(() => {
  active.value =
    localCache.getCache(CONST.CONTRACT_TAB_KEY) || (route.query.type as any) || 'KMarket'
  // const sessionCurrencyMarket = sessionCache.getCache(CONST.CONTRACTKEY)
  // const currentCurrency = sessionCurrencyMarket ?? currencyMarketDataList.value[0]

  // 数字货币---显示永续合约
  // if (currentCurrency?.type === 'DigitalCurrency') {
  tabs.value = [
    {
      name: 'h5.gridmenu.Perpetual_Contracts',
      key: 'KMarket',
      component: markRaw(KMarket),
    },
    {
      name: 'h5.yongxu_top_title',
      key: 'PerMarketsView',
      component: markRaw(PerMarketsView),
    },
    {
      name: 'h5.contract.market.spot.spotname',
      key: 'SPerMarketsView',
      component: markRaw(SPerMarketsView),
    },
  ]
  // } else {
  //   tabs.value = [
  //     {
  //       name: 'h5.gridmenu.Perpetual_Contracts',
  //       key: 'KMarket',
  //       component: KMarket,
  //     },
  //   ]
  // }
})

function onBackClick() {
  router.replace('/markets')
}
</script>

<template>
  <div class="markets">
    <van-tabs v-model:active="active" sticky shrink color="#7691e2">
      <template #nav-left>
        <ArrowBack class="icon" @click="onBackClick" />
      </template>
      <van-tab
        v-for="item in tabs"
        :title="$t(item.name)"
        :key="item.key"
        :name="$t(item.key)"
        class="tab"
      >
        <component :is="item.component" :key="item.name" :componentsKey="active" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less" scoped>
.markets {
  --van-tab-active-text-color: var(--cb-fColor2);
  --van-tabs-nav-background: var(--cb-bgc4);
  background-color: var(--cb-bgc);
  position: relative;
  :deep(.van-tabs__nav) {
    width: 100%;
    height: 50px;
    padding-left: 50px;
    width: calc(100vw - 50px);
  }
  :deep(.van-tabs--line .van-tabs__wrap) {
    height: 50px;
    padding-top: 0px;
    background-color: var(--cb-bgc4);
    border-bottom: 1px solid var(--cb-borderColor2);
  }
  :deep(.van-tab__text) {
    font-size: 17px;
  }
  :deep(.van-tabs) {
    height: 100%;
  }
  :deep(.van-tabs__nav--line) {
    padding-right: 40px;
  }
  .icon {
    position: absolute;
    z-index: 112;
    left: 0px;
    top: 0px;
    width: 24px;
    padding: 14px;
    background-color: var(--cb-bgc4);
  }
  .no-chang-search-icon {
    position: fixed;
    z-index: 9999;
    top: 12px;
    right: 0;
    font-size: 22px;
    width: 36px;
    height: 38px;
    background-color: #ffffff;
    padding-left: 10px;
  }
}
</style>
