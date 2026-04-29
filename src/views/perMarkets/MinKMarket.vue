<script setup lang="ts">
import useKMarketHook, { options } from '@/hooks/usePerKMarketHook'
import { useMarketStore } from '@/stores/market'

const props = defineProps<{
  symbol: string
}>()

const marketStore = useMarketStore()
const { kLineContainer, createKLineChart } = useKMarketHook()
const { optionIndex, kLineDataList, newKLineData } = storeToRefs(marketStore)
const loading = ref(false)
const chart = ref()

watch(
  () => [props.symbol, kLineDataList.value, chart.value],
  () => {
    if (!props.symbol) {
      return
    }
    loading.value = true
    if (kLineDataList.value.length > 0) {
      const data = kLineDataList.value.map((item) => ({
        timestamp: item.id,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.vol,
        turnover: ((item.open + item.high + item.low + item.close) / 4) * item.vol,
      }))
      chart.value?.applyNewData(data, true)
      loading.value = false
    }
  },
  {
    immediate: true,
  },
)

watch(optionIndex, (value) => {
  if (!props.symbol) {
    return
  }

  loading.value = true
  marketStore.subKLineData(props.symbol, options[value].key, options[value].size)
})

watch(newKLineData, (value) => {
  // 获取最后kLineDataList的时间戳
  if (!kLineDataList.value) {
    return
  }

  if (value && chart.value) {
    const lastData = kLineDataList.value[kLineDataList.value.length - 1]
    const kUpdateLineData = {
      timestamp: lastData.id,
      open: value.open,
      high: value.high,
      low: value.low,
      close: value.close,
      volume: value.vol,
      turnover: ((value.open + value.high + value.low + value.close) / 4) * value.vol,
    }
    chart.value.updateData(kUpdateLineData)
  }
})

onMounted(() => {
  if (!chart.value) {
    chart.value = createKLineChart(true)
  }
})
</script>

<template>
  <div class="min-k-market">
    <div class="kline-box">
      <div class="options">
        <div
          v-for="(item, index) in options"
          :key="item.key"
          class="item"
          :class="{ active: index === optionIndex }"
          @click="optionIndex = index"
        >
          {{ item.name }}
        </div>
      </div>
      <div ref="kLineContainer" class="render-kline" :class="{ loading: loading }">
        <van-loading v-if="loading" class="block" type="spinner" color="#7691e2" vertical />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.min-k-market {
  background-color: var(--cb-bgc3);
  height: 200px;
  overflow-y: auto;
  color: #848598;

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
      height: 160px;
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
