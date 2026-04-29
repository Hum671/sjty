<script setup lang="ts">
import { executeTPnSL } from '@/api/market'
import type { CurrentPositionItem, ExecuteTPnSLParam } from '@/api/market/model/MarketModel'
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
}>()

const { t } = useI18n()
const marketStore = useMarketStore()
const userStore = useUserStore()
const { symbolPriceMap, hasDataChange } = storeToRefs(marketStore)
const shiPrice = ref()
const stopLess = ref('')
const stopLessUs = ref('')
const takeProfit = ref('')
const takeProfitUs = ref('')
const loading = ref(false)

watch(hasDataChange, () => {
  shiPrice.value = symbolPriceMap.value.get(props.info.currency)
})

watch(
  () => props.info,
  () => {
    takeProfit.value = Number(props.info.takeProfit)
    takeProfitUs.value = formatInputUs(Number(props.info.takeProfit))
    stopLess.value = Number(props.info.stopLess)
    stopLessUs.value = formatInputUs(Number(props.info.stopLess))
  },
  {
    immediate: true,
  },
)

watch(stopLessUs, () => {
  stopLess.value = parseFormatInputUsNumber(stopLessUs.value)
})

watch(takeProfitUs, () => {
  takeProfit.value = parseFormatInputUsNumber(takeProfitUs.value)
})

onMounted(() => {
  shiPrice.value = symbolPriceMap.value.get(props.info.currency)
})

function onFocus1() {
  if (Number(takeProfit.value) > 0) {
    return
  }
  takeProfit.value = ''
  takeProfitUs.value = ''
}

function onFocus2() {
  if (Number(stopLess.value) > 0) {
    return
  }
  stopLess.value = ''
  stopLessUs.value = ''
}

function onSubmit() {
  const data: ExecuteTPnSLParam = {
    id: props.info.id,
    stopLess: stopLess.value || '0', // 止損
    takeProfit: takeProfit.value || '0', // 止盈
  }

  loading.value = true
  executeTPnSL(data)
    .then((res) => {
      if (res.code === 200) {
        emit('onUpdate')
        userStore.requestUserBalance()
      } else {
        showToast(t('h5.yongxu_yinsun_error'))
      }
    })
    .catch((err) => {
      showToast(t(err))
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="ping-box">
    <div class="title">{{ $t('h5.yongxu_yingsun') }}</div>

    <div class="content">
      <div class="top flex-box-nm">
        <div class="name flex-box-nm">
          <img :src="getIconImage(info.currency)" alt="" />
          {{ getCoinNameBySymbol(info.currency) }}
        </div>
        <div v-if="info.direction === 1" class="green">{{ $t('h5.yongxu_duo') }}</div>
        <div v-else class="red">{{ $t('h5.yongxu_kong') }}</div>
        <div v-if="info.type === 2" class="black">{{ $t('h5.yongxu_quancang') }}</div>
        <div v-else>{{ $t('h5.yongxu_zhucang') }}</div>
        <div>{{ info.lever }}x</div>
      </div>

      <div class="r4">
        <van-field
          v-model="takeProfitUs"
          center
          :label="$t('h5.yongxu_zhiying')"
          :formatter="formatInputUs"
          @focus="onFocus1"
        >
          <template #right-icon>
            USDT
            <!-- {{ info.currency.replace('usdt', '').toLocaleUpperCase() }} -->
          </template>
        </van-field>
      </div>
      <div class="r4">
        <van-field
          v-model="stopLessUs"
          center
          :label="$t('h5.yongxu_zhisun')"
          :formatter="formatInputUs"
          @focus="onFocus2"
        >
          <template #right-icon>
            USDT
            <!-- {{ info.currency.replace('usdt', '').toLocaleUpperCase() }} -->
          </template>
        </van-field>
      </div>
      <div class="r3">
        {{ $t('h5.yongxu_zuixinprice') }}:
        <span>{{ usFormat(shiPrice) }}</span>
      </div>
      <div class="r5">
        {{ $t('h5.yongxu_chicanglaing') }}:
        <span>{{ usFormat(info.number) }}</span>
      </div>

      <van-button :loading="loading" class="btn-submit" size="large" @click="onSubmit">
        {{ $t('h5.common.confirm') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ping-box {
  --van-field-label-width: 60px;
  --van-field-label-color: var(--cb-fColor3);
  --van-cell-background: var(--cb-permarket-btn-bgc2);
  --van-field-input-text-color: var(--cb-fColor);
  padding: 17px;
  font-size: 13px;
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
    color: #00c572;
  }
  .title {
    font-size: 16px;
    color: var(--cb-fColor);
  }
  .content {
    padding: 20px 0 0;
    font-size: 14px;
    .name {
      font-size: 15px;
      img {
        margin: 5px;
        width: 20px;
        height: 20px;
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
      margin-top: 30px;
      span {
        color: var(--cb-fColor2);
      }
    }
    .r4 {
      margin: 14px 0;
    }
    .r5 {
      margin: 10px 0 10px;
      span {
        color: var(--cb-fColor2);
      }
    }

    .slider {
      margin: 0 auto;
      width: 346px;
    }

    .btn-submit {
      margin-top: 20px;
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
