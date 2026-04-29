<script setup lang="ts" name="KeepAlivePerMarketsView">
import { showToast } from 'vant/es'
import { sessionCache } from '@/utils/cache'
import {
  getToken,
  getIconImage,
  formatNumber,
  formataFix2,
  usFormat,
  formatInputUs,
  parseFormatInputUsNumber,
} from '@/utils/utils'
import { options } from '@/hooks/useKMarketHook'
import useMarketHook from '@/hooks/useMarketHook'

import { useMarketStore } from '@/stores/market'
import { useUserStore } from '@/stores/user'

import { getDepthList } from '@/api/market'
import type { CoinTradeParams } from '@/api/order/model/orderModel'
import { coinTrade } from '@/api/order'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import CONST from '@/const/index'

const props = defineProps<{
  componentsKey?: string
}>()

const COMPONENTKEY = 'SPerMarketsView'
let initSubSuccess = false
let initCurrencySuccess = false

const route = useRoute()
const router = useRouter()
const marketStore = useMarketStore()
const userStore = useUserStore()
const showMinKLine = ref(false)
const showBigKline = ref(false)
const { t } = useI18n()
const { currencyMarketDataList, handlePriceChangePercent, handlePriceColor } = useMarketHook()
const { usdtContractBalance, contractBalance } = storeToRefs(userStore)
const {
  optionIndex,
  isWebsocketConnSuccess,
  newKLineData,
  kline24HData,
  isGetKLineDataListFinish,
} = storeToRefs(marketStore)
const isUpdataRecord = ref(true)
const loading = ref(true)
const isBuying = ref(false)
const isLogin = ref(false)
const layoutCount = ref(0)
const cangtabRef = ref()
const query = ref({
  name: '',
  subName: '',
  id: 0,
  symbol: '',
  isMarketClose: 0,
})
const showShijiaPopover = ref(false)
const shijiaActions = ref([
  { name: 'h5.yongxu_shijia', type: 2, color: '#7691e2' },
  { name: 'h5.yongxu_xianjia', type: 1, color: '#97a3b6' },
])
const shiType = ref(shijiaActions.value[0])
const buyType = ref<1 | 2>(1)
const buyPrice = ref<number | string | null>(0)
const buyPriceUs = ref<string>('0')
const buyNum = ref()
const buyNumUs = ref()
const sliderRef = ref()
const showCount = ref(5)
const listInfo = ref<{ asks: string[]; bids: string[] }>()
const keyongBalance = computed(() => {
  if (buyType.value === 1) {
    return Number(usdtContractBalance.value || 0)
  }
  if (buyType.value === 2) {
    const findItem = contractBalance.value?.find(
      (item) => item.type === query.value?.name.toLowerCase(),
    )
    return findItem ? Number(findItem.number || 0) : 0
  }

  return 0
})

const keMaiBalance = computed(() => {
  let price: any
  if (shiType.value.type === 2) {
    // 市價
    price = newKLineData.value?.price
  }
  if (shiType.value.type === 1) {
    // 限價
    price = buyPrice.value
  }

  if (buyType.value === 1) {
    return Number(formatNumber(keyongBalance.value / price, 8)) || 0
  }

  if (buyType.value === 2) {
    return Number(formatNumber(keyongBalance.value * price, 8)) || 0
  }

  return 0
})

let intervalTimer: any

watch(
  () => [props.componentsKey, route.path],
  () => {
    if (props.componentsKey === COMPONENTKEY && route.path === '/newContract') {
      getBalance()
      handleInit()

      // 重置數據
      buyPrice.value = null
      buyPriceUs.value = ''
      buyNum.value = null
      buyNumUs.value = ''
    } else {
      // 重置數據
      buyPrice.value = null
      buyPriceUs.value = ''
      buyNum.value = 0
      buyNumUs.value = '0'
      // 暫停接口調用
      if (intervalTimer) {
        clearInterval(intervalTimer)
        intervalTimer = null
      }
    }
  },
  {
    immediate: true,
  },
)

watch(buyPriceUs, () => {
  buyPrice.value = parseFormatInputUsNumber(buyPriceUs.value)
})

watch(buyNumUs, () => {
  buyNum.value = parseFormatInputUsNumber(buyNumUs.value)
})

watch(buyNum, () => {
  if (buyNum.value === '0%' || buyNum.value === '0' || !buyNum.value) {
    sliderRef.value.reset()
  }
  if (buyNum.value === '0%') {
    buyNum.value = '0'
    buyNumUs.value = '0'
  }
})

