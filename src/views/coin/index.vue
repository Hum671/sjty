<script setup lang="ts" name="keepAliveCoin">
import router from '@/router'
import { showToast } from 'vant/es'
import Decimal from 'decimal.js'

import LeftSearch from './components/LeftSearch.vue'
import RealtimeRecords from './components/RealtimeRecords.vue'

import { sessionCache } from '@/utils/cache'
import { formatNumber } from '@/utils/utils'
import { confirm } from '@/utils/dialog'

import { useCoinMarketStore } from '@/stores/coinMarket'
import { useUserStore } from '@/stores/user'

import { coinTrade } from '@/api/order'
import { SUCCESS_CODE } from '@/api/model/BaseModel'

import type { CoinCoinItem } from '@/api/market/model/MarketModel'

let isInitDefualtCurrency = false
const coinCoinKey = 'SESSION_SYMBOLS_COIN_COIN_SYMBOL'
const userStore = useUserStore()
const coinMarketStore = useCoinMarketStore()

const isShowLeftSearch = ref(false)
const i18n = useI18n()
const { coinList, marketDepthList, isCoinWebsocketConnSuccess } = storeToRefs(coinMarketStore)
const { userCoinBalance } = storeToRefs(userStore)
const currencyMarket = ref<CoinCoinItem>()
const currencyMarketData = ref<CoinCoinItem>()
const isBuy = ref(false)

const buyNumber = ref<string | number>(0)
const dealBalance = ref(0)
const stepRate = ref('')
const direction = ref(1) // 1-买入 2-卖出
const type = ref(2) // 1-限价 2-市价
const buyPrice = ref(0) // 购买价
const unit = ref('USDT')
const loading = ref(false)

const rateList = [10, 25, 50, 75, 100]

// 余额
const balance = computed(() => {
  if (!userCoinBalance.value || !currencyMarket.value) {
    return 0
  }

  if (direction.value === 1) {
    const find = userCoinBalance.value.find((item) => item.coin === 'USDT')
    unit.value = 'USDT'
    return find?.number ?? 0
  }

  const find = userCoinBalance.value.find(
    (item) => `${item.coin.toLowerCase()}usdt` === currencyMarket.value.symbol,
  )
  unit.value = currencyMarket.value.symbol.replace('usdt', '').toUpperCase()
  return find?.number ?? 0
})

// 购买价格变化
watch(buyPrice, () => {
  if (direction.value === 1) {
    // 买入
    if (stepRate.value) {
      const p = new Decimal(buyPrice.value)

      const dealBalanceDecimal = new Decimal(dealBalance.value)
      buyNumber.value = Number(dealBalanceDecimal.div(p).toDecimalPlaces(8))
    } else {
      handleDealBalance()
    }
  } else {
    // 卖出
    handleDealBalance()
  }
})

// 购买数量变化
watch(buyNumber, () => {
  if (direction.value === 1 && !stepRate.value) {
    // 买入
    handleDealBalance()
  }

  if (direction.value === 2 && !stepRate.value) {
    // 卖出
    handleDealBalance()
  }
})

watch(type, () => {
  buyNumber.value = 0
  dealBalance.value = 0
})

watch(direction, () => {
  buyNumber.value = 0
  dealBalance.value = 0
})

watch(coinList, () => {
  handleInit()
  handleCurrencyMarketData()
})

// 行情深度
watch(isCoinWebsocketConnSuccess, () => {
  if (isCoinWebsocketConnSuccess.value && currencyMarket?.value?.symbol) {
    handleMarketDepth()
  }
})
watch(currencyMarket, (val, oldVal) => {
  if (oldVal?.symbol && val.symbol === oldVal.symbol) {
    return
  }

  if (isCoinWebsocketConnSuccess.value && val?.symbol) {
    if (oldVal?.symbol) {
      coinMarketStore.unsubMarketDepth(oldVal.symbol) // 取消之前的订阅
    }
    handleMarketDepth()
  }

  buyPrice.value = val.data?.tick.lastPrice
})

onMounted(() => {
  if (!userCoinBalance.value) {
    userStore.requestUserCoinBalance()
  }
})

onActivated(() => {
  handleInit()
  userStore.requestUserCoinBalance()
})

onUnmounted(() => {
  if (!currencyMarket.value?.symbol) {
    return
  }
  coinMarketStore.unsubMarketDepth(currencyMarket.value.symbol)
})

