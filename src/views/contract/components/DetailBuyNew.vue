<script setup lang="ts">
import { KLineItem } from '@/stores/market'
import { useConfigStore } from '@/stores/config'
import { useUserStore } from '@/stores/user'
import {
  getToken,
  convertSeconds,
  usFormat,
  parseFormatInputUsNumber,
  formatInputUs,
} from '@/utils/utils'
import { buyOrderSecond } from '@/api/order'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { showToast } from 'vant'
import { getIconImage } from '@/utils/utils'
import { useThemeHook } from '@/hooks/useThemeHook'

const props = defineProps<{
  data: KLineItem
  query: any
  showBuyContaner: boolean
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
  (e: 'handleSuccess', id: number, time: number): void
}>()

const configStore = useConfigStore()
const userStore = useUserStore()
const { theme } = useThemeHook()
const i18n = useI18n()

const { secondListConfig } = storeToRefs(configStore)
const { usdtContractBalance } = storeToRefs(userStore)

const selectedIndex = ref(0)
const loading = ref(false)
const showTimePop = ref(false)
const showProfitPop = ref(false)
const number = ref<number>()
const direction = ref<number>(1)

watchEffect(() => {
  if (!props.showBuyContaner) {
    number.value = null
  }
})

onMounted(() => {
  configStore.requestSecondListConfig()

  if (!getToken()) {
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

  if (usdtContractBalance.value < Number(number.value)) {
    showToast(i18n.t('h5.withdraw.balance_insufficient'))
    return
  }

  const data = {
    secondListId: secondListConfig.value[selectedIndex.value].id,
    number: number.value,
    direction: direction.value,
    currencyId: props.query.id,
  }

  loading.value = true
  buyOrderSecond(data)
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        userStore.requestUserBalance()
        emit('handleSuccess', res.data, secondListConfig.value[selectedIndex.value].time)
      } else {
        showToast(i18n.t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function onConverClick(index: number) {
  selectedIndex.value = index
  showTimePop.value = false
}

function onProfiClick(index: number) {
  selectedIndex.value = index
  showProfitPop.value = false
}

function onInput(e) {
  const val = e.target.value
  // 去掉千分符，保持原始值
  number.value = parseFormatInputUsNumber(val)
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
    <div class="content">
      <div class="item total-top">
        <div class="left flex-box-sb">
          <img :src="getIconImage(query.name)" alt="" />
          <!-- <img :src="`~@/assets/images/tongyonglogo.jpg`" alt="" /> -->
          <div>
            <div class="label">
              {{ query.name }}
              <template v-if="query.subName">/{{ query.subName }}</template>
            </div>
            <div class="value">
              <span v-if="direction === 1" class="green">{{ $t('h5.contract.index.rise') }}</span>
              <span v-else class="red">{{ $t('h5.contract.index.decline') }}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="top flex-box-sb">
            <img src="~@/assets/images/clock.png" class="clock" alt="" />
            <div class="value">{{ convertSeconds(secondListConfig?.[selectedIndex].time) }}</div>
          </div>
          <div class="value">{{ data.close ? usFormat(data.close) : '0.00' }} USDT</div>
        </div>
      </div>

      <div class="time-box">
        <div class="label">{{ $t('h5.contract.market.buy_time') }}</div>
        <div class="btns flex-box-sb">
          <div class="time flex-box-sb" @click="showTimePop = !showTimePop">
            <img src="~@/assets/images/clock.png" class="clock" alt="" />
            <span class="value">{{ convertSeconds(secondListConfig?.[selectedIndex].time) }}</span>
            <van-icon name="arrow-down" />
          </div>
          <div class="diraction flex-box-sb">
            <div class="btn green" :class="direction === 1 ? 'active1' : ''" @click="direction = 1">
              {{ $t('h5.contract.index.rise') }}
            </div>
            <div class="btn red" :class="direction === 2 ? 'active2' : ''" @click="direction = 2">
              {{ $t('h5.contract.index.decline') }}
            </div>
          </div>
        </div>
      </div>

      <div class="profit">
        <div class="label">{{ $t('h5.contract.index.profit') }}</div>
        <div class="profitbox flex-box-sb" @click="showProfitPop = !showProfitPop">
          <span class="value">{{ secondListConfig?.[selectedIndex].profit ?? '0' }}%</span>
          <van-icon name="arrow-down" />
        </div>
      </div>

      <div class="buy-number-input">
        <div class="label">{{ $t('h5.pledge.buyNum') }}</div>
        <div class="val flex-box-sb">
          <div class="logobox flex-box-nm">
            <img src="~@/assets/images/usdt.png" alt="" />
            <span>USDT</span>
          </div>
          <div class="value">
            <input
              :value="formatInputUs(number)"
              :placeholder="$t('h5.contract.market.input_placeholder')"
              @input="onInput"
            />
            <div class="btn" @click="number = usdtContractBalance">
              {{ $t('h5.swap.max') }}
            </div>
          </div>
        </div>
      </div>

      <div class="number-item">
        <div class="label">
          {{ $t('h5.swap.available') }}: {{ usFormat(usdtContractBalance) }} USDT
        </div>
        <div class="label">
          {{ $t('h5.contract.index.min_number') }}:
          {{
            secondListConfig?.[selectedIndex]?.minNumber
              ? usFormat(secondListConfig?.[selectedIndex]?.minNumber)
              : ''
          }}
          USDT
        </div>
      </div>

      <van-button :loading="loading" class="btn-submit" size="large" @click="handleSubmit">
        {{ $t('h5.common.weituo') }}
      </van-button>

      <van-action-sheet
        v-model:show="showProfitPop"
        :title="$t('h5.contract.index.profit')"
        :closeable="true"
      >
        <van-radio-group>
          <van-cell-group inset>
            <van-cell
              v-for="(item, index) of secondListConfig"
              :key="item.id"
              :title="`${item.profit}%`"
              clickable
              center
              :style="{
                backgroundColor:
                  selectedIndex === index ? `${theme === 'dark' ? '#37374f' : '#3b6ee8'}` : '',
                color: selectedIndex === index ? '#fff' : '#9c9c9c',
                borderRadius: '22px',
                textAlign: 'center',
              }"
              @click="onProfiClick(index)"
            ></van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-action-sheet>
      <van-action-sheet
        v-model:show="showTimePop"
        :title="$t('h5.contract.market.buy_time')"
        :closeable="true"
      >
        <van-radio-group>
          <van-cell-group inset>
            <van-cell
              v-for="(item, index) of secondListConfig"
              :key="item.id"
              :title="convertSeconds(item.time)"
              clickable
              center
              :style="{
                backgroundColor: selectedIndex === index ? '#37374f' : '',
                color: selectedIndex === index ? '#fff' : '#9c9c9c',
                borderRadius: '22px',
                textAlign: 'center',
              }"
              @click="onConverClick(index)"
            ></van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-action-sheet>
    </div>
  </div>
</template>

<style lang="less" scoped>
.detail-buy-box {
  --van-cell-background: var(--cb-bgc5);
  --van-cell-border-color: var(--cb-bgc5);
  --van-cell-group-background: var(--cb-bgc5);
  padding: 15px 0 20px;
  color: var(--cb-fColor);
  & > .content {
    padding: 0 15px;
  }
  .header,
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header {
    border-bottom: 1px solid var(--cb-borderColor2);
    padding: 2px 15px 12px;
  }
  .total-top {
    margin: 20px 0;
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
    .value {
      font-weight: 700;
    }

    .left {
      font-weight: 700;
      img {
        width: 42px;
        margin-right: 8px;
        border-radius: 50%;
      }
      .label {
        margin-bottom: 5px;
      }
      .value {
        font-weight: normal;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      .top {
        align-self: flex-end;
        font-size: 16px;
        width: 50px;
        margin-bottom: 5px;
        margin-right: 9px;
        box-sizing: border-box;
        .clock {
          width: 15px;
          margin-right: 8px;
        }
      }
    }
  }
  .time-box {
    margin: 20px 0 20px;
    .label {
      margin-bottom: 8px;
    }
    .time {
      border: 1px solid var(--cb-borderColor2);
      padding: 10px 12px;
      border-radius: 5px;

      .clock {
        width: 18px;
      }
      .value {
        margin: 0 6px 0 8px;
      }
    }
    .diraction {
      .btn {
        padding: 0 10px;
        width: 120px;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        background-color: var(--cb-bgc2);
        color: #848598;
      }
      .green {
        clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%);
        border-radius: 5px 2px 5px 5px;
        position: relative;
        right: -10px;
        text-align: center;
        text-indent: -15px;
      }
      .red {
        clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
        border-radius: 5px 5px 5px 2px;
        text-align: center;
        text-indent: 15px;
      }
    }
  }
  .number-item {
    .label {
      margin-bottom: 10px;
    }
  }
  .profit {
    margin-bottom: 20px;
    .label {
      margin-bottom: 10px;
    }
    .profitbox {
      border: 1px solid var(--cb-borderColor2);
      padding: 10px 12px;
      border-radius: 5px;
    }
  }
  .buy-number-input {
    margin-bottom: 20px;
    .label {
      margin-bottom: 10px;
    }
    .logobox {
      height: 40px;
      border: 1px solid var(--cb-borderColor2);
      padding: 0 12px;
      border-radius: 5px;
      margin-right: 8px;
      font-weight: bold;
      box-sizing: border-box;
      img {
        width: 20px;
        margin-right: 8px;
      }
    }
    input {
      border: 1px solid var(--cb-borderColor2);
      height: 40px;
      width: 100%;
      border-radius: 5px;
      padding: 0 15px;
      box-sizing: border-box;
      color: var(--cb-fColor);
    }
    .value {
      flex: 1;
      position: relative;
      .btn {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        padding-left: 5px;
        box-sizing: border-box;
        color: var(--cb-fColor2);
      }
    }
  }
  .btn-submit {
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    margin-top: 15px;
    background-color: var(--cb-btnBgc) !important;
    color: #fff !important;
    border: none;
    border-radius: 22px;
  }
  .active1 {
    background-color: #17ba83 !important;
    color: #fff !important;
  }
  .active2 {
    background-color: #f04a5a !important;
    color: #fff !important;
  }
}
</style>
