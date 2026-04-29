<script setup lang="ts">
import { KLineItem } from '@/stores/market'
import { useConfigStore } from '@/stores/config'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/utils'
import { buyOrderSecond } from '@/api/order'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { showToast } from 'vant'

const props = defineProps<{
  data: KLineItem
  query: any
  direction: number
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
  (e: 'handleSuccess', id: number): void
}>()

const configStore = useConfigStore()
const userStore = useUserStore()
const i18n = useI18n()

const { secondListConfig } = storeToRefs(configStore)
const { userBalance } = storeToRefs(userStore)

const selectedIndex = ref(0)
const loading = ref(false)
const number = ref<number>()

onMounted(() => {
  configStore.requestSecondListConfig()

  if (!userBalance.value && getToken()) {
    userStore.requestUserBalance()
  }
})

// handle buy submit
function handleSubmit() {
  // min number
  const minNumber = Number(secondListConfig.value?.[selectedIndex.value]?.minNumber ?? 0)
  if (!number.value || Number(number.value) === 0 || Number(number.value) < minNumber) {
    showToast(`${i18n.t('h5.contract.index.min_number_error')}: ${minNumber}USDT`)
    return
  }

  if (Number(userBalance.value?.usdt ?? '0') < Number(number.value)) {
    showToast(i18n.t('h5.withdraw.balance_insufficient'))
    return
  }

  const data = {
    secondListId: secondListConfig.value[selectedIndex.value].id,
    number: number.value,
    direction: props.direction,
    currencyId: props.query.id,
  }

  loading.value = true
  buyOrderSecond(data)
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        userStore.requestUserBalance()
        emit('handleSuccess', res.data)
      } else {
        showToast(i18n.t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div v-if="data" class="detail-buy-box">
    <div class="header">
      <div class="name">{{ $t('h5.contract.market.order_confirm') }}</div>
      <div class="icon" @click="$emit('onClose')">
        <span class="u-icon__icon uicon-close u-iconfont"></span>
      </div>
    </div>

    <div class="item">
      <div class="label">{{ $t('h5.contract.index.trading_pair') }}</div>
      <div class="value">{{ query.name }}/{{ query.subName }}</div>
    </div>

    <div class="item">
      <div class="label">{{ $t('h5.contract.index.direction') }}</div>
      <div class="value">
        <span v-if="direction === 1" class="green">{{ $t('h5.contract.index.rise') }}</span>
        <span v-else class="red">{{ $t('h5.contract.index.decline') }}</span>
      </div>
    </div>

    <div class="item">
      <div class="label">{{ $t('h5.contract.index.current_price') }}</div>
      <div class="value">{{ data.close }}</div>
    </div>

    <div class="item">
      <div class="label">{{ $t('h5.contract.market.buy_time') }}</div>
    </div>

    <div class="item buy-time-list">
      <div
        v-for="(item, index) of secondListConfig"
        :key="item.id"
        class="item-btn"
        :class="{ active: index === selectedIndex }"
        @click="selectedIndex = index"
      >
        <div class="time">{{ item.time }}s</div>
        <div class="profit">
          <div>{{ item.profit }}%</div>
          <div>{{ $t('h5.contract.index.profit') }}</div>
        </div>
      </div>
    </div>

    <div class="item number-item">
      <div class="lbael">{{ $t('h5.contract.index.min_number') }}</div>
      <div class="value">{{ Number(secondListConfig?.[selectedIndex]?.minNumber ?? '') }}USDT</div>
    </div>

    <div class="item buy-number-input">
      <input
        v-model="number"
        :placeholder="$t('h5.contract.market.input_placeholder')"
        type="number"
      />
    </div>

    <div class="item number-item">
      <div class="lbael">{{ $t('h5.swap.available') }}</div>
      <div class="value">{{ Number(userBalance?.usdt ?? '0') }}USDT</div>
    </div>

    <van-button
      :loading="loading"
      class="btn-submit"
      color="#10ab9d"
      size="large"
      @click="handleSubmit"
    >
      {{ $t('h5.common.confirm') }}
    </van-button>
  </div>
</template>

<style lang="less" scoped>
.detail-buy-box {
  padding: 15px;
  color: #1e1e1e;

  .header,
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header {
    font-size: 16px;
    margin-bottom: 15px;
    .name {
      font-weight: 700;
    }
  }
  .item {
    height: 36px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    .value {
      font-weight: 700;
    }
  }
  .buy-time-list {
    height: auto;
    justify-content: flex-start;
    gap: 10px;
    padding: 10px 0;
    overflow-x: auto;
    .item-btn {
      flex: 0 0 auto;
      width: 65px;
      background-color: #7ec6c6;
      color: white;
      border-radius: 5px;
      text-align: center;
      overflow: hidden;
      .time {
        background-color: #f2f2f2;
        color: #848598;
        height: 30px;
        line-height: 30px;
      }
      .profit {
        font-size: 12px;
        padding: 6px 0;
      }
      &.active {
        background-color: #17ba83;
        .time {
          color: #1e1e1e;
        }
      }
    }
  }
  .buy-number-input {
    height: auto;
    padding: 10px 0;
    input {
      background-color: #f2f2f2;
      height: 42px;
      width: 100%;
      border-radius: 5px;
      padding: 0 15px;
    }
  }
  .btn-submit {
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    margin-top: 15px;
  }
}
</style>
