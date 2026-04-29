<script setup lang="ts" name="keepAliveAssetsView">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)
const active = ref<'TotalAssetsView' | 'ZichanView' | 'ContractAssets' | 'FinancialAssets'>(
  'TotalAssetsView',
)

onActivated(() => {
  loading.value = true
  userStore.requestUserBalance()
})
</script>
<template>
  <div class="assets-box">
    <van-tabs v-model:active="active" class="tabber" sticky shrink color="#7691e2">
      <van-tab :title="$t('h5.pledge.Total_Assets')" name="TotalAssetsView" class="tab">
        <TotalAssetsView />
      </van-tab>
      <van-tab :title="$t('h5.transfer.count_t')" name="ZichanView" class="tab">
        <ZichanView />
      </van-tab>
      <van-tab
        :title="$t('h5.user_info.assets.contract_account')"
        name="ContractAssets"
        class="tab"
      >
        <ContractAssets />
      </van-tab>
      <van-tab :title="$t('h5.financial.title')" name="FinancialAssets" class="tab">
        <FinancialAssets />
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
  .tabber {
    position: sticky;
    top: 0;
  }
  :deep(.van-tab__panel) {
    padding-top: 20px;
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
  .icon {
    width: 18px;
  }
  :deep(.van-tabs__content) {
    height: 0;
  }
}
</style>
