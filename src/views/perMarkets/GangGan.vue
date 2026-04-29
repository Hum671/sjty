<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import { formatNumber, usFormat } from '@/utils/utils'

const emit = defineEmits<{
  (e: 'onConfirm', gangSize: number): void
}>()

const props = defineProps<{
  balance: number
  ganggan: number
  name: string | number
  buyNum?: string | number
  shiType: number
  buyPrice?: string | number
}>()

const { newKLineData, hasDataChange } = storeToRefs(useMarketStore())
const gangSize = ref(3)
const sizes = [1, 2, 3, 5, 10, 20, 30, 50, 75, 100]
const chengben = ref(0)
const allKeyongNum = computed(() => {
  let price

  if (props.shiType === 1) {
    // 市價
    price = newKLineData.value?.price
  } else if (props.shiType === 2) {
    if (!props.buyPrice || props.buyPrice === '0') {
      return 0
    }
    // 限價
    price = props.buyPrice
  }

  // 可用數量 = 交易賬戶ustd余額 / 價格 / 杠桿
  return Number(formatNumber(props.balance / price / gangSize.value, 8))
})

watchEffect(() => {
  gangSize.value = props.ganggan
})

watch(hasDataChange, () => {
  chengben.value = getChengben()
})

function getBuyNum() {
  if (!props.buyNum) {
    return 0
  }

  // 購買數量
  if (props.buyNum?.includes('%')) {
    // 購買比例
    const buyNumPercent = Number(props.buyNum?.replace('%', '')) / 100

    // 按百分比計算出的數量
    return Number(formatNumber(allKeyongNum.value * buyNumPercent, 8))
  } else {
    // 直接輸入的數量
    return Number(props.buyNum)
  }
}

function getChengben() {
  // 成本 = 購買數量 * 开仓价格
  if (props.buyNum === '100%') {
    return props.balance
  }

  let kaicangPrice
  const currentBuyNum = getBuyNum()

  if (props.shiType === 1) {
    // 市價
    kaicangPrice = newKLineData.value?.price || 0
  } else if (props.shiType === 2) {
    // 限價
    kaicangPrice = props.buyPrice
  } else {
    kaicangPrice = 0
  }

  const margin = Number(formatNumber(currentBuyNum * kaicangPrice, 8))
  return margin
}

function onGangConfirm() {
  emit('onConfirm', gangSize.value)

  // 恢復默認值
  gangSize.value = 1
}
</script>

<template>
  <div class="gang-box">
    <div class="title">{{ $t('h5.yongxu_tiaozhengganggan') }}</div>
    <div class="tool tool2">
      <div class="c1">
        <van-stepper v-model="gangSize" color="#28ba98" min="0" max="100" input-width="140px" />
      </div>
      <div class="c2 flex-box-sb">
        <div
          v-for="item in sizes"
          class="item"
          :class="{ active: gangSize === item }"
          :key="item"
          @click="gangSize = item"
        >
          {{ item }}x
        </div>
      </div>

      <div class="c3">
        <div class="r1 flex-box-sb">
          <div class="label">{{ $t('h5.yongxu_ganggantiaozhenghoukekai') }}</div>
          <div class="value">{{ usFormat(allKeyongNum) }} {{ name }}</div>
        </div>
        <div class="r1 flex-box-sb">
          <div class="label">{{ $t('h5.yongxu_need_margin') }}</div>
          <div v-if="shiType === 2" class="value">{{ usFormat(buyPrice) }} USDT</div>
          <div v-else class="value">{{ usFormat(chengben) }} USDT</div>
        </div>
      </div>
    </div>

    <div class="submint-btn" @click="onGangConfirm">{{ $t('h5.real.Confirm') }}</div>
  </div>
</template>

<style lang="less" scoped>
.gang-box {
  --van-stepper-background: var(--cb-btnBgc2);
  --van-stepper-button-icon-color: var(--cb-bgc2);
  --van-stepper-background: var(--cb-permarket-btn-bgc);
  --van-stepper-input-height: 40px;
  --van-stepper-input-font-size: 16px;
  padding: 15px;
  font-size: 14px;
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .tool {
    --van-stepper-input-text-color: #28ba98;
    margin-top: 30px;
    .t2 {
      font-size: 15px;
      text-align: center;
      margin-bottom: 20px;
    }
    .c1 {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 80vw;
      margin: 0 auto;
      .count {
        width: 100px;
        text-align: center;
        font-size: 26px;
      }
      .btn {
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 24px;
        color: var(--cb-fColor);
        background-color: var(--cb-btnBgc2);
        border: 1px solid var(--cb-borderColor);
        border-radius: 5px;
        position: relative;
        bottom: 1px;
        .b1 {
          position: relative;
          bottom: 3px;
        }
      }
    }
    .c2 {
      width: calc(100vw - 30px);
      margin-top: 20px;
      overflow-x: scroll;
      flex-wrap: nowrap;
      height: 40px;
      background-color: var(--cb-bgc);
      border: 1px solid var(--cb-borderColor);
      border-radius: 20px;
      .item {
        flex-shrink: 0;
        width: 58px;
        text-align: center;
        color: var(--cb-fColor);
        font-size: 16px;
      }
      .active {
        height: 30px;
        line-height: 30px;
        background-color: var(--cb-btnBgc);
        color: #fff;
        border-radius: 15px;
      }
    }
    .c3 {
      margin-top: 15px;
      padding: 10px 6px;
      border-radius: 5px;
      .label {
        margin: 8px 0;
        color: var(--cb-fColor3);
      }
      .value {
        color: var(--cb-fColor2);
      }
    }
  }
  .tool2 {
    --van-stepper-input-text-color: var(--cb-fColor);
  }
  .submint-btn {
    margin-top: 40px;
    background-color: var(--cb-btnBgc);
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 35px;
    font-size: 16px;
    color: #fff;
    width: calc(100vw - 30px);
    box-sizing: border-box;
  }
}
</style>
