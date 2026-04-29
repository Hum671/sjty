<script setup lang="ts" name="keepAliveMarket">
// import Optional from './components/Optional.vue'
import { useThemeHook } from '@/hooks/useThemeHook'
import SecondContract from './components/SecondContract.vue'

const active = ref('DigitalCurrency')
const route = useRoute()
const searchValue = ref()
const { theme } = useThemeHook()
const isMarketShow = computed(() => {
  return route.path === '/markets'
})

const tabs = [
  //   {
  //     name: 'h5.register.myOptions',
  //     key: 'MyOption',
  //     component: Optional,
  //   },
  {
    name: 'h5.selectBit.digital_currency',
    key: 'DigitalCurrency',
    component: SecondContract,
  },
  {
    name: 'h5.market.huangjin',
    key: 'Commodities',
    component: SecondContract,
  },
  {
    name: 'h5.market.gupiao',
    key: 'Index',
    component: SecondContract,
  },
  {
    name: 'h5.market.jijin',
    key: 'Forex',
    component: SecondContract,
  },
]
</script>

<template>
  <div class="markets">
    <HeaderCpn v-if="isMarketShow" />
    <van-search
      v-if="isMarketShow"
      v-model="searchValue"
      shape="round"
      :background="theme === 'dark' ? '#0f0f16' : '#fff'"
      :placeholder="$t('h5.contract.letf.placeholder')"
    />
    <van-tabs v-model:active="active" shrink lazy-render color="#7691e2">
      <van-tab
        v-for="item in tabs"
        :title="$t(item.name)"
        :key="item.key"
        :name="$t(item.key)"
        class="tab"
      >
        <!-- <component :is="item.component" :ikey="active" :searchValue="searchValue" /> -->
      </van-tab>
    </van-tabs>
    <SecondContract :ikey="active" :searchValue="searchValue" :isMarketShow="isMarketShow" />

    <!-- <div class="no-chang-search-icon" @click="toSearch">
			<span class="u-icon__icon uicon-search u-iconfont"></span>
		</div> -->
  </div>
</template>

<style lang="less" scoped>
.markets {
  --van-tabs-nav-background: var(--cb-bgc4);
  --van-search-content-background: var(--cb-market-search-content);
  // --van-search-content-background: var(--cb-bgc2);
  --van-cell-text-color: var(--cb-fColor);
  --van-field-input-text-color: var(--cb-fColor);
  --van-tab-active-text-color: #7691e2;
  min-height: calc(100dvh - 60px);
  min-height: calc(-webkit-fill-available - 60px);
  min-height: calc(var(--vh, 1vh) * 100 - 60px);
  background-color: var(--cb-bgc);
  :deep(.van-tabs--line .van-tabs__wrap) {
    height: 50px;
    padding-top: 0px;
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
