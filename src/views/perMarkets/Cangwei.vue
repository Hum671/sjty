<script setup lang="ts">
import { closePositionApi } from '@/api/market'
import type { CurrentPositionItem, ClosePositionParam } from '@/api/market/model/MarketModel'
import { useMarketStore } from '@/stores/market'
import { useCurrencyStore } from '@/stores/currency'
import { confirm } from '@/utils/dialog'
import { showToast } from 'vant'
import { getIconImage, getCoinNameBySymbol, usFormat } from '@/utils/utils'
import { useUserStore } from '@/stores/user'
// 全仓（合约账号所有钱作为保证金）
// 逐仓（单独的保证金）
// 默认保证金：持仓量 * 开仓价格 / 杠杆倍数
// 仓位方向：做多时仓位方向为+1，做空时仓位方向为-1
// 收益额 = 仓位方向 * (当前价格 - 开仓均价) * 持仓量
// 收益率 = 收益额 / 保证金 * 100%
// 强平价格 = 平仓价格 - 保证金 / (仓位方向 * 持仓量) * 0.995 (千分之5的手续费)
// 最大仓位 = 合约账户金额 * 杠杆倍数 / 币种价格
// 维持保证金率 = 维持保证金 / 持仓量 / 当前市场价格
const emit = defineEmits<{
  (e: 'onUpdate'): void
}>()

const props = defineProps<{
  componentsKey?: string
  gangSize: number | string
  loading: boolean
  list: CurrentPositionItem[]
}>()

const { t } = useI18n()
const marketStore = useMarketStore()
const currencyStore = useCurrencyStore()
const userStore = useUserStore()
const { symbolPriceMap } = storeToRefs(marketStore)
const { symbolCoinNameMap } = storeToRefs(currencyStore)
const showYinsunPop = ref(false)
const yingsunInfo = ref()
const showPingPop = ref(false)
const pingCangInfo = ref()

// 收益额 = 仓位方向(注釋：開多開空) * (当前价格 - 开仓均价) * 持仓量
function getPrice(item: CurrentPositionItem) {
  const cangwei = item.direction
  const chicangliang = Number(item.number)
  const kaicangjunjia = Number(item.openPrice)

  return cangwei * (symbolPriceMap.value.get(item.currency) - kaicangjunjia) * chicangliang || 0
}

// 收益率 = 收益额 / 保证金 * 100%
function getPricePercent(item: CurrentPositionItem) {
  const price = getPrice(item)
  const baozhengjin = Number(item.margin)
  return (price / baozhengjin) * 100 || 0
}

// 维持保证金率 = 维持保证金 / 持仓量 / 当前市场价格
function getKeepMarginPercent(item: CurrentPositionItem) {
  const baozhengjin = Number(item.margin) // 维持保证金
  const chicangliang = Number(item.number)
  const currentPrice = symbolPriceMap.value.get(item.currency)

  return ((baozhengjin / chicangliang / currentPrice) * 100).toFixed(5)
}

// 强平价格 = 平仓价格 - 保证金 / (仓位方向 * 持仓量) * 0.995 (千分之5的手续费)
function getQiangPingPrice(item: CurrentPositionItem) {
  const FEE = 0.995

  const kaicangjunjia = Number(item.openPrice)
  const cangwei = item.direction
  const baozhengjin = Number(item.margin)
  const chicangliang = Number(item.number)

  return kaicangjunjia - (baozhengjin / (cangwei * chicangliang)) * FEE || 0
}

function getColorClass(item: CurrentPositionItem) {
  const price = getPrice(item)
  if (price < 0) {
    return 'red'
  } else {
    return 'green'
  }
}

// 一鍵平倉
function onAllpingClick() {
  confirm('h5.yongxu_yijianping_warn').then(() => {})
}

// 止盈止損
function onZhiyiClick(item: CurrentPositionItem) {
  showYinsunPop.value = true
  yingsunInfo.value = item
}

// 市價全平
function onShiPingClick(item: CurrentPositionItem) {
  const data: ClosePositionParam = {
    currency: item.currency,
    direction: item.direction,
    number: Number(item.number),
    orderType: 1, // 1-市价 2-限价
    lever: item.lever,
  }

  const text = t('h5.yongxu_shijiapingcang_warn', {
    coinnam: getCoinNameBySymbol(item.currency),
    direction: item.direction === 1 ? t('h5.yongxu_duo') : t('h5.yongxu_kong'),
    gangsize: `${item.lever}x`,
  })

  confirm(text).then(() => {
    closePositionApi(data)
      .then((res) => {
        if (res.code === 200) {
          userStore.requestUserBalance()
        } else {
          showToast(t(res.msg))
        }
      })
      .catch(() => {
        showToast(t('h5.yongxu_pingcang_erro'))
      })
      .finally(() => {
        emit('onUpdate')
      })
  })
}

function onPingClick(item: CurrentPositionItem) {
  showPingPop.value = true
  pingCangInfo.value = item
}

function handleYinsunUpdata() {
  showYinsunPop.value = false
  emit('onUpdate')
}

function handleCangUpdata() {
  showPingPop.value = false
  pingCangInfo.value = {}
  emit('onUpdate')
}
</script>