watch(isWebsocketConnSuccess, () => {
  if (!initCurrencySuccess) {
    return
  }
  handleInitSubKLine()
})

watch(query, (value, oldValue) => {
  if (!value.symbol || !oldValue.symbol) {
    return
  }
  loading.value = true
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
  getBalance()
})

function getBalance() {
  isLogin.value = !!getToken()
  if (getToken()) {
    userStore.requestUserBalance()
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
  initCurrencySuccess = true

  getDepthInfo(currentCurrency.symbol)
  handleInitSubKLine()
}

// 处理请求深度信息
function getDepthInfo(symbol: string) {
  getDepthFnc(symbol)
  if (!intervalTimer) {
    intervalTimer = setInterval(() => {
      getDepthFnc(symbol)
    }, 1000)
  }
}

function getDepthFnc(symbol: string) {
  getDepthList(symbol).then((res) => {
    if (res.code === 200) {
      const list = res.data
      const asks = list.asks.sort((a, b) => a - b)
      const bids = list.bids.sort((a, b) => b - a)
      listInfo.value = { asks, bids }
    }
  })
}

function handleInitSubKLine() {
  if (initSubSuccess || !isWebsocketConnSuccess.value) {
    return
  }
  initSubSuccess = true
  loading.value = true
  marketStore.subKLineData(
    query.value.symbol,
    options[optionIndex.value].key,
    options[optionIndex.value].size,
  )
}

function handleShowMinKLine() {
  if (showMinKLine.value) {
    showMinKLine.value = false
    return
  }

  if (!query.value?.symbol) {
    showToast(t('h5.common.loading'))
    return
  }

  showMinKLine.value = true
}

function handleShowBigKLine() {
  if (showBigKline.value) {
    showBigKline.value = false
    return
  }

  if (!query.value?.symbol) {
    showToast(t('h5.common.loading'))
    return
  }

  showBigKline.value = true
}

function getBuyNum(): number {
  if (!buyNum.value || buyNum.value === '0' || buyNum.value === '0%') {
    return 0
  }

  // 購買數量
  if (buyNum.value.includes('%')) {
    // 購買比例
    const buyNumPercent = Number((Number(buyNum.value.replace('%', '')) / 100).toFixed(8))

    // 按百分比計算出的數量
    return Number(Number(formatNumber(keyongBalance.value * buyNumPercent, 8)).toFixed(8))
  } else {
    // 直接輸入的數量
    return Number(buyNum.value)
  }
}

function onSubmit() {
  const buyNumber = getBuyNum()
  if (buyNumber > keyongBalance.value) {
    showToast(t('h5.withdraw.balance_insufficient'))
    return
  }

  const data: CoinTradeParams = {
    direction: buyType.value, // 1-买入 2-卖出
    coinName: query.value.name,
    number: buyNumber.toString(), // 买入传USDT，卖出传卖出的币种数量
    type: shiType.value.type,
    symbol: query.value.symbol,
  }

  // 限价委托
  if (shiType.value.type === 1) {
    data.price = buyPrice.value?.toString()
  }

  isBuying.value = true
  coinTrade(data)
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        // 更新資產
        userStore.requestUserBalance()
        // 更新記錄
        cangtabRef.value.updateList()
        isUpdataRecord.value = !isUpdataRecord.value
        // 重置参数
        buyNum.value = null
        buyNumUs.value = ''
        // 把价格恢复到市价
        onCurrentPriceClick()
      } else {
        showToast(t(res.msg))
      }
    })
    .finally(() => {
      isBuying.value = false
    })
}

function handleBgWidth(list, item) {
  return `${(item[1] / list[0][1]) * 100}%`
}

function onShiTypeClick(_, index) {
  const selectColor = '#7691e2'
  const defaultColor = '#97a3b6'

  shijiaActions.value?.forEach((item, indey) => {
    if (index === indey) {
      item.color = selectColor
      shiType.value = item
    } else {
      item.color = defaultColor
    }
  })

  buyPrice.value = newKLineData.value?.price || null
  buyPriceUs.value = newKLineData.value?.price ? formatInputUs(newKLineData.value?.price) : null
}

function handleSliderChange(sliderNum: number) {
  buyNum.value = `${sliderNum}%`
}

function onNumFocus() {
  if (buyNum.value && buyNum.value.includes('%')) {
    buyNum.value = null
    buyNumUs.value = ''
  }
}

