<script setup lang="ts">
import { useIndicatorStore } from '@/stores/indicator'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { checked } = storeToRefs(useIndicatorStore())
const oldChecked = ref([])

onMounted(() => {
  oldChecked.value = unref(checked.value)
  checked.value = []
})

onUnmounted(() => {
  checked.value = oldChecked.value
  emit('close')
})
</script>

<template>
  <div class="big-k-market">
    <KMarket componentsKey="KMarket" :isAddTypeOutside="false" />
    <div class="close" @click="emit('close')">
      <van-icon name="cross" color="#7691e2" />
    </div>
  </div>
</template>

<style scoped lang="less">
.big-k-market {
  position: fixed;
  top: 0%;
  left: 100%;
  width: calc(var(--vh, 1vh) * 100);
  height: 100vw;
  transform: rotate(90deg);
  transform-origin: left top;
  z-index: 999999999;
  background-color: var(--cb-bgc3);
  color: #848598;
  box-sizing: border-box;
  .close {
    position: fixed;
    top: 0;
    right: 12px;
    height: 50px;
    line-height: 50px;
    z-index: 999999999;
    font-size: 24px;
  }
  :deep(.price-box) {
    padding: 5px 10px !important;
    height: 30px !important;
    .left {
      flex-direction: row !important;
      gap: 10px;
      .usd {
        margin-top: 0 !important;
        display: flex;
        align-items: center;
        span {
          font-size: 16px !important;
        }
      }
    }
    .current-price {
      display: flex;
      align-items: center;
      font-size: 16px !important;
      height: 30px !important;
    }
    .right {
      display: none !important  ;
    }
  }
  :deep(.render-kline) {
    position: relative;
    width: calc(var(--vh, 1vh) * 100 - 60px) !important;
    height: calc(100vw - 75px) !important;
  }
  :deep(.currency) {
    display: flex;
    align-items: center;
    top: 0 !important;
    left: 0 !important;
    .angle {
      &::after {
        display: none !important;
      }
    }
  }
  :deep(.k-market) {
    .header {
      display: none;
    }
  }
  :deep(.setIcon) {
    display: block;
  }
  :deep(.records) {
    display: none;
  }
  :deep(.btn-group) {
    display: none;
    background-color: transparent !important;
  }
  :deep(.indi-list) {
    position: fixed;
    flex-direction: column;
    right: 0px;
    top: 72px;
    box-sizing: border-box;
    img {
      display: none;
    }
  }
  :deep(.btn-increase) {
    display: none;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 21px;
    height: 50px;
    padding: 0 15px;
    .left {
      display: flex;
      align-items: center;
      gap: 5px;
      .uicon-arrow-left {
        font-size: 18px;
      }
      .name {
        font-size: 18px;
      }
    }
    .right {
      .uicon-star-fill {
        color: #545464;
        &.selected {
          color: #2277fc;
        }
      }
    }
  }

  .red {
    color: #f04a5a;
  }
  .green {
    color: #00c572;
  }

  .kline-box {
    box-sizing: border-box;
    padding-top: 2px;
    .options {
      height: 30px;
      align-items: center;
      padding: 0 12px;
      border-bottom: 1px solid var(--cb-border-color);
      border-top: 1px solid var(--cb-border-color);
      display: flex;
      justify-content: space-between;
      color: #999;
      font-size: 12px;
      .active {
        color: var(--cb-fColor2);
      }
    }

    .render-kline {
      position: relative;
      height: 100dvh;
      height: -webkit-fill-available;
      height: calc(var(--vh, 1vh) * 100);
      width: 100vw;
      &.loading {
        background-color: rgba(81, 82, 87, 0.5);
      }
      .block {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
