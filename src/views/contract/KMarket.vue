<script setup lang="ts" name="keepAliveKMarket">
import useKMarketHook, { options } from '@/hooks/useKMarketHook'
import useCustomizedHook from '@/hooks/useCustomizedHook'
import useMarketHook from '@/hooks/useMarketHook'
import { type IIndicatorItem, useIndicatorStore } from '@/stores/indicator'
import { useMarketStore } from '@/stores/market'
import { sessionCache } from '@/utils/cache'
import { getIconImage, getToken, usFormat } from '@/utils/utils'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import DetailBuyNew from './components/DetailBuyNew.vue'
import CONST from '@/const/index'

const props = withDefaults(
  defineProps<{
    componentsKey?: string
    isAddTypeOutside?: boolean
  }>(),
  {
    isAddTypeOutside: true,
  },
)

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const marketStore = useMarketStore()
const userStore = useUserStore()
const COMPONENTKEY = 'KMarket'
const { currencyMarketDataList, handlePriceChangePercent, handlePriceColor } = useMarketHook()
const { kLineContainer, createKLineChart, destroyInstance, updateChartHeight } = useKMarketHook()
const { isExistSymbol, setSymbol } = useCustomizedHook()
const indicatorStore = useIndicatorStore()

const {
  optionIndex,
  isWebsocketConnSuccess,
  kLineDataList,
  newKLineData,
  kline24HData,
  requestMarketKLineLoading,
  isGetKLineDataListFinish,
} = storeToRefs(marketStore)
const showOrderDetail = ref(false)
const detailId = ref(0)
const countTime = ref(0)
const showBuyContaner = ref(false)
const showBigKline = ref(false)
const isUpdataRecord = ref(false)
const isEmpty = computed(() => {
  return (
    !requestMarketKLineLoading.value && (!kLineDataList.value || kLineDataList.value.length === 0)
  )
})
const chechInditorList = ref<IIndicatorItem[]>([])
const chart = ref()

let initSubSuccess = false
let initCurrencySuccess = false

const query = ref({
  name: '',
  subName: '',
  id: 0,
  symbol: '',
  isMarketClose: 0,
})
const isSelected = ref(false)

watch(
  () => props.componentsKey,
  () => {
    if (props.componentsKey === COMPONENTKEY) {
      createKline(kLineDataList.value)
    }
    if (props.componentsKey !== COMPONENTKEY && chart.value) {
      destroyInstance(chart.value)
      chart.value = null
    }
  },
)

watch(optionIndex, (value) => {
  if (!query.value.symbol) {
    return
  }

  isSelected.value = isExistSymbol(query.value.symbol)
  marketStore.subKLineData(query.value.symbol, options[value].key, options[value].size)
})

watch(isWebsocketConnSuccess, () => {
  if (!initCurrencySuccess) {
    return
  }
  handleInitSubKLine()
})

watch(
  () => [kLineDataList.value],
  () => {
    if (COMPONENTKEY === props.componentsKey) {
      createKline(kLineDataList.value)
    }
  },
)

watch(newKLineData, (value) => {
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
    chart.value.resize()
  }
})

watch(query, (value, oldValue) => {
  if (!value.symbol || !oldValue.symbol) {
    return
  }
  marketStore.subKLineData(
    value.symbol,
    options[optionIndex.value].key,
    options[optionIndex.value].size,
  )
})

watch(currencyMarketDataList, () => {
  if (initCurrencySuccess) {
    return
  }
  handleInit()
})

onMounted(() => {
  handleInit()
})
onActivated(() => {
  handleInit()
})

function createKline(dataList) {
  if (dataList.length > 0) {
    if (!chart.value) {
      chart.value = createKLineChart(true, true)
    }

    const data = dataList.map((item) => ({
      timestamp: item.id,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.vol,
      turnover: ((item.open + item.high + item.low + item.close) / 4) * item.vol,
    }))
    chart.value.applyNewData(data, true)
    // chart.value.resize()
  }
}

function onIndicatorClick(type: IIndicatorItem) {
  if (!chart.value) return

  const indicatorHeight = 100

  if (chechInditorList.value.includes(type)) {
    chechInditorList.value = chechInditorList.value.filter((item) => item !== type)
    chart.value.removeIndicator(type, { id: type, height: indicatorHeight })
  } else {
    chechInditorList.value.push(type)
    chart.value.createIndicator(type, Boolean(props.isAddTypeOutside), {
      id: type,
      height: indicatorHeight,
    })
  }

  if (!props.isAddTypeOutside) {
    updateChartHeight(
      chart.value,
      kLineContainer.value,
      chechInditorList.value.length,
      indicatorHeight,
    )
  }
}