function onLayoutChange() {
  layoutCount.value++
  if (layoutCount.value === 3) {
    layoutCount.value = 0
    showCount.value = 5
  } else {
    showCount.value = 10
  }
}

function formatter(val: number | string): string {
  const value = String(val)

  // 正则：匹配整数、小数和百分比格式
  const regex = /^(\d+(\.\d*)?|\.\d+)(%?)$/

  if (regex.test(value) || value === '') {
    return value
  }
  return value.slice(0, -1)
}

function onBuyTypeClick(type: 1 | 2) {
  buyType.value = type
  buyNum.value = 0
  buyNumUs.value = '0'
}

function onRecordClick() {
  router.push('/allrecord?type=spotRecord')
}

function onCurrentPriceClick() {
  buyPrice.value = Number(newKLineData.value?.price || 0)
  buyPriceUs.value = newKLineData.value?.price ? formatInputUs(newKLineData.value?.price) : '0'
}
</script>

<template>
  <div class="sp-contract">
    <div class="header">
      <div class="left-currency" @click="router.replace('/markets')">
        <div v-if="query?.name" class="flex-box-nm">
          <img :src="getIconImage(query?.name)" alt="" />
          <div class="angle">
            {{ `${query.name}${query.subName ? '/' + query.subName : ''}` }}
          </div>
        </div>
        <div v-else>-/-</div>
      </div>

      <div class="right">
        <!-- <span class="icon u-icon__icon uicon-order u-iconfont" @click="onRecordClick"></span> -->
        <div class="download icon big" @click="handleShowBigKLine">
          <img src="@/assets/images/market.png" />
        </div>
        <div class="download icon mini" @click="handleShowMinKLine">
          <span
            class="u-icon__icon u-iconfont"
            :class="showMinKLine ? 'uicon-arrow-up' : ' uicon-arrow-down'"
          ></span>
        </div>
      </div>
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
        <span v-if="query.isMarketClose === 1" class="close-market">
          {{ $t('h5.contract.Closed') }}
        </span>
      </div>
    </div>

    <div v-if="query?.symbol && showMinKLine" class="contract-min-k-line">
      <MinKMarket :symbol="query.symbol" />
    </div>
    <div v-if="query?.symbol && showBigKline" class="contract-min-k-line">
      <BigKLine :symbol="query.symbol" @close="showBigKline = false" />
    </div>

    <div class="container">
      <div class="transaction">
        <div class="left">
          <div class="item title-item">
            <div class="item-left">
              <div>{{ $t('h5.contract.index.price') }}</div>
              <div>[{{ query?.subName ?? 'USDT' }}]</div>
            </div>
            <div class="item-right">
              <div>{{ $t('h5.contract.index.number') }}</div>
              <div>[{{ query?.name ?? '-' }}]</div>
            </div>
          </div>
          <template v-if="listInfo?.asks?.length > 0">
            <template v-if="layoutCount !== 2">
              <div
                v-for="(item, index) of listInfo?.asks.slice(0, showCount) ?? []"
                :key="`Buy-${index}`"
                class="item"
              >
                <div class="item-left green">{{ item?.[0] ? usFormat(item?.[0]) : 0.0 }}</div>
                <div class="item-right">{{ item?.[1] ? usFormat(item?.[1]) : 0.0 }}</div>
                <div
                  class="item-green-bg"
                  :style="{ width: handleBgWidth(listInfo?.asks ?? [], item) }"
                ></div>
              </div>
            </template>

            <div class="flex-box-sb" @click="onCurrentPriceClick">
              <div
                class="item current-price"
                :class="handlePriceColor(kline24HData)"
                key="current-price"
              >
                {{ newKLineData?.price ? usFormat(newKLineData?.price) : '0.00' }}
              </div>
              <div class="gray">
                ≈${{ newKLineData?.price ? usFormat(newKLineData?.price?.toFixed(2)) : '0.00' }}
              </div>
            </div>

            <template v-if="layoutCount !== 1">
              <div
                v-for="(item, index) of listInfo?.bids.slice(0, showCount) ?? []"
                :key="`Sell-${index}`"
                class="item"
              >
                <div class="item-left red">{{ item?.[0] ? usFormat(item?.[0]) : 0.0 }}</div>
                <div class="item-right">{{ item?.[1] ? usFormat(item?.[1]) : 0.0 }}</div>
                <div
                  class="item-red-bg"
                  :style="{ width: handleBgWidth(listInfo?.bids ?? [], item) }"
                ></div>
              </div>
            </template>
            <div class="tool" @click="onLayoutChange">
              <img
                v-show="layoutCount === 0"
                src="@/assets/images/direction1.svg"
                alt=""
                class="icon"
              />
              <img
                v-show="layoutCount === 1"
                src="@/assets/images/direction2.svg"
                alt=""
                class="icon"
              />
              <img
                v-show="layoutCount === 2"
                src="@/assets/images/direction3.svg"
                alt=""
                class="icon"
              />
            </div>
          </template>
          <div v-else>
            <van-skeleton-paragraph v-for="item of showCount" :key="item" />
            <van-skeleton-paragraph v-for="item of showCount" :key="item" />
          </div>
        </div>

        <div class="right">
          <div class="mai-btn-box flex-box-sb">
            <div class="maibtn" :class="{ maiactive: buyType === 1 }" @click="onBuyTypeClick(1)">
              {{ $t('h5.coin.buy') }}
            </div>
            <div class="maibtn" :class="{ maiactive1: buyType === 2 }" @click="onBuyTypeClick(2)">
              <span>{{ $t('h5.coin.sell') }}</span>
            </div>
          </div>

          <div class="shi-btn rectangle" @click="showShijiaPopover = true">
            {{ $t(shiType.name) }}
          </div>

          <div class="num-box">
            <van-cell-group inset>
              <van-field
                v-if="shiType.type === 1"
                v-model="buyPriceUs"
                input-align="right"
                :label="$t('h5.contract.index.price')"
                :formatter="formatInputUs"
              >
                <template #right-icon>
                  <span>{{ 'USDT' }}</span>
                </template>
              </van-field>
              <van-field
                v-else
                disabled
                input-align="right"
                :value="newKLineData?.price"
                :label="$t('h5.contract.index.price')"
              >
                <template #right-icon>
                  <span class="disableprice">{{ usFormat(newKLineData?.price) }}</span>
                  <span>{{ 'USDT' }}</span>
                </template>
              </van-field>
            </van-cell-group>
          </div>
          <div class="num-box">
            <van-cell-group inset>
              <van-field
                v-if="buyNum?.toString()?.includes('%')"
                v-model="buyNum"
                input-align="right"
                :label="$t(buyType === 1 ? 'h5.coin.money' : 'h5.contract.index.number')"
                :formatter="formatter"
                @focus="onNumFocus"
              >
                <template #right-icon>
                  <span>{{ buyType === 1 ? 'USDT' : query.name }}</span>
                </template>
              </van-field>
              <van-field
                v-else
                v-model="buyNumUs"
                input-align="right"
                :label="$t(buyType === 1 ? 'h5.coin.money' : 'h5.contract.index.number')"
                :formatter="formatInputUs"
                @focus="onNumFocus"
              >
                <template #right-icon>
                  <span>{{ buyType === 1 ? 'USDT' : query.name }}</span>
                </template>
              </van-field>
            </van-cell-group>
          </div>

          <div class="slider">
            <Slider ref="sliderRef" @on-change="handleSliderChange" />
          </div>

          <div class="kaicang">
            <template v-if="buyType === 1">
              <div class="balance flex-box-sb">
                <div class="label">{{ $t('h5.purchaseGold.Available') }}</div>
                <div class="value">{{ formataFix2(keyongBalance) }} USDT</div>
              </div>

              <div class="kaiduo flex-box-sb">
                <div class="label">
                  {{ $t('h5.contract.market.spot.can_buy') }}
                </div>
                <div class="value">{{ formataFix2(keMaiBalance) }} {{ query.name }}</div>
              </div>
            </template>
            <template v-if="buyType === 2">
              <div class="balance flex-box-sb">
                <div class="label">{{ $t('h5.purchaseGold.Available') }}</div>
                <div class="value">
                  {{ formataFix2(keyongBalance) }}
                  {{ query.name }}
                </div>
              </div>

              <div class="kaiduo flex-box-sb">
                <div class="label">
                  {{ $t('h5.contract.market.spot.can_sell') }}
                </div>
                <div class="value">{{ formataFix2(keMaiBalance) }} USDT</div>
              </div>
            </template>

            <!-- <div class="flex-box-sb">
              <div class="label">{{ $t('h5.yongxu_chengben') }}</div>
              <div v-if="shiType.type === 2" class="value">{{ chengben }} USDT</div>
              <div v-else class="value">{{ chengben }} USDT</div>
            </div> -->

            <van-button
              v-if="buyType === 1"
              :disabled="!getBuyNum() || isBuying || !isGetKLineDataListFinish"
              :loading="isBuying"
              class="duobtn"
              @click="onSubmit"
            >
              {{ $t('h5.coin.buy') }} {{ query.name }}
            </van-button>
            <van-button
              v-if="buyType === 2"
              :disabled="!getBuyNum() || isBuying || !isGetKLineDataListFinish"
              :loading="isBuying"
              class="kongbtn duobtn"
              @click="onSubmit"
            >
              {{ $t('h5.coin.sell') }} {{ query.name }}
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <SpotRecordTab
      ref="cangtabRef"
      :gangSize="1"
      :is-login="isLogin"
      :componentKey="props.componentsKey"
    />
    <!-- <div class="top-title flex-box-sb">
      <div class="flex-box-nm">
        {{ $t('h5.market.order_history') }}
        <img src="@/assets/images/redo.svg" alt="" @click="isUpdataRecord = !isUpdataRecord" />
      </div>
      <div class="record" @click="onRecordClick">
        <span class="u-icon__icon uicon-order u-iconfont"></span>
      </div>
    </div>

    <SPerMarketRecord :isUpdata="isUpdataRecord" :componentKey="componentsKey" /> -->

    <van-action-sheet
      v-model:show="showShijiaPopover"
      :actions="shijiaActions"
      close-on-click-action
      :cancel-text="$t('h5.common.cancel')"
      @select="onShiTypeClick"
    >
      <template #action="{ action }">{{ $t(action.name) }}</template>
    </van-action-sheet>
  </div>
