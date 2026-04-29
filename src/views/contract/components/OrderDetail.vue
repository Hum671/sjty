<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getOrderDetilas } from '@/api/order'
import useMarketHook from '@/hooks/useMarketHook'

import type { OrderRecordItem } from '@/api/order/model/orderModel'
import { convertSeconds, usFormat } from '@/utils/utils'

const props = defineProps<{
  id: number
  show: boolean
}>()

defineEmits<{
  (e: 'onClose'): void
}>()

const { currencyMarketDataList } = useMarketHook()

let oldId = 0
let timer = 0
const data = ref<OrderRecordItem>()
const time = ref(0)
const loading = ref(false)
const loadingFlag = ref(false)
const isHide = ref(false)

watch(
  () => props.id,
  () => {
    handleInit()
  },
)

watch(
  () => props.show,
  (val) => {
    if (!val) {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  },
)

watch(currencyMarketDataList, (value) => {
  if (!data.value) {
    return
  }
  const find = value.find((item) => item.symbol === data.value.symbol)
  if (find) {
    data.value = {
      ...data.value,
      currentPrice: String(find.data?.Price),
    }
  }
})

onMounted(() => {
  isHide.value = false
  handleInit()
  document.addEventListener('visibilitychange', handleVisibility)
})

onUnmounted(() => {
  clearInterval(timer)
  document.removeEventListener('visibilitychange', handleVisibility)
})

function handleVisibility() {
  clearInterval(timer)
  if (document.visibilityState === 'hidden') {
    isHide.value = true
  } else {
    oldId = 0
    handleDetails()
  }
}

function handleInit() {
  loading.value = true
  clearInterval(timer)
  handleDetails()
}

function handleDetails() {
  if (oldId === props.id) {
    getOrderDetilas(props.id).then((res) => {
      if (res.code === SUCCESS_CODE && res.data.status === 2) {
        oldId = 0
        data.value = res.data
        handleTime()
        loading.value = false
      } else {
        setTimeout(() => {
          handleDetails()
        }, 1000)
      }
    })
    return
  }

  getOrderDetilas(props.id).then((res) => {
    if (res.code === SUCCESS_CODE) {
      oldId = props.id
      data.value = res.data
      handleTime()
      loading.value = false
    }
  })
}

function handleTime() {
  let timing = isHide.value
    ? data.value.time + Number(data.value.buyTime) - Number(data.value.currentTime)
    : data.value.time

  if (data.value.time >= 3600) {
    time.value = convertSeconds(data.value.time)
  } else {
    time.value = timing
  }

  clearInterval(timer)
  timer = setInterval(() => {
    timing--

    if (timing <= 0 && data.value.status === 1) {
      timing = 0
      if (!loadingFlag.value) {
        loading.value = true
      }
      loadingFlag.value = true
      handleDetails()
    }

    if (data.value.time >= 3600) {
      time.value = convertSeconds(data.value.time)
    } else {
      time.value = timing
    }
  }, 1000)
}
</script>

<template>
  <div class="order-detail">
    <template v-if="!loading && data">
      <div class="o-header">
        <div class="timer-box">
          <div v-if="data.status === 1" class="time">{{ time }}</div>
          <div v-else class="time" :class="Number(data.gain) > 0 ? 'green-bg' : 'red-bg'">
            <img src="@/assets/images/y.png" />
          </div>
        </div>
        <div class="close-icon">
          <van-icon name="cross" @click="$emit('onClose')" />
        </div>
      </div>

      <div class="o-list">
        <div class="item">
          <div class="name">{{ $t('h5.contract.index.trading_pair') }}</div>
          <div class="value">{{ `${data.name}/${data.subName}` }}</div>
        </div>
        <div class="item">
          <div class="name">{{ $t('h5.contract.index.direction') }}</div>
          <div class="value">
            <span v-if="data.direction === 1" class="green">
              {{ $t('h5.contract.index.rise') }}
            </span>
            <span v-if="data.direction === 2" class="red">
              {{ $t('h5.contract.index.decline') }}
            </span>
          </div>
        </div>
        <div class="item">
          <div class="name">{{ $t('h5.contract.index.buy_price') }}</div>
          <div class="value">{{ usFormat(data.buyPrice) }}</div>
        </div>

        <template v-if="data.status === 1">
          <div class="item">
            <div class="name">{{ $t('h5.contract.index.current_price') }}</div>
            <div class="value">{{ usFormat(data.currentPrice) || 0 }}</div>
          </div>
          <div class="item">
            <div class="name">{{ $t('h5.contract.index.profit') }}</div>
            <div class="value">{{ `${data.profit}%` }}</div>
          </div>
          <div class="item">
            <div class="name">{{ $t('h5.contract.index.number') }}</div>
            <div class="value">{{ usFormat(data.number) }}U</div>
          </div>
        </template>

        <template v-else>
          <div class="item">
            <div class="name">{{ $t('h5.contract.index.close_price') }}</div>
            <div class="value">{{ usFormat(data.closePrice) }}</div>
          </div>
          <div class="item">
            <div class="name">{{ $t('h5.contract.index.buy_number') }}</div>
            <div class="value">{{ usFormat(data.number) }}U</div>
          </div>
          <div class="item">
            <div class="name">{{ $t('h5.contract.record.gain_loss') }}</div>
            <div class="value">
              <span v-if="Number(data.gain) === 0">0</span>
              <span v-else-if="Number(data.gain) > 0" class="green">
                {{ `+${usFormat(data.gain)}` }}
              </span>
              <span v-else class="red">{{ usFormat(data.gain) }}</span>
            </div>
          </div>
        </template>
      </div>

      <div class="btn" @click="$emit('onClose')">
        {{ $t('h5.contract.index.continue_trading') }}
      </div>
    </template>
    <div v-else class="loading">
      <div>{{ $t('h5.common.loading') }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.order-detail {
  width: 100%;
  min-height: 280px;
  padding: 20px 15px 30px;
  box-sizing: border-box;
  color: var(--cb-fColor);
  .o-header {
    position: relative;
    .timer-box {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      .time {
        @size: 70px;
        height: @size;
        width: @size;
        background-color: var(--cb-btnBgc);
        border-radius: 50%;
        color: white;
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 26px;
          height: 20px;
        }
        &.green-bg {
          background-color: #00c572;
        }
        &.red-bg {
          background-color: #ff4834;
        }
      }
    }
    .close-icon {
      color: var(--cb-fColor);
      position: absolute;
      top: 0;
      right: 0;
      font-size: 18px;
    }
  }
  .o-list {
    margin-top: 15px;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--cb-borderColor2);
      .name {
        color: var(--cb-fColor6);
      }
      .value {
        font-weight: 700;
      }
    }
  }
  .btn {
    background-color: var(--cb-btnBgc);
    color: white;
    height: 40px;
    line-height: 40px;
    border-radius: 22px;
    text-align: center;
    margin-top: 20px;
  }
  .loading {
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