function handleDealBalance() {
  if (!buyNumber.value || !buyPrice.value) {
    dealBalance.value = 0
    return
  }

  const n = new Decimal(buyNumber.value)
  const p = new Decimal(buyPrice.value ?? 0)
  dealBalance.value = Number(n.times(p).toDecimalPlaces(8))
}

function handleInit() {
  if (isInitDefualtCurrency || !coinList.value) {
    return
  }

  const sessionCurrencyMarket = sessionCache.getCache(coinCoinKey)
  if (sessionCurrencyMarket) {
    currencyMarket.value = sessionCurrencyMarket
    return
  }

  currencyMarket.value = coinList.value[0]
  isInitDefualtCurrency = true
}

function handleCurrencyMarketData() {
  if (currencyMarket.value && coinList.value) {
    currencyMarketData.value = coinList.value.find(
      (item) => item.symbol === currencyMarket.value.symbol,
    )

    if (type.value === 2 && currencyMarketData.value) {
      buyPrice.value = currencyMarketData.value?.data?.tick?.lastPrice ?? 0
    }
  }
}

function handleMarketDepth() {
  coinMarketStore.subMarketDepth(currencyMarket.value.symbol)
}

function handleCurrencyItem(data) {
  isShowLeftSearch.value = false
  currencyMarket.value = data
  sessionCache.setCache(coinCoinKey, data)
  handleCurrencyMarketData()
}

function updateBalance() {
  userStore.requestUserBalance()
}

function handleBlur() {
  if (buyNumber.value === '') {
    buyNumber.value = 0
  }
}

function handleFocus() {
  stepRate.value = ''
  if (Number(buyNumber.value) === 0) {
    buyNumber.value = ''
  }
}

function handleBuyNumberStep(rate) {
  const r = new Decimal(rate / 100)
  const b = new Decimal(balance.value)
  const p = new Decimal(buyPrice.value)

  stepRate.value = r.toString()

  if (direction.value === 1) {
    // 买入
    dealBalance.value = Number(b.times(r).toDecimalPlaces(8))

    const dealBalanceDecimal = new Decimal(dealBalance.value)
    buyNumber.value = Number(dealBalanceDecimal.div(p).toDecimalPlaces(8))
  } else {
    // 卖出
    buyNumber.value = Number(r.times(b).toDecimalPlaces(8))

    const buyNumberDecimal = new Decimal(buyNumber.value ?? 0)
    dealBalance.value = Number(buyNumberDecimal.times(p).toDecimalPlaces(8))
  }
}

function handleSubmit() {
  if (buyPrice.value <= 0) {
    showToast(i18n.t('h5.common.loading'))
    return
  }

  if (Number(buyNumber.value) <= 0) {
    showToast(i18n.t('h5.coin.error_buy'))
    return
  }

  confirm('h5.contract.index.confirm_buy').then(() => {
    const find = coinList.value.find((item) => item.name === currencyMarket.value.name)

    loading.value = true
    coinTrade({
      coinId: find.id,
      type: unref(type.value),
      price: unref(buyPrice.value),
      number: Number(unref(buyNumber.value)),
      direction: unref(direction.value),
      usdt: unref(dealBalance.value),
      stepRate: unref(stepRate.value),
    })
      .then((res) => {
        if (res.code === SUCCESS_CODE) {
          showToast(i18n.t('h5.contract.index.buy_success'))
          isBuy.value = true
          buyNumber.value = 0
          dealBalance.value = 0
          userStore.requestUserCoinBalance()
        } else {
          showToast(i18n.t(res.msg))
        }
      })
      .finally(() => {
        loading.value = false
      })
  })
}
</script>

