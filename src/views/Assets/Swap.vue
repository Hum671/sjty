<script setup lang="ts">
import { ActionSheetAction, showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { useMarketStore } from '@/stores/market'
import {
  formatInputUs,
  formatNumber,
  getIconImage,
  usFormat,
  parseFormatInputUsNumber,
} from '@/utils/utils'
import { excharge } from '@/api/user'

import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { useCurrencyStore } from '@/stores/currency'

const { t } = useI18n()
const userStore = useUserStore()
const { userBalance } = storeToRefs(userStore)
const { symbolPriceMap, hasDataChange } = storeToRefs(useMarketStore())
const { digitalCurrencyList } = storeToRefs(useCurrencyStore())
const fromIndex = ref(0)
const toIndex = ref(1)
const balance = ref(0)
const number = ref<number>()
const rateNumber = ref('')
const ratePrice = ref(0)
const showSheet = ref(false)
const loading = ref(false)
const actions = ref<ActionSheetAction[]>([])
let selectType: 'form' | 'to' = 'form'
const assetList = computed(() => {
  const userBalanceRow = userBalance.value?.filter((item) => {
    if (item.type === 'usdt') {
      return item
    }

    return symbolPriceMap.value.get(`${item.type}usdt`)
  })

  digitalCurrencyList.value?.forEach((item) => {
    const findItem = userBalanceRow.find((iten) => iten.type === item?.type)
    if (!findItem) {
      userBalanceRow.push({
        number: 0,
        occ: '0',
        type: item?.type,
      })
    }
  })

  const findIten = userBalanceRow.find((iten) => iten.type === 'usdt')

  if (!findIten) {
    userBalanceRow.unshift({
      number: 0,
      occ: '0',
      type: 'usdt',
    })
  }

  return userBalanceRow
})

watch(hasDataChange, () => {
  if (symbolPriceMap.value && assetList.value) {
    const fromType = assetList.value[fromIndex.value]?.type
    const toType = assetList.value[toIndex.value]?.type
    let fromPrice
    let toPrice

    if (fromType === 'usdt') {
      fromPrice = 1
    } else {
      fromPrice = symbolPriceMap.value.get(`${fromType}usdt`)
    }

    if (toType === 'usdt') {
      toPrice = 1
    } else {
      toPrice = symbolPriceMap.value.get(`${toType}usdt`)
    }

    ratePrice.value = Number(formatNumber(fromPrice / toPrice, 8)) || ''
    if (ratePrice.value && number.value) {
      const toNumber = formatNumber(number.value * ratePrice.value, 8)
      rateNumber.value = toNumber === 'Infinity' ? '' : toNumber
    } else {
      rateNumber.value = ''
    }
  }
})

watchEffect(() => {
  if (assetList.value && assetList.value.length > 0) {
    const currentBalance = assetList.value.find(
      (item) => assetList.value[fromIndex.value].type === item.type,
    )
    balance.value = Number(currentBalance?.number || '0')
  }

  if (symbolPriceMap.value) {
    const fromType = assetList.value[fromIndex.value]?.type
    const toType = assetList.value[toIndex.value]?.type
    let fromPrice
    let toPrice

    if (fromType === 'usdt') {
      fromPrice = 1
    } else {
      fromPrice = symbolPriceMap.value.get(`${fromType}usdt`)
    }

    if (toType === 'usdt') {
      toPrice = 1
    } else {
      toPrice = symbolPriceMap.value.get(`${toType}usdt`)
    }

    ratePrice.value = Number(formatNumber(fromPrice / toPrice, 8)) || ''
    if (ratePrice.value && number.value) {
      const toNumber = formatNumber(number.value * ratePrice.value, 8)
      rateNumber.value = toNumber === 'Infinity' ? '' : toNumber
    } else {
      rateNumber.value = ''
    }
  }
})

onMounted(() => {
  userStore.requestUserBalance()
})

function onAll() {
  number.value = Number(balance.value)
}

function changeCurrency(type: 'form' | 'to') {
  const list: ActionSheetAction[] = []
  selectType = type
  assetList.value.forEach((item) => {
    if (type === 'form' && item.type !== assetList.value[fromIndex.value].type) {
      list.push({
        name: item.type.toUpperCase(),
        icon: getIconImage(item.type),
        callback: handleSelect,
      })
    }
    if (type === 'to' && item.type !== assetList.value[toIndex.value].type) {
      list.push({
        name: item.type.toUpperCase(),
        icon: getIconImage(item.type),
        callback: handleSelect,
      })
    }
  })

  actions.value = list
  showSheet.value = true
}

function handleSwap() {
  const temp = toIndex.value
  toIndex.value = fromIndex.value
  fromIndex.value = temp

  number.value = void 0
}

function handleSelect(action) {
  const findIndex = assetList.value.findIndex((item) => item.type.toUpperCase() === action.name)

  if (selectType === 'form') {
    if (findIndex === toIndex.value) {
      // 交换值
      const toggle = fromIndex.value
      fromIndex.value = findIndex
      toIndex.value = toggle
    } else {
      fromIndex.value = findIndex
    }
  }
  if (selectType === 'to') {
    if (findIndex === fromIndex.value) {
      // 交换值
      const toggle = toIndex.value
      toIndex.value = findIndex
      fromIndex.value = toggle
    } else {
      toIndex.value = findIndex
    }
  }
}

function submitVerify() {
  if (balance.value < number.value) {
    showToast(t('h5.withdraw.balance_insufficient'))
    return false
  }

  if (!assetList.value?.[fromIndex.value]?.type || !assetList.value?.[toIndex.value]?.type) {
    showToast(t('h5.common.loading'))
    return false
  }

  return true
}

function handleSubmit() {
  if (!submitVerify()) {
    return
  }

  loading.value = true
  excharge({
    fromCoin: assetList.value[fromIndex.value].type,
    toCoin: assetList.value[toIndex.value].type,
    number: number.value,
  })
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        showToast(t('h5.swap.success'))
        number.value = void 0
        userStore.requestUserBalance()
      } else {
        showToast(t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function onInput(e) {
  const val = e.target.value
  // 去掉千分符，保持原始值
  number.value = parseFormatInputUsNumber(val)
}
</script>

<template>
  <div class="light">
    <Navbar2 :title="$t('h5.assets.shandui')" :is-show-right="false" back-path="/user-financial" />

    <div class="content">
      <div class="rate">
        <span class="rate-result">{{ $t('h5.swap.available') }}:</span>
        <span class="balance">{{
          `${usFormat(balance)} ${assetList[fromIndex]?.type?.toUpperCase()}`
        }}</span>
      </div>

      <div class="from-item item">
        <div class="title">{{ $t('h5.swap.consumption') }}</div>
        <div class="input-box">
          <input
            :value="formatInputUs(number)"
            :placeholder="$t('h5.swap.placehold.from')"
            @input="onInput"
          />
          <div class="right">
            <div class="big" @click="onAll">{{ $t('h5.swap.max') }}</div>
            <div class="currency" @click="changeCurrency('form')">
              <img :src="getIconImage(assetList[fromIndex]?.type)" />
              <span class="name">
                {{ assetList[fromIndex]?.type?.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="from-excharge" @click="handleSwap">
        <img src="~@/assets/images/transfer-logo.svg" />
      </div>

      <div class="from-to item">
        <div class="title">{{ $t('h5.swap.get') }}</div>
        <div class="input-box">
          <input :value="formatInputUs(rateNumber)" :placeholder="$t('h5.swap.number')" readonly />

          <div class="currency" @click="changeCurrency('to')">
            <img :src="getIconImage(assetList[toIndex]?.type)" />
            <span class="name">
              {{ assetList[toIndex]?.type?.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>

      <div class="rate2 flex-box-ce">
        1
        <div class="unit">{{ assetList[fromIndex]?.type?.toUpperCase() }}</div>
        ≈ {{ Infinity === ratePrice ? 0 : ratePrice }}
        <div class="unit">{{ assetList[toIndex]?.type?.toUpperCase() }}</div>
        <img src="@/assets/images/refresh.svg" alt="" />
      </div>

      <van-button :loading="loading" class="btn-submit" size="large" @click="handleSubmit">
        {{ $t('h5.swap.title') }}
      </van-button>
    </div>

    <van-action-sheet
      v-model:show="showSheet"
      :actions="actions"
      :cancel-text="$t('h5.common.cancel')"
      close-on-click-action
      :description="$t('h5.swap.promat')"
    />
  </div>
</template>

<style lang="less" scoped>
.light {
  --van-active-color: transparent;
  :deep(.van-icon__image) {
    border-radius: 50%;
  }
  img {
    border-radius: 50%;
  }
}
.content {
  padding: 28px 16px;
  @color: #fff;

  input {
    appearance: none; /* 移除默认样式 */
    border: none; /* 移除边框 */
    outline: none; /* 移除轮廓 */
    background: none; /* 移除背景 */
  }

  input::placeholder {
    color: var(--cb-fColor6);
  }

  .item {
    border: 1px solid var(--cb-borderColor2);
    border-radius: 15px;
    padding: 20px 18px 28px;
    background-color: var(--cb-bgc);

    .title {
      font-size: 14px;
      margin-bottom: 36px;
    }
    .input-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--cb-borderColor2);
      padding-bottom: 10px;
      box-sizing: border-box;
      color: var(--cb-fColor);

      input {
        max-width: 160px;
        color: var(--cb-fColor);
      }
      .right {
        display: flex;
        align-items: center;
        .big {
          border-right: 1px solid var(--cb-borderColor2);
          padding-right: 10px;
          color: var(--cb-fColor2);
        }
      }
      .currency {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-left: 10px;
      }
    }
    .available {
      margin-top: 20px;
      font-size: 12px;
      color: @color;
      .balance {
        color: #1e1e1e;
        margin-left: 6px;
      }
    }

    img {
      @size: 20px;
      width: @size;
      height: @size;
    }
  }

  .from-excharge {
    box-sizing: border-box;
    padding: 10px;
    width: 60px;
    height: 65px;
    border-radius: 50%;
    margin: -18px auto;
    img {
      width: 45px;
    }
  }

  .btn-submit {
    margin: 80px 0;
    background-color: var(--cb-btnBgc);
    color: var(--cb-fColor);
    border: none;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 22px;
    color: #fff;
  }

  .rate {
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .rate-result {
      margin-right: 10px;
    }
    .rate-value {
      color: var(--cb-fColor2);
    }
    .balance {
      font-size: 16px;
      color: var(--cb-fColor2);
    }
  }
  .rate2 {
    font-size: 15px;
    text-align: center;
    margin: 30px 0;
    gap: 5px;
    .unit {
      color: var(--cb-fColor2);
    }
  }
}
</style>
