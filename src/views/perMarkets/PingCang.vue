<script setup lang="ts">
import { closePositionApi } from '@/api/market'
import type { CurrentPositionItem, ClosePositionParam } from '@/api/market/model/MarketModel'
import {
  getIconImage,
  getCoinNameBySymbol,
  usFormat,
  formatInputUs,
  parseFormatInputUsNumber,
} from '@/utils/utils'
import { useMarketStore } from '@/stores/market'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const emit = defineEmits<{
  (e: 'onUpdate'): void
}>()

const props = defineProps<{
  info: CurrentPositionItem
  showPingPop: boolean
}>()

const { t } = useI18n()
const marketStore = useMarketStore()
const userStore = useUserStore()
const { symbolPriceMap, hasDataChange } = storeToRefs(marketStore)
const price = ref()
const priceUs = ref()
const shiPrice = ref()
const sliderRef = ref()
const shiType = ref<1 | 2>(1)
const loading = ref(false)
const num = ref<string | number | null>('100%')
const numUs = ref('')

watchEffect(() => {
  if (!props.showPingPop) {
    num.value = '100%' // 平仓默认100%
    numUs.value = '100%'
    price.value = unref(shiPrice.value || null)
    priceUs.value = shiPrice.value ? unref(shiPrice.value) : ''
    shiType.value = 1
  }
  if (sliderRef.value) {
    sliderRef.value.reset()
  }
})

watch(hasDataChange, () => {
  shiPrice.value = symbolPriceMap.value.get(props.info.currency)
  if (shiType.value === 1) {
    price.value = unref(shiPrice.value)
    priceUs.value = unref(shiPrice.value)
  }
})

watch(priceUs, () => {
  price.value = parseFormatInputUsNumber(priceUs.value)
})

watch(numUs, () => {
  if (numUs.value.includes('%')) {
    num.value = numUs.value
  }
  num.value = parseFormatInputUsNumber(numUs.value)
})

onMounted(() => {
  shiPrice.value = symbolPriceMap.value.get(props.info.currency)
  if (!price.value) {
    price.value = unref(shiPrice.value)
    priceUs.value = unref(shiPrice.value)
  }
})

function onShiClick() {
  shiType.value = 2
  price.value = unref(shiPrice.value)
  priceUs.value = unref(shiPrice.value)
}

function onXianClick() {
  shiType.value = 1
  price.value = symbolPriceMap.value.get(props.info.currency)
  priceUs.value = symbolPriceMap.value.get(props.info.currency)
}

function checkedParams() {
  if (!price.value && shiType.value === 2) {
    showToast(t('h5.yongxu_jiage_warn'))
    return
  }
  return true
}

function onSubmit() {
  if (!num.value) {
    showToast(t('h5.yongxu_shuliang_warn'))
    return
  }

  if (!checkedParams()) {
    return
  }

  const data: ClosePositionParam = {
    currency: props.info.currency,
    direction: props.info.direction,
    number: getNum(num.value).toString(),
    orderType: shiType.value, // 1-市价 2-限价
    lever: props.info.lever,
  }
  // 限價才有這個參數
  if (shiType.value === 2) {
    data.entrustPrice = price.value
  }

  loading.value = true
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
      loading.value = false
      emit('onUpdate')
    })
}

function getNum(num: string) {
  if (num.includes('%')) {
    const numStr = num.replace('%', '')
    return (Number(numStr) / 100) * Number(props.info.number)
  }
  return Number(num)
}