<template>
  <div class="contract">
    <div class="header">
      <div class="left">
        <div class="icon" @click="isShowLeftSearch = true">
          <span class="u-icon__icon uicon-list-dot u-iconfont"></span>
        </div>
        <div class="currency">
          {{ `${currencyMarket?.name ?? '-'}/USDT` }}
        </div>
        <div
          class="tag"
          :class="coinMarketStore.handlePriceColor(currencyMarketData?.data?.tick ?? null)"
        >
          {{ coinMarketStore.handlePriceChangePercent(currencyMarketData?.data?.tick ?? null) }}
        </div>
      </div>
      <div class="right">
        <div class="download icon" @click="router.push('/coin/records')">
          <span class="u-icon__icon uicon-order u-iconfont"></span>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="transaction">
        <div class="left">
          <div class="item title-item">
            <div class="item-left">
              <div>{{ $t('h5.contract.index.price') }}</div>
              <div>[USDT]</div>
            </div>
            <div class="item-right">
              <div>{{ $t('h5.contract.index.number') }}</div>
              <div>[{{ currencyMarket?.name ?? '-' }}]</div>
            </div>
          </div>

          <template v-if="marketDepthList">
            <template v-for="(item, index) of marketDepthList?.asks ?? []">
              <div v-if="index < 8" :key="`${JSON.stringify(item)}-${index}`" class="item red-item">
                <div class="item-left">{{ item?.[0] ?? 0.0 }}</div>
                <div class="item-right">{{ Number(formatNumber(item?.[1] ?? 0.0, 8)) }}</div>
              </div>
            </template>

            <div
              class="item current-price"
              :class="coinMarketStore.handlePriceColor(currencyMarketData?.data?.tick ?? null)"
            >
              {{ currencyMarketData?.data?.tick.lastPrice ?? '0.0000' }}
            </div>

            <template v-for="(item, index) of marketDepthList?.bids ?? []">
              <div v-if="index < 8" :key="`${JSON.stringify(item)}-${index}`" class="item">
                <div class="item-left">{{ item?.[0] ?? 0.0 }}</div>
                <div class="item-right">{{ Number(formatNumber(item?.[1] ?? 0.0, 8)) }}</div>
              </div>
            </template>
          </template>
          <div v-else>
            <van-skeleton-paragraph v-for="item of 7" :key="item" />
            <div>
              <van-skeleton-paragraph />
            </div>
            <van-skeleton-paragraph v-for="item of 7" :key="item" />
          </div>
        </div>

        <div class="right">
          <div class="btn-group">
            <div class="btn-left" :class="{ active: direction === 2 }" @click="direction = 2">
              {{ $t('h5.coin.sell') }}
            </div>
            <div class="btn-right" :class="{ active: direction === 1 }" @click="direction = 1">
              {{ $t('h5.coin.buy') }}
            </div>
          </div>

          <div class="tabs">
            <div :class="{ active: type === 1 }" @click="type = 1">
              {{ $t('h5.coin.limit_price') }}
            </div>
            <div :class="{ active: type === 2 }" @click="type = 2">
              {{ $t('h5.coin.market_price') }}
            </div>
          </div>

          <div class="input-item">
            <div>{{ $t('h5.contract.index.price') }}</div>
            <div class="input-box">
              <input :disabled="type === 2" v-model="buyPrice" />
            </div>
          </div>

          <div class="input-item">
            <div>{{ $t('h5.contract.index.number') }}</div>
            <div class="input-box">
              <input v-model="buyNumber" @blur="handleBlur" @focus="handleFocus" />
              <div class="suffix">{{ currencyMarket?.name ?? '' }}</div>
            </div>
          </div>

          <div class="balance-rate-list">
            <div
              v-for="rate of rateList"
              :key="rate"
              class="item"
              @click="handleBuyNumberStep(rate)"
            >
              {{ `${rate}%` }}
            </div>
          </div>

          <div class="balance">
            <div class="left">{{ $t('h5.contract.index.balance') }}</div>
            <div class="right">{{ Number(balance) }}{{ unit }}</div>
          </div>

          <div class="balance deal-number">
            <div class="left">{{ $t('h5.coin.deal_number') }}</div>
            <div class="right">{{ dealBalance }}USDT</div>
          </div>

          <van-button
            :loading="loading"
            type="primary"
            size="normal"
            class="submit-btn"
            :color="direction === 1 ? '#28ba98' : '#f04a5a'"
            @click="handleSubmit"
          >
            {{ direction === 1 ? $t('h5.coin.buy') : $t('h5.coin.sell') }}
          </van-button>
        </div>
      </div>

      <div class="line"></div>

      <div class="realtime-record">
        <div class="table">
          <div class="table-header table-item">
            <div>{{ $t('h5.common.type') }}</div>
            <div>{{ $t('h5.contract.index.price') }}</div>
            <div>{{ $t('h5.contract.index.number') }}</div>
            <div>{{ $t('h5.common.status') }}</div>
          </div>

          <RealtimeRecords :is-buy="isBuy" @close="isBuy = false" @updateBalance="updateBalance" />
        </div>
      </div>
    </div>

    <van-popup
      v-model:show="isShowLeftSearch"
      position="left"
      round
      :style="{ width: '80%', height: '100%' }"
    >
      <LeftSearch @on-back="isShowLeftSearch = false" @on-item="handleCurrencyItem" />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.contract {
  .header {
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    position: sticky;
    top: 0;
    background: white;
    z-index: 999;

    @size: 19.5px;
    .icon {
      font-size: @size;
      width: @size;
      img {
        width: 100%;
      }
      &.download {
        font-size: 20px;
      }
    }
    .left,
    .right {
      display: flex;
      align-items: center;
      gap: 13px;
    }
    .left {
      gap: 8px;
      display: flex;
      align-items: center;
      .currency {
        font-size: 19px;
      }
      .tag {
        font-size: 13.5px;
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

  .contract-min-k-line {
    margin-bottom: 20px;
  }

  .container {
    @green-color: #00c572;
    @red-color: #ff4834;

    .transaction {
      padding: 10px 10px 20px;
      padding-top: 0;
      display: flex;
      gap: 10px;
      .left {
        flex: 3;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          font-size: 11px;
          .item-left {
            color: @green-color;
          }
          .item-right {
            color: #1e1e1e;
            background-color: #d9fde0;
          }
          .item-left,
          .item-right {
            padding: 1px 2px;
          }
        }
        .title-item {
          .item-left,
          .item-right {
            color: #848598;
            background-color: white;
          }
        }
        .current-price {
          color: #848598;
          font-size: 19px;
          font-weight: 700;
          margin: 10px 0;
          &.red {
            color: @red-color;
          }
          &.green {
            color: @green-color;
          }
        }
        .red-item {
          .item-left {
            color: @red-color;
          }
          .item-right {
            background-color: #fdd7d6;
          }
        }
      }
      .right {
        flex: 5;
        .btn-group {
          display: flex;
          div {
            flex: 1;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 5px;
            background-size: 100% 100%;
          }
          .btn-left {
            background-image: url('@/assets/images/btn-left.png');
            &.active {
              background-image: url('@/assets/images/btn-left-active.png');
              color: white;
            }
          }
          .btn-right {
            background-image: url('@/assets/images/btn-right.png');
            &.active {
              background-image: url('@/assets/images/btn-right-active.png');
              color: white;
            }
          }
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin: 15px 0;
          div {
            color: #848598;
          }
          .active {
            color: #28ba98;
            font-weight: 700;
          }
        }

        .input-item {
          margin-top: 15px;
        }

        .input-box {
          height: 34px;
          margin: 5px 0;
          display: flex;
          background-color: #f7f8fb;
          padding: 0 10px;
          align-items: center;
          justify-content: space-between;
          input {
            appearance: none; /* 移除默认样式 */
            border: none; /* 移除边框 */
            outline: none; /* 移除轮廓 */
            background: none; /* 移除背景 */
            flex: 1;
            font-size: 13px;
          }
          .suffix {
            font-weight: 500;
            color: #555;
            font-size: 14px;
          }
        }

        .balance-rate-list {
          display: flex;
          gap: 5px;
          margin: 10px 0;
          font-size: 12px;
          div {
            flex: 1;
            background-color: #f7f8fb;
            border-radius: 3px;
            text-align: center;
            padding: 5px 0;
          }
        }

        .balance {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #848598;
          .right {
            text-align: right;
            font-size: 14px;
            color: #555;
          }
        }

        .deal-number {
          margin-top: 50px;
        }

        .submit-btn {
          margin-top: 10px;
          width: 100%;
        }
      }
    }

    .line {
      width: 100%;
      height: 10px;
      background-color: #f6f7fb;
    }

    .realtime-record {
      .table {
        .table-item {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1.8fr 1fr;
          padding: 15px 0;
          & > div {
            text-align: center;
            opacity: 0.9;
          }
          &.table-header {
            color: #848598;
            font-size: 11px;
            border-bottom: 1px solid #e9e9e9;
            padding: 10px 0;
          }
        }
      }
    }
  }
}
</style>
