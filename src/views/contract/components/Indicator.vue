<script setup lang="ts">
import useKMarketHook from '@/hooks/useKMarketHook'
import { useIndicatorStore } from '@/stores/indicator'

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const props = defineProps<{
  klineInstnce: any
  klineRef: any
}>()

const { toggleIndicator } = useKMarketHook()
const indicatorStore = useIndicatorStore()
const { checked } = storeToRefs(useIndicatorStore())

function onItemClick(item) {
  toggleIndicator(props.klineInstnce, props.klineRef, checked.value, item)
}

function onClose() {
  emit('onClose')
}
</script>

<template>
  <div class="detail-buy-box">
    <div class="header">
      <div class="name">{{ $t('h5.contract.market.iindicator_set') }}</div>
      <div class="icon" @click="$emit('onClose')">
        <span class="u-icon__icon uicon-close u-iconfont"></span>
      </div>
    </div>

    <van-checkbox-group v-model="checked">
      <div class="indicator-box">
        <van-checkbox
          v-for="item in indicatorStore.indicatorList"
          :name="item"
          :key="item"
          class="item"
          checked-color="#7691e2"
          @click="onItemClick(item)"
        >
          {{ item }}
        </van-checkbox>
      </div>
    </van-checkbox-group>

    <van-button class="btn-submit" size="large" @click="onClose">
      {{ $t('h5.common.confirm') }}
    </van-button>
  </div>
</template>

<style lang="less" scoped>
.detail-buy-box {
  padding: 15px;
  color: #1e1e1e;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 15px;
    .name {
      font-weight: 700;
    }
  }

  .indicator-box {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 4fr));
    grid-auto-rows: auto;
    grid-gap: 20px;
    flex-shrink: 0;
    padding: 10px 0 28px;
    justify-content: center;
    .item {
      text-align: center;
    }
  }

  .btn-submit {
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    margin: 10px 0 10px;
    background-color: var(--cb-btnBgc);
    color: var(--cb-fColor);
  }
}
</style>