function handleSliderChange(sliderNum: number) {
  num.value = `${sliderNum}%`
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

function onNewPriceClick() {
  if (shiType.value === 2) {
    price.value = shiPrice.value
    priceUs.value = shiPrice.value
  }
}
</script>

<template>
  <div class="ping-box">
    <div class="title">{{ $t('h5.yongxu_pingcang') }}</div>

    <div class="content">
      <div class="top flex-box-nm">
        <div class="name flex-box-nm">
          <img v-if="info.currency" :src="getIconImage(info.currency)" alt="" />
          {{ getCoinNameBySymbol(info?.currency) }}
        </div>
        <div v-if="info.direction === 1" class="green">{{ $t('h5.yongxu_duo') }}</div>
        <div v-else class="red">{{ $t('h5.yongxu_kong') }}</div>
        <div v-if="info.type === 2" class="black">{{ $t('h5.yongxu_quancang') }}</div>
        <div v-else>{{ $t('h5.yongxu_zhucang') }}</div>
        <div>{{ info.lever }}x</div>
      </div>

      <div class="r2 flex-box-sb">
        <van-field
          v-model="priceUs"
          center
          input-align="right"
          :label="$t('h5.contract.index.price')"
          :formatter="formatInputUs"
          :disabled="shiType === 1"
        >
          <template #right-icon>USDT</template>
        </van-field>
        <van-button
          v-if="shiType === 1"
          class="btn"
          size="small"
          type="primary"
          @click="onShiClick"
        >
          {{ $t('h5.coin.market_price') }}
        </van-button>
        <van-button v-else class="btn" size="small" type="primary" @click="onXianClick">
          {{ $t('h5.coin.limit_price') }}
        </van-button>
      </div>
      <div class="r3" @click="onNewPriceClick">
        {{ $t('h5.yongxu_zuixinprice') }}:
        <span>{{ usFormat(shiPrice) }}</span>
      </div>

      <div class="r4 flex-box-sb">
        <van-field
          v-if="num?.toString().includes('%')"
          v-model="num"
          center
          :label="$t('h5.contract.index.number')"
          :formatter="formatter"
        >
          <template #right-icon>
            {{ getCoinNameBySymbol(info.currency) }}
          </template>
        </van-field>
        <van-field
          v-else
          v-model="numUs"
          center
          :label="$t('h5.contract.index.number')"
          :formatter="formatInputUs"
        >
          <template #right-icon>
            {{ getCoinNameBySymbol(info.currency) }}
          </template>
        </van-field>
        <van-button class="btn" size="small" type="primary" @click="num = Number(info.number || 0)">
          {{ $t('h5.common.all') }}
        </van-button>
      </div>

      <div class="slider">
        <Slider ref="sliderRef" :default-dot="100" @on-change="handleSliderChange" />
      </div>

      <div class="r5">
        {{ $t('h5.yongxu_chicanglaing') }}:
        <span>
          {{ usFormat(info.number || 0) }}
          {{ getCoinNameBySymbol(info.currency) }}
        </span>
      </div>

      <van-button :loading="loading" class="btn-submit" size="large" @click="onSubmit">
        {{ $t('h5.yongxu_pingcang') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ping-box {
  --van-picker-confirm-action-color: var(--cb-fColor2);
  --van-field-label-width: 60px;
  --van-field-label-color: var(--cb-fColor3);
  --van-cell-background: var(--cb-permarket-btn-bgc2);
  --van-field-input-text-color: var(--cb-fColor);
  --van-cell-border-color: transparent;
  padding: 17px;
  font-size: 14px;
  :deep(.van-field__control) {
    text-align: right;
  }
  :deep(.van-cell) {
    padding: 0 10px;
    border: 1px solid var(--cb-borderColor);
    height: 32px;
    border-radius: 5px;
  }
  .red {
    color: #f04a5a;
  }
  .green {
    color: #28ba98;
  }
  .title {
    font-size: 16px;
    color: var(--cb-fColor);
  }
  .content {
    color: var(--cb-fColor);
    padding: 15px 0 0;
    font-size: 14px;
    .name {
      font-size: 15px;
      img {
        margin: 5px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
    }
    .top {
      gap: 8px;
    }
    .r2 {
      margin-top: 14px;
      gap: 5px;
      .btn {
        width: 100px;
        background-color: var(--cb-btnBgc);
        padding: 0 10px;
        height: 32px;
        border: 0;
      }
    }
    .r3 {
      margin: 14px 0;
      span {
        color: var(--cb-fColor2);
      }
    }
    .r4 {
      margin: 14px 0 20px;
      .btn {
        margin-left: 5px;
        width: 100px;
        background-color: var(--cb-btnBgc);
        padding: 0 10px;
        height: 32px;
        border: 0;
      }
    }
    .r5 {
      margin: 14px 0 20px;
      span {
        margin-left: 5px;
        color: var(--cb-fColor2);
      }
    }

    .slider {
      margin: 0 auto 40px;
      width: 8.6rem;
    }

    .btn-submit {
      margin-top: 30px;
      background-color: var(--cb-btnBgc);
      color: #fff;
      border: none;
      height: 44px;
      line-height: 44px;
      border-radius: 22px;
    }
  }
}
</style>