</template>

<style lang="less" scope>
.sp-contract {
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100 - 51px);
  background: var(--cb-bgc5);
  width: 100%;
  font-size: 12px;
  .top-title {
    padding: 16px 12px;
    font-size: 15px;
    background-color: var(--cb-bgc);
    border-bottom: 1px solid var(--cb-borderColor2);
    img {
      margin-left: 10px;
    }
    .record {
      font-size: 16px;
    }
  }
  :deep(.van-field__control) {
    text-align: right;
  }
  .split {
    height: 16px;
  }
  .left-currency {
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
  .usd {
    padding: 10px;
    font-size: 12px;
    .float {
      gap: 5px;
      font-size: 16px;
      span {
        font-size: 13px;
        color: #919fac;
      }
    }
    .close-market {
      margin-left: 5px;
      color: #919fac;
      font-style: 400;
      font-size: 22px;
    }
  }
  .header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    // background: var(--cb-bgc4);
    border-bottom: 1px solid var(--cb-borderColor2);
    color: var(--cb-fColor);
    font-weight: bold;
    @size: 18px;
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
      &.big {
        img {
          margin-top: 6px;
          width: 14px !important;
        }
      }
    }
    .left,
    .right {
      display: flex;
      align-items: center;
      gap: 13px;
      .icon {
        color: var(--cb-fColor2);
      }
      .mini {
        color: var(--cb-fColor);
      }
    }

    .left {
      height: 100%;
      display: flex;
      justify-content: space-evenly;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      color: var(--cb-fColor6);
      font-size: @size;
      margin-top: 20px;

      .current-price {
        font-size: 24px;
        .currency {
          font-size: 16px;
          img {
            margin-right: 5px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .contract-min-k-line {
    margin-bottom: 10px;
    box-sizing: border-box;
  }
  .red {
    color: #f04a5a;
  }
  .green {
    color: #00c572;
  }
  .container {
    @green-color: #00c572;
    @red-color: #f04a5a;
    // background-color: var(--cb-bgc4);
    .transaction {
      padding: 10px;
      padding-top: 0;
      display: flex;
      gap: 10px;
      border-bottom: 1px solid var(--cb-borderColor2);
      .left {
        flex: 3;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          height: 24px;
          position: relative;
          overflow: hidden;
          .item-left {
            color: var(--cb-fColor);
          }
          .green {
            color: @green-color;
          }
          .red {
            color: @red-color;
          }
          .item-right {
            color: var(--cb-fColor);
            opacity: 0.75;
            text-align: right;
          }
          .item-left,
          .item-right {
            padding: 1px 5px;
          }
          .item-red-bg,
          .item-green-bg {
            position: absolute;
            background-color: @green-color;
            opacity: 0.2;
            width: 30%;
            height: 24px;
            right: 0;
            transition: width 0.5s ease;
          }
          .item-red-bg {
            background-color: @red-color;
          }
        }

        .title-item {
          padding-top: 5px;
          margin-bottom: 5px;
          .item-left,
          .item-right {
            opacity: 0.6;
            padding: 0;
          }
        }
        .current-price {
          font-size: 15px;
          font-weight: 700;
          margin: 10px 0;
        }
        .tag {
          color: #848598;
          font-size: 14px;
          font-weight: 700;
          &.green {
            color: #00c572;
          }
          &.red {
            color: #f04a5a;
          }
        }
        .tool {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .icon {
          margin-top: 10px;
          width: 30px;
          height: 30px;
          border: 2px solid var(--cb-bgc);
          border-radius: 5px;
        }
        .all-icon {
          background-position: -66px 0;
        }
        .buy-icon {
          background-position: -327px 0;
        }
        .sell-icon {
          background-position: -196px 0;
        }
      }
      .right {
        width: 50%;
        color: var(--cb-fColor3);
        .btns {
          display: flex;
          align-items: center;
          text-align: center;
          height: 30px;
          line-height: 30px;
          // background-color: var(--cb-btnBgc2);
          border: 1px solid var(--cb-borderColor2);
          border-radius: 20px;
          .btn {
            flex: 1;
            height: 100%;
            border-radius: 20px;
          }
          .selected {
            background-color: var(--cb-btnBgc);
            color: #fff;
          }
        }
        .cangbtn {
          // margin-top: 10px;
          position: relative;
          padding: 0 8px;
          flex: 1;
          // background-color: var(--cb-bgc2);
          border: 1px solid var(--cb-borderColor2);
          height: 30px;
          line-height: 30px;
          border-radius: 6px;
        }
        .gangbtn {
          // margin-top: 10px;
          margin-left: 5px;
          position: relative;
          padding: 0 26px 0 8px;
          // background-color: var(--cb-bgc2);
          border: 1px solid var(--cb-borderColor2);
          height: 30px;
          line-height: 30px;
          border-radius: 6px;
          span {
            margin-right: 3px;
            color: var(--cb-fColor);
          }
        }
        .rectangle {
          &:before {
            content: '';
            position: absolute;
            top: 52%;
            right: 10px;
            transform: translateY(-50%);
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid var(--cb-fColor);
          }
        }
        .mai-btn-box {
          height: 30px;
          line-height: 30px;
          border-radius: 5px;
          border: 1px solid var(--cb-borderColor2);
          overflow: hidden;
          .maibtn {
            flex: 1;
            text-align: center;
            border-radius: 5px;
          }
          .maiactive {
            background-color: @green-color;
            color: #fff;
          }
          .maiactive1 {
            background-color: @red-color;
            color: #fff;
          }
        }
        .shi-btn {
          position: relative;
          height: 30px;
          line-height: 30px;
          margin-top: 5px;
          // background-color: var(--cb-bgc2);
          border: 1px solid var(--cb-borderColor2);
          border-radius: 5px;
          padding: 0 8px;
        }
        .num-box {
          --van-field-label-width: 30px;
          --van-cell-vertical-padding: 0px;
          --van-cell-horizontal-padding: 0px;
          --van-cell-group-inset-padding: 0px;
          --van-cell-group-background: var(--cb-bgc2);
          // --van-cell-background: var(--cb-bgc2);
          --van-field-input-text-color: var(--cb-fColor);
          --van-cell-font-size: 12px;
          --van-field-label-color: var(--cb-fColor3);
          --van-field-input-disabled-text-color: var(--cb-fColor);
          --van-field-label-width: auto;
          display: flex;
          align-items: center;
          margin-top: 5px;
          height: 30px;
          // background-color: var(--cb-bgc2);
          border: 1px solid var(--cb-borderColor2);
          border-radius: 5px;
          padding: 0 8px;
          .disableprice {
            color: var(--cb-fColor);
            margin-right: 8px;
          }
        }
        .slider {
          margin: 0 auto;
          width: calc(50vw - 24px);
        }
        .kaicang {
          margin-top: 40px;
          .balance {
            margin-bottom: 8px;
          }
          .value {
            text-align: right;
            color: var(--cb-fColor);
          }
          .kaiduo {
            margin-bottom: 10px;
          }

          .duobtn {
            margin: 25px 0 12px;
            height: 30px;
            width: 100%;
            border: none;
            line-height: 30px;
            text-align: center;
            color: #fff;
            border-radius: 5px;
            background-color: @green-color;
          }
          .kongbtn {
            height: 30px;
            line-height: 30px;
            width: 100%;
            border: none;
            text-align: center;
            color: #fff;
            border-radius: 5px;
            background-color: @red-color;
          }
        }
      }
    }
  }
}
</style>