function handleInit() {
  if (currencyMarketDataList.value.length === 0) {
    return
  }

  const sessionCurrencyMarket = sessionCache.getCache(CONST.CONTRACTKEY)
  const currentCurrency = sessionCurrencyMarket ?? currencyMarketDataList.value[0]
  query.value = {
    subName: currentCurrency.subName,
    name: currentCurrency.name,
    symbol: currentCurrency.symbol,
    id: currentCurrency.id,
    isMarketClose: currentCurrency.isMarketClose,
  }
  isSelected.value = isExistSymbol(query.value.symbol)
  initCurrencySuccess = true
  optionIndex.value = 0
  handleInitSubKLine()
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

function handleCollect() {
  setSymbol(query.value.symbol)
  isSelected.value = !isSelected.value
}

// buy
function handleBuy() {
  if (!getToken()) {
    router.push('/login')
    return
  }
  if (query.value?.isMarketClose === 1) {
    showToast(t('h5.contract.Currently_close'))
    return
  }
  userStore.requestUserBalance()
  showBuyContaner.value = true
}

function handleSuccess(id: number, time: number) {
  detailId.value = id
  showBuyContaner.value = false
  showOrderDetail.value = true
  isUpdataRecord.value = !isUpdataRecord.value

  countTime.value = time
}
</script>

<template>
  <div class="k-market" :class="{ isTab: route.name === 'ContractView' }">
    <div class="price-box">
      <div class="left">
        <div class="currency" @click="router.replace('/markets')">
          <div v-if="query?.name" class="flex-box-nm">
            <img :src="getIconImage(query?.name)" alt="" />
            <div class="angle">
              {{ `${query.name}${query.subName ? '/' + query.subName : ''}` }}
            </div>
          </div>
          <div v-else>-/-</div>
        </div>
        <div class="current-price">
          <span :class="handlePriceColor(kline24HData)">
            {{ newKLineData?.price ? usFormat(newKLineData?.price) : '0.00' }}
          </span>
          <span v-if="query.isMarketClose === 1" class="close-market">
            {{ $t('h5.contract.Closed') }}
          </span>
        </div>
        <div class="usd">
          <div class="float flex-box-nm" :class="handlePriceColor(kline24HData)">
            {{ handlePriceChangePercent(kline24HData ?? 0) }}
            <img
              v-if="handlePriceColor(kline24HData) === 'green'"
              src="@/assets/images/icon-up.svg"
              alt=""
            />
            <img
              v-if="handlePriceColor(kline24HData) === 'red'"
              src="@/assets/images/icon-down.svg"
              alt=""
            />
            <span>
              ≈${{ newKLineData?.price ? usFormat(newKLineData?.price.toFixed(2)) : '0.00' }}
            </span>
          </div>
        </div>
      </div>
      <div class="right">
        <div>
          <span>{{ `24h ${$t('h5.market.24h_zuigao')}` }}</span>
          <span class="number green">
            {{ kline24HData?.high ? usFormat(kline24HData?.high) : '0.00' }}
          </span>
        </div>
        <div>
          <span>{{ `24h ${$t('h5.market.24h_zuidi')}` }}</span>
          <span class="number red">
            {{ kline24HData?.low ? usFormat(kline24HData?.low) : '0.00' }}
          </span>
        </div>
        <div>
          <span>{{ $t('h5.home.24hchengjiao') }}</span>
          <span class="number white">
            {{ kline24HData?.vol ? usFormat(kline24HData?.vol) : '0.00' }}
          </span>
        </div>
      </div>
    </div>

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
      <Empty v-if="isEmpty" class="empty" />
      <div
        ref="kLineContainer"
        class="render-kline"
        :class="{ loading: requestMarketKLineLoading }"
      >
        <van-loading
          v-if="requestMarketKLineLoading"
          class="block"
          type="spinner"
          color="#7691e2"
          vertical
        />
      </div>
    </div>

    <div class="indi-list flex-box-sb">
      <div
        v-for="item in indicatorStore.indicatorList"
        class="item"
        :class="{ active: chechInditorList.includes(item) }"
        :key="item"
        @click.stop="onIndicatorClick(item)"
      >
        {{ item }}
      </div>
      <img src="@/assets/images/market.png" @click="showBigKline = true" />
    </div>

    <div v-if="!isEmpty && isGetKLineDataListFinish" class="btn-group">
      <div class="btn-increase" @click="handleBuy">{{ $t('h5.contract.market.begin_buy') }}</div>
    </div>

    <MarketRecord
      :isUpdata="isUpdataRecord"
      :countTime="countTime"
      :components-key="componentsKey"
    />

    <!-- <van-popup
      v-model:show="isShowSettings"
      position="bottom"
      :style="{ borderRadius: '5px 5px 0 0' }"
      safe-area-inset-bottom
    >
      <Indicator
        :kline-instnce="chart"
        :kline-ref="kLineContainer"
        @on-close="isShowSettings = false"
      />
    </van-popup> -->

    <van-popup
      v-model:show="showBuyContaner"
      :style="{ borderRadius: '5px 5px 0 0' }"
      position="bottom"
      safe-area-inset-bottom
    >
      <DetailBuyNew
        :query="query"
        :showBuyContaner="showBuyContaner"
        :data="newKLineData"
        @on-close="showBuyContaner = false"
        @handle-success="handleSuccess"
      />
    </van-popup>

    <van-popup
      v-model:show="showOrderDetail"
      :style="{ width: '90%', borderRadius: '5px' }"
      :close-on-click-overlay="false"
      safe-area-inset-bottom
    >
      <OrderDetail :id="detailId" :show="showOrderDetail" @on-close="showOrderDetail = false" />
    </van-popup>

    <div v-if="query?.symbol && showBigKline" class="contract-min-k-line">
      <BigKLine :symbol="query.symbol" @close="showBigKline = false" />
    </div>
  </div>
</template>

<style scoped lang="less">
// 根据路由适配样式
.isTab {
  padding-top: 0 !important;
}
.setIcon {
  display: none;
}
.k-market {
  height: calc(100dvh - 51px);
  height: calc(-webkit-fill-available - 51px);
  height: calc(var(--vh, 1vh) * 100 - 51px);
  padding-top: 50px;
  padding-bottom: 80px;
  box-sizing: border-box;
  overflow-y: auto;
  .currency {
    font-size: 16px;
    font-weight: 400;
    color: var(--cb-fColor);
    img {
      margin-right: 5px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .angle {
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--cb-fColor);
        position: absolute;
        top: 50%;
        right: -20px;
        transform: translateY(-50%);
      }
    }
  }
  .header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    background: var(--cb-bgc3);
    font-weight: bold;
    @size: 16px;
    .currency {
      font-size: 16px;
      z-index: 999;
      font-weight: 400;
      color: var(--cb-fColor2);
      img {
        margin-right: 5px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
    }
    .icon {
      font-size: @size;
      width: @size;
      opacity: 0.75;
      img {
        width: 100%;
      }
      &.download {
        font-size: 16px;
      }
    }
    .left,
    .right {
      display: flex;
      align-items: center;
      gap: 13px;
      color: var(--cb-fColor3);
      font-size: 18px;
      .uicon-order {
        position: relative;
        top: -1px;
        color: var(--cb-fColor2);
      }
      .uicon-star-fill {
        &.selected {
          color: var(--cb-fColor2);
        }
      }
    }
    .left {
      gap: 8px;
      display: flex;
      align-items: center;
      font-size: @size;
      .tag {
        color: #848598;
        &.green {
          color: #00c572;
        }
        &.red {
          color: #ff4834;
        }
      }
    }
  }

  .red {
    color: #ff4834;
  }
  .green {
    color: #00c572;
  }

  .price-box {
    padding: 0 10px;
    height: 140px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      height: 100%;
      display: flex;
      justify-content: space-evenly;
      flex-direction: column;
      color: var(--cb-fColor6);
      .current-price {
        font-size: 24px;
        .currency {
          position: fixed;
          top: 12px;
          right: 12px;
          font-size: 16px;
          z-index: 999;

          img {
            margin-right: 5px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }
        }
        .close-market {
          margin-left: 5px;
          color: #919fac;
          font-style: 400;
          font-size: 22px;
        }
      }
      .usd {
        margin-top: 3px;
        gap: 5px;
        font-size: 12px;
        .float {
          gap: 5px;
          font-size: 16px;
          span {
            font-size: 13px;
            color: #919fac;
          }
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      height: 100%;
      width: 170px;
      color: var(--cb-fColor6);
      & > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        gap: 20px;
      }
      .white {
        color: var(--cb-fColor);
      }
    }
  }

  .kline-box {
    box-sizing: border-box;
    .options {
      height: 30px;
      align-items: center;
      padding: 0 12px;
      border-bottom: 1px solid var(--cb-borderColor2);
      display: flex;
      justify-content: space-between;
      color: #999;
      font-size: 13px;
      .active {
        color: var(--cb-fColor2);
      }
    }

    .empty {
      margin-top: 40%;
    }
    .render-kline {
      position: relative;
      height: calc(100dvh - 352px);
      height: calc(-webkit-fill-available - 352px);
      height: calc(var(--vh, 1vh) * 100 - 394px);
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

  .indi-list {
    padding: 15px;
    gap: 14px;
    .item {
      color: var(--cb-fColor);
    }
    img {
      width: 16px;
    }
    .active {
      color: var(--cb-fColor2);
    }
  }

  .btn-group {
    position: fixed;
    z-index: 2;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    color: white;
    background-color: var(--cb-bgc);
    width: 100vw;
    padding: 10px;
    box-sizing: border-box;
    border-top: 1px solid var(--cb-borderColor2);
    & > div {
      flex: 1;
      background-color: var(--cb-btnBgc);
      height: 45px;
      line-height: 45px;
      text-align: center;
      border-radius: 22px;
      font-size: 14px;
    }
    .btn-decrease {
      background-color: #e85a57;
    }
  }

  .indicator-box {
    background-color: #ff0;
  }
}
</style>
