<script setup lang="ts">
import { options } from '@/hooks/useKMarketHook'
import useMarketHook from '@/hooks/useMarketHook'
import { useMarketStore } from '@/stores/market'
import { useCurrencyStore } from '@/stores/currency'
import { sessionCache } from '@/utils/cache'
import * as echarts from 'echarts'
import CONST from '@/const/index'

const chartDom = ref()
const myChart = ref()

const marketStore = useMarketStore()
const currencyStore = useCurrencyStore()
const { currencyMarketDataList, handlePriceChangePercent, handlePriceColor } = useMarketHook()
const {
  optionIndex,
  isWebsocketConnSuccess,
  kLineDataList,
  kline24HData,
  requestMarketKLineLoading,
} = storeToRefs(marketStore)
const { currencyList } = storeToRefs(currencyStore)
const selectedOption = ref()
const selectedOption2 = ref()

let initSubSuccess = false
let initCurrencySuccess = false

const query = ref({
  name: '',
  subName: '',
  id: 0,
  symbol: '',
  isMarketClose: 0,
})

watch(selectedOption, () => {
  query.value.symbol = selectedOption.value.symbol
  query.value.name = selectedOption.value.name
  query.value.subName = selectedOption.value.subName
})

watch(selectedOption2, () => {
  const findIndex = options.findIndex((item) => item.key === selectedOption2.value.key)
  optionIndex.value = findIndex
})

watch(optionIndex, (value) => {
  if (!query.value.symbol) {
    return
  }

  marketStore.subKLineData(query.value.symbol, options[value].key, options[value].size)
})

watch(isWebsocketConnSuccess, () => {
  if (!initCurrencySuccess) {
    return
  }
  handleInitSubKLine()
})

watch(kLineDataList, () => {
  if (myChart.value) {
    myChart.value.dispose()
    if (chartDom.value) {
      myChart.value = echarts.init(chartDom.value)
    }
  }
  if (kLineDataList.value) {
    setData(kLineDataList.value)
  }
})

watch(
  query,
  (value, oldValue) => {
    if (!value.symbol || !oldValue.symbol) {
      return
    }

    marketStore.subKLineData(
      value.symbol,
      options[optionIndex.value].key,
      options[optionIndex.value].size,
    )
  },
  {
    deep: true,
  },
)

watch(currencyMarketDataList, () => {
  if (initCurrencySuccess) {
    return
  }
  handleInit()
})

watch(
  () => [currencyList.value, query.value],
  () => {
    if (currencyList.value && query.value) {
      const findItem = currencyList.value.list.find((item) => item.symbol === query.value.symbol)

      selectedOption.value = findItem
    }
  },
)

onActivated(() => {
  handleInit()
})

onMounted(() => {
  selectedOption2.value = options[options.length - 1]
  handleInit()
  if (chartDom.value) {
    myChart.value = echarts.init(chartDom.value)
  }
})

function filterLastTenDataByTimeGap(data) {
  const sData = []
  const xData = []
  const type = options[optionIndex.value].name
  // 从数组的最后一个元素开始遍历
  for (let i = data.length - 1; i >= 0; i--) {
    const time = formatterTime(data[i].time, type)
    xData.unshift(time)
    sData.unshift({ value: data[i].open, time })
    if (xData.length >= 8) {
      break
    }
  }
  return [xData, sData]
}

function formatterTime(dateString: string, type: string) {
  const date = new Date(dateString)
  switch (type) {
    case 'Day':
      // 返回 日期和月份，格式为 "YYYY-MM"
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`

    case 'Month':
      // 返回 年和月，格式为 "YYYY-MM"
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`

    default:
      // 返回 时和分，格式为 "HH:mm"
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
}

function setData(list) {
  const [xData, sData] = filterLastTenDataByTimeGap(list)
  const newOption = {
    grid: {
      left: '20%',
      right: '10%',
      bottom: '20%',
      top: '10%',
    },
    xAxis: {
      type: 'category', // 改为 time 类型 category
      data: xData,
      axisLine: { show: false }, // 隐藏 x 轴线
      axisTick: { show: false }, // 隐藏 x 轴刻度
      splitLine: {
        show: true, // 显示虚线网格
        lineStyle: {
          type: 'dashed', // 设置虚线
          color: '#2d2c3d', // 网格线颜色
        },
      },
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false }, // 隐藏 y 轴线
      axisTick: { show: false }, // 隐藏 y 轴刻度
      splitLine: {
        show: true, // 显示虚线网格
        lineStyle: {
          type: 'dashed', // 虚线样式
          color: '#2d2c3d', // 网格线颜色
        },
      },
    },
    series: [
      {
        data: sData, // 数据
        type: 'line',
        connectNulls: false,
        lineStyle: {
          width: 2,
          color: '#62a775',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 197, 114, 0.5)' },
            { offset: 1, color: 'rgba(0, 197, 114, 0)' },
          ]),
        },
        symbol: 'none', // 隐藏数据点
      },
    ],
  }

  myChart.value?.setOption(newOption)
}

