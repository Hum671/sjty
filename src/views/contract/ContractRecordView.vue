<script setup lang="ts">
import Miao from '@/views/contract/records.vue'
import Yong from '@/views/perMarkets/PerMarketRecord.vue'

const route = useRoute()
const active = ref<1 | 2>(1)

onMounted(() => {
  // perContract contract
  if (route.query.type === 'contract') {
    active.value = 1
  }
  if (route.query.type === 'perContract') {
    active.value = 2
  }
})
</script>

<template>
  <div class="record-index light">
    <Navbar2 :title="$t('h5.contract.index.trading_records')" :is-show-right="false" />

    <div class="toggle flex-box-sb">
      <div class="btn" :class="{ active: active === 1 }" @click="active = 1">
        {{ $t('h5.gridmenu.Perpetual_Contracts') }}
      </div>
      <div class="btn" :class="{ active: active === 2 }" @click="active = 2">
        {{ $t('h5.yongxu_top_title') }}
      </div>
    </div>

    <div class="content">
      <Miao v-if="active === 1" />
      <Yong v-else />
    </div>
  </div>
</template>

<style lang="less" scoped>
.record-index {
  position: relative;
  .toggle {
    position: fixed;
    z-index: 99999;
    width: 100%;
    box-sizing: border-box;
    top: 50px;
    padding: 20px;
    gap: 10px;
    background-color: #ffffff;
    box-shadow: 0 0px 1px #8849f6;
    .btn {
      flex: 1;
      background-color: var(--cb-btnBgc2);
      border: 1px solid var(--cb-borderColor);
      text-align: center;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
      color: var(--cb-fColor3);
    }
    .active {
      background-color: var(--cb-btnBgc);
      color: var(--cb-fColor);
    }
  }
  .content {
    padding-top: 90px;

    :deep(.h) {
      display: none;
    }
    :deep(.list) {
      padding-top: 0;
    }
  }
}
</style>