<template>
  <div class="cangwei-box">
    <template v-if="list.length > 0">
      <!-- <div class="allpingbtn" @click="onAllpingClick">{{ $t('h5.yongxu_yijianping') }}</div> -->
      <div v-for="item in list" class="item" :key="item.id + item.type">
        <div class="top flex-box-sb">
          <div class="flex-box-nm">
            <img :src="getIconImage(item.currency)" alt="" />
            <div class="title">
              {{ getCoinNameBySymbol(item.currency) }}
            </div>
          </div>
        </div>

        <div class="r2 flex-box-nm">
          <div v-if="item.direction === 1" class="label green">{{ $t('h5.yongxu_duo') }}</div>
          <div v-else class="label red">{{ $t('h5.yongxu_kong') }}</div>
          <div v-if="item.type === 2" class="label black">{{ $t('h5.yongxu_quancang') }}</div>
          <div v-else class="label black">{{ $t('h5.yongxu_zhucang') }}</div>
          <div class="label black">{{ item.lever }}x</div>
          <div class="time">{{ item.createTime }}</div>
        </div>

        <div class="r3">
          <div>
            <div class="label">{{ $t('h5.yongxu_shouyie') }}(USDT)</div>
            <div class="value" :class="getColorClass(item)">
              {{ usFormat(getPrice(item).toFixed(5)) }}
            </div>
          </div>
          <div></div>
          <div class="i3">
            <div class="label">{{ $t('h5.contract.index.profit') }}</div>
            <div class="value" :class="getColorClass(item)">
              {{ usFormat(getPricePercent(item).toFixed(2)) }}%
            </div>
          </div>
          <div>
            <div class="label">
              {{ $t('h5.yongxu_chicanglaing') }}({{ symbolCoinNameMap.get(item.currency) }})
            </div>
            <div class="value">{{ usFormat(item.number) }}</div>
          </div>
          <div class="i2">
            <div class="label">{{ $t('h5.yongxu_baozhengjin') }}(USDT)</div>
            <div class="value">{{ usFormat(Number(item.margin).toFixed(2)) }}</div>
          </div>
          <div class="i3">
            <div class="label">{{ $t('h5.yongxu_baozhengjin_lv') }}</div>
            <div class="value">{{ usFormat(getKeepMarginPercent(item)) }}%</div>
          </div>
          <div>
            <div class="label">{{ $t('h5.yongxu_kaicangjunjia') }}</div>
            <div class="value">{{ usFormat(item.openPrice) }}</div>
          </div>
          <div class="i2">
            <div class="label">{{ $t('h5.yongxu_biaojijiage') }}</div>
            <div class="value">{{ usFormat(symbolPriceMap.get(item.currency)) }}</div>
          </div>
          <div class="i3">
            <div class="label">{{ $t('h5.yongxu_yuguqiangpingjia') }}</div>
            <div class="value">
              {{ getQiangPingPrice(item) ? usFormat(getQiangPingPrice(item).toFixed(8)) : '--' }}
            </div>
          </div>
        </div>

        <div class="r4">
          <div class="btn" @click="onZhiyiClick(item)">{{ $t('h5.yongxu_yingsun') }}</div>
          <div class="btn" @click="onPingClick(item)">{{ $t('h5.yongxu_pingcang') }}</div>
          <div class="btn" @click="onShiPingClick(item)">
            {{ $t('h5.yongxu_shijiaquanping') }}
          </div>
        </div>
      </div>
    </template>
    <Empty v-else class="empty" />

    <van-popup v-model:show="showYinsunPop" position="bottom" round closeable>
      <YingSun :info="yingsunInfo" @on-update="handleYinsunUpdata" />
    </van-popup>

    <van-popup v-model:show="showPingPop" position="bottom" round closeable>
      <PingCang :info="pingCangInfo" :showPingPop="showPingPop" @on-update="handleCangUpdata" />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.cangwei-box {
  @green: #00c572;
  @red: #f04a5a;
  @pd: 15px;

  position: relative;
  min-height: calc(100dvh - 500px);
  color: var(--cb-fColor3);
  // background-color: var(--cb-bgc3);
  padding-bottom: 50px;
  box-sizing: border-box;
  .red {
    color: @red !important;
  }
  .green {
    color: @green !important;
  }
  .black {
    color: var(--cb-fColor);
  }
  .allpingbtn {
    padding: 8px 4px;
    border: 1px solid var(--cb-borderColor);
    background-color: var(--cb-btnBgc);
    color: var(--cb-fColor);
    width: 120px;
    margin-left: auto;
    margin-top: 10px;
    margin-right: 10px;
    border-radius: 5px;
    text-align: center;
  }
  .item {
    padding: 10px 15px 6px;
    border-bottom: 1px solid var(--cb-borderColor);
    .top {
      margin-bottom: 6px;
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 5px;
      }
      .title {
        font-size: 12px;
        // color: #000;
      }
      .btn {
        padding: 5px 8px;
        border: 1px solid var(--cb-borderColor);
        background-color: var(--cb-btnBgc);
        color: var(--cb-fColor);
        border-radius: 5px;
      }
    }
    .r2 {
      .label {
        margin-right: 10px;
      }
    }
    .r3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(100px, 1fr));
      gap: 10px;
      justify-content: space-between;
      width: 100%;
      margin-top: 10px;
      padding-bottom: 4px;
      flex-shrink: 0;
      .label {
        margin-bottom: 5px;
      }
      .value {
        color: var(--cb-fColor2);
      }
      .i2 {
        .value,
        .label {
          text-align: center;
        }
      }
      .i3 {
        .value,
        .label {
          text-align: right;
        }
      }
    }

    .r4 {
      display: grid;
      grid-template-columns: repeat(3, minmax(50px, 1fr));
      gap: 10px;
      justify-content: space-between;
      width: 100%;
      margin: 15px 0 10px;
      flex-shrink: 0;
      .btn {
        padding: 8px 4px;
        border: 1px solid var(--cb-borderColor);
        background-color: var(--cb-bgc2);
        color: var(--cb-fColor);
        border-radius: 5px;
        text-align: center;
      }
    }
  }
  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .block {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
