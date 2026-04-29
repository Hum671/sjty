<script setup lang="ts">
import RechargeRecord from '@/views/Assets/recharge/records.vue'
import WithdrawRecord from '@/views/Assets/withdraw/records.vue'
import Miao from '@/views/contract/records.vue'
import Yong from '@/views/perMarkets/PerMarketRecord.vue'
import PledgeRecord from '@/views/pledge/PledgeRecord.vue'
import AllSPerRecord from '@/views/SpotMarkets/AllSPerRecord.vue'
import LoanRecord from '@/views/loan/LoanRecord.vue'

const route = useRoute()
const router = useRouter()
const active = ref<
  | 'RechargeRecord'
  | 'WithdrawRecord'
  | 'MiaoRecord'
  | 'YongRecord'
  | 'PledgeRecord'
  | 'spotRecord'
  | 'LoanRecord'
>('RechargeRecord')
const recordCpns = [
  {
    title: 'h5.recharge.record.title',
    name: 'RechargeRecord',
    component: markRaw(RechargeRecord),
  },
  {
    title: 'h5.withdraw.record.title',
    name: 'WithdrawRecord',
    component: markRaw(WithdrawRecord),
  },
  {
    title: 'h5.heyue_record_title',
    name: 'MiaoRecord',
    component: markRaw(Miao),
  },
  {
    title: 'h5.yongxu_record_title',
    name: 'YongRecord',
    component: markRaw(Yong),
  },
  {
    title: 'h5.contract.market.spot.record_title',
    name: 'spotRecord',
    component: markRaw(AllSPerRecord),
  },
  {
    title: 'h5.pledge.record_title2',
    name: 'PledgeRecord',
    component: markRaw(PledgeRecord),
  },
  {
    title: 'h5.loan.record.title',
    name: 'LoanRecord',
    component: markRaw(LoanRecord),
  },
]

watchEffect(() => {
  active.value = (route.query.type as any) || 'RechargeRecord'
})

function onBack() {
  router.replace('/user-financial')
}
</script>
<template>
  <div class="assets-box">
    <ArrowBack class="icon" @click="onBack" />
    <van-tabs v-model:active="active" class="tabber" shrink color="#7691e2">
      <van-tab
        v-for="item of recordCpns"
        :title="$t(item.title)"
        :name="item.name"
        class="tab"
        :key="item.name"
      >
        <component :is="item.component" :active-key="active" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less" scoped>
.assets-box {
  --van-tab-active-text-color: var(--cb-fColor2);
  --van-tabs-nav-background: var(--cb-bgc4);
  background-color: var(--cb-bgc);
  position: relative;
  :deep(.van-tabs__nav) {
    position: fixed;
    top: 0;
    z-index: 111;
    width: 100%;
    height: 50px;
    padding-left: 50px;
    padding-bottom: 0;
    width: calc(100vw - 50px);
  }
  :deep(.van-tabs--line .van-tabs__wrap) {
    height: 50px;
    padding-top: 0px;
    background-color: var(--cb-bgc4);
    border-bottom: 1px solid var(--cb-bgc3);
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
  :deep(.van-tabs__line) {
    bottom: 0;
  }
  .icon {
    position: fixed;
    z-index: 112;
    left: 0px;
    top: 0px;
    width: 23px;
    padding: 13px;
    background-color: var(--cb-bgc4);
  }
  :deep(.van-tabs__content) {
    height: 0;
  }
}
</style>