function handleInit() {
  if (currencyMarketDataList.value.length === 0) {
    return
  }
  const currentCurrency = getCurrentCurrency()
  query.value = {
    subName: currentCurrency.subName,
    name: currentCurrency.name,
    symbol: currentCurrency.symbol,
    id: currentCurrency.id,
    isMarketClose: currentCurrency.isMarketClose,
  }
  initCurrencySuccess = true
  handleInitSubKLine()
}

function getCurrentCurrency() {
  const sessionCurrencyMarket = sessionCache.getCache(CONST.CONTRACTKEY)

  return sessionCurrencyMarket ?? currencyMarketDataList.value[0]
}

function handleInitSubKLine() {
  if (initSubSuccess || !isWebsocketConnSuccess.value) {
    return
  }
  initSubSuccess = true

  marketStore.subKLineData(
    query.value.symbol,
    options[optionIndex.value].key,
    options[optionIndex.value].size,
  )
}
</script>

<template>
  <div class="trend-box">
    <div class="title">
      <img src="@/assets/images/home-trends.svg" alt="" />
      {{ $t('h5.home.market_trend') }}
    </div>

    <div class="btns flex-box-nm">
      <DropdownBtn
        v-model="selectedOption"
        :options="currencyList?.list || []"
        valueFeild="symbol"
        class="btn-item"
      >
        <template #button>
          <span> {{ selectedOption?.name }}</span>
          <span v-if="selectedOption?.subName">/{{ selectedOption?.subName }}</span>
        </template>
        <template #default="{ option }">
          <div class="custom-dropdown-item">
            <span>{{ option?.name }}</span>
            <span v-if="option?.subName">/{{ option?.subName }}</span>
          </div>
        </template>
      </DropdownBtn>
      <button class="btnss">Month</button>
      <!-- <DropdownBtn v-model="selectedOption2" :options="options" valueFeild="key" class="btn-item">
        <template #button>
          <span> {{ selectedOption2?.name }}</span>
        </template>
        <template #default="{ option }">
          <div class="custom-dropdown-item">
            <span>{{ option?.name }}</span>
          </div>
        </template>
      </DropdownBtn> -->
    </div>

    <div class="desc flex-box-ce">
      <div class="currency">
        <div v-if="query?.name" class="flex-box-nm">
          {{ `${query.name}${query.subName ? '/' + query.subName : ''}` }}
        </div>
        <div v-else>-/-</div>
      </div>
      <div :class="handlePriceColor(kline24HData)">
        {{ handlePriceChangePercent(kline24HData ?? 0) }}
      </div>
    </div>

    <van-loading
      v-show="requestMarketKLineLoading"
      class="render-echart block"
      type="spinner"
      color="#7691e2"
      vertical
    />
    <div ref="chartDom" class="render-echart"></div>
  </div>
</template>

<style lang="less" scoped>
.trend-box {
  background-color: var(--cb-bgc4);
  color: var(--cb-fColor);
  .title {
    padding: 10px 15px;
    font-size: 16px;
    color: var(--cb-fColor6);
    img {
      position: relative;
      top: 4px;
      margin-right: 5px;
    }
  }
  .btnss {
    flex: 1;
    height: 35px;
    line-height: 35px;
    background-color: var(--cb-bgc4);
    color: var(--cb-fColor);
    border: 1px solid var(--cb-borderColor2);
    cursor: pointer;
    font-size: 14px;
    border-radius: 4px;
  }

  .btns {
    margin: 5px 0;
    padding: 0 12px;
    gap: 10px;
    box-sizing: border-box;
    width: 100%;
    .btn-item {
      flex: 1;
    }
  }
  .desc {
    margin: 20px 0 0;
    text-align: center;
    .currency {
      margin-right: 10px;
    }
    .green {
      color: #00c572;
    }
    .red {
      color: #f04a5a;
    }
  }
  .render-echart {
    position: relative;
    height: 240px;
  }
  .block {
    margin-top: 60px;
  }
  .render-kline {
    position: relative;
    height: 300px;
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
</style>
