<script setup lang="ts">
import useCurrencyHook from '@/hooks/useCurrencyHook'
import { useUserStore } from '@/stores/user'
import { useConfigStore } from '@/stores/config'
import router from '@/router'
import { showToast } from 'vant'
import { withdraw, getBindInfo } from '@/api/user'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { confirm } from '@/utils/dialog'
import { formatInputUs, parseFormatInputUsNumber } from '@/utils/utils'

const userStore = useUserStore()
const configStore = useConfigStore()
const { assetCurrencyList } = useCurrencyHook()
const { userBalance } = storeToRefs(userStore)
const { assetConfig } = storeToRefs(configStore)
const { t } = useI18n()
const currentCurrency = ref<(typeof assetCurrencyList)[0]>(assetCurrencyList[1])
const currentSelectCurrency = ref([assetCurrencyList[1].key])
const withdrawRef = ref()
const balance = ref(0)
const currency = ref('')
const number = ref('')
const address = ref('')
const password = ref('')
const showAssetList = ref(false)
const loading = ref(false)
let standard = ''
const customFieldName = {
  text: 'key',
  value: 'key',
}

watchEffect(() => {
  if (currency.value && userBalance.value && userBalance.value.length > 0) {
    const currentBalance = userBalance.value.find(
      (item) => currency.value === item.type.toUpperCase(),
    )
    balance.value = Number(currentBalance?.number || 0)
  }
})

onMounted(() => {
  if (currentCurrency.value) {
    const units = currentCurrency.value.key.split('-')
    currency.value = units?.[0] ?? ''
    standard = units?.[1] ?? ''
  }

  // checkAddress()

  userStore.requestUserBalance()
  configStore.requestAssetsConfig()
})

function capitalizeAfterDash(inputString) {
  // 使用正则表达式替换
  return inputString.toLowerCase().replace(/-(.)/, function (match, p1) {
    return p1.toUpperCase()
  })
}

function checkAddress() {
  getBindInfo().then((res) => {
    if (res.code === SUCCESS_CODE) {
      if (!res.data) {
        confirm('h5.bindcard.warn').then(() => {
          router.push('/bindCard')
        })
        return
      }
      const typeKey = capitalizeAfterDash(currentCurrency.value.key)
      if (typeKey === 'eth') {
        address.value = (res.data as any)['ethErc']
        return
      }
      address.value = (res.data as any)[typeKey]
      // if (!address.value) {
      //   confirm('h5.bindcard.warn').then(() => {
      //     router.push('/bindCard')
      //   })
      // }
    }
  })
}

function onAll() {
  number.value = String(balance.value)
}

function submitVerify() {
  if (!number.value) {
    showToast(t('h5.withdraw.number_placeholder'))
    return false
  }

  if (!address.value) {
    showToast(t('h5.withdraw.address_placeholder'))
    return false
  }

  // if (!password.value) {
  //   showToast(t('h5.withdraw.password_placeholder'))
  //   return false
  // }

  // 判断最小金额
  const minNumber =
    assetConfig.value.find((item) => item.key === `MIN_WITHDRAW_${currency.value}`)?.value ?? ''
  const appName = import.meta.env.VITE_APP_NAME
  if (
    appName !== 'Rbpyzdy' &&
    (Number(number.value) === 0 || Number(number.value) < Number(minNumber))
  ) {
    showToast(`${t('h5.withdraw.min_number')}${Number(minNumber)}${currency.value}`)
    return false
  }

  // 判断余额是否充足
  if (Number(balance.value) < Number(number.value)) {
    showToast(t('h5.withdraw.balance_insufficient'))
    return false
  }

  return true
}

function handleSubmit() {
  if (!submitVerify()) {
    return
  }

  loading.value = true
  withdraw({
    number: Number(number.value),
    address: address.value,
    type: currency.value,
    password: password.value,
    standard,
  })
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        showToast(t('h5.withdraw.success'))
        // router.replace('/withdraw/records')
        // 重置数据
        number.value = ''
      } else {
        showToast(t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function handleRecord() {
  router.push('/allrecord?type=WithdrawRecord')
}

function onAssetsConfirm({ selectedOptions }) {
  number.value = '0'
  showAssetList.value = false
  currentCurrency.value = selectedOptions[0]
  const units = currentCurrency.value.key.split('-')
  currency.value = units?.[0] ?? ''
  standard = units?.[1] ?? ''
  // checkAddress()
}

function onPickClose() {
  currentSelectCurrency.value = [currentCurrency.value.key]
}

function handleAddressClick() {
  router.push('/bindCard')
}

function onInput(e) {
  const val = e.target.value
  // 去掉千分符，保持原始值
  number.value = parseFormatInputUsNumber(val)
}
</script>

<template>
  <div class="light" ref="withdrawRef">
    <Navbar2
      :title="$t('h5.withdraw.title')"
      :is-show-right="false"
      :is-show-records="true"
      back-path="/user-financial"
      @on-record="handleRecord"
    />

    <div v-if="currentCurrency" class="container">
      <div class="card">
        <div class="currency container-item">
          <div class="title">{{ $t('h5.withdraw.currency_type') }}</div>
          <div class="item tixian" @click="showAssetList = true">
            <img :src="currentCurrency.icon" />
            <span class="name">
              {{ currentCurrency.key === 'ETH-ERC' ? 'ETH' : currentCurrency.key }}
            </span>
            <span class="iconfont icon-yanzhengma text-ddd"></span>
          </div>
        </div>

        <div class="number container-item">
          <div class="title">{{ $t('h5.withdraw.current_balance') }}</div>
          <div class="item">
            <input :value="formatInputUs(balance) || 0" disabled />
            <div class="suffix">{{ currency }}</div>
          </div>
        </div>

        <div class="number container-item">
          <div class="title">{{ $t('h5.withdraw.number') }}</div>
          <div class="item">
            <input
              :value="formatInputUs(number)"
              :placeholder="$t('h5.withdraw.number_placeholder')"
              @input="onInput"
            />
            <div class="suffix alltext" @click="onAll">{{ $t('h5.common.all') }}</div>
          </div>
        </div>

        <div class="number container-item">
          <div class="title">{{ $t('h5.withdraw.address') }}</div>
          <div class="item">
            <input
              v-model="address"
              class="address"
              :placeholder="$t('h5.withdraw.address_placeholder')"
            />
            <!-- <div class="suffix alltext" @click="handleAddressClick">
              {{ $t('h5.bindcard.bangbtn_text') }}
            </div> -->
          </div>
        </div>

        <!-- <div class="number container-item">
          <div class="title">{{ $t('h5.withdraw.password') }}</div>
          <div class="item">
            <input
              v-model="password"
              :placeholder="$t('h5.withdraw.password_placeholder')"
              type="password"
            />
          </div>
        </div> -->
      </div>

      <!-- <div class="number container-item tips">
        <div class="title">{{ $t('h5.withdraw.notification') }}:</div>
        <div class="content">
          <div class="text">
            {{ $t('h5.withdraw.notification_content') }}
          </div> -->
      <!-- <div class="text handing-fee">
						<span>{{ $t('h5.withdrwa.commission_fee') }}:</span>
						<span class="fee">{{ fee }}</span>
					</div> -->
      <!-- </div>
      </div> -->
      <van-button :loading="loading" class="btn-submit" size="large" @click="handleSubmit">
        {{ $t('h5.withdraw.confirm') }}
      </van-button>
    </div>

    <van-popup
      v-model:show="showAssetList"
      :teleport="withdrawRef"
      round
      safe-area-inset-bottom
      position="bottom"
      @close="onPickClose"
    >
      <van-picker
        v-model="currentSelectCurrency"
        :columns="assetCurrencyList"
        :title="$t('h5.withdraw.currency_type')"
        :columns-field-names="customFieldName"
        :cancel-button-text="$t('h5.purchaseGold.Cancel')"
        :confirm-button-text="$t('h5.purchaseGold.Confirm')"
        @cancel="showAssetList = false"
        @confirm="onAssetsConfirm"
      >
        <template #option="option">
          <div class="pick-item">
            <img :src="option.icon" />
            <span class="name">{{ option.key === 'ETH-ERC' ? 'ETH' : option.key }}</span>
          </div>
        </template>
      </van-picker>
    </van-popup>
  </div>
</template>

<style scoped lang="less">
@item-background-color: var(--cb-bgc);

.light {
  --van-picker-confirm-action-color: var(--cb-fColor2);
  --van-picker-background: var(--cb-bgc5);
  --van-picker-mask-color: var(--cb-bgc);
  --van-border-color: var(--cb-bgc2);
  --van-text-color: var(--cb-fColor);
  --van-picker-option-text-color: var(--cb-fColor6);
  color: var(--cb-fColor);
  :deep(.van-picker-column__item--selected) {
    color: var(--cb-fColor2);
    font-weight: bolder;
  }

  :deep(.van-picker__columns) {
    background-color: var(--cb-bgc);
  }
  .pick-item {
    display: flex;
    align-items: center;
    width: 120px;
    img {
      margin-right: 10px;
      @size: 30px;
      height: @size;
      width: @size;
      border-radius: 50%;
    }
    .name {
      flex: 1;
      font-size: 14px;
    }
  }
}

.container {
  padding: 20px 16px;
  // color: #919fac;
  .card {
    // background-color: #f8fafc;
  }

  .container-item {
    .item {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: @item-background-color;
      padding: 10px 15px;
      border-radius: 3px;
      height: 28px;
      border: 1px solid var(--cb-borderColor2);
      img {
        @size: 26px;
        height: @size;
        width: @size;
      }
      .name {
        flex: 1;
        font-size: 16px;
        // color: #1e1e1e;
        color: var(--cb-fColor6);
      }
      input {
        flex: 1;
        &::placeholder {
          color: var(--cb-fColor6);
        }
      }
      .suffix,
      .iconfont {
        color: var(--cb-fColor6);
      }
      .alltext {
        margin-right: -10px;
        color: var(--cb-fColor2);
        // background-color: var(--cb-btnBgc2);
        padding: 8px 14px;
        border-radius: 5px;
      }
    }
    .tixian {
      border-radius: 10px;
      img {
        border-radius: 50%;
      }
    }
    .content {
      .text {
        margin-top: 10px;
        .fee {
          margin-left: 5px;
          color: var(--cb-fColor6);
        }
      }
    }
    &.number {
      margin-top: 20px;
      input {
        height: 28px;
        width: 100%;
        color: var(--cb-fColor);
      }
    }
  }
  .currency {
    .item {
      // background-color: var(--cb-btnBgc2);
      border: 1px solid var(--cb-borderColor);
      .suffix,
      .iconfont {
        color: var(--cb-fColor2);
        transform: rotate(90deg);
      }
    }
  }
  .tips {
    color: var(--cb-fColor6);
    .text {
      color: #fb3b3b;
      line-height: 22px;
    }
  }
  .address {
    // pointer-events: none; /* 禁止元素接收点击事件 */
  }

  .btn-submit {
    margin-top: 30px;
    margin-bottom: 80px;
    background-color: var(--cb-btnBgc);
    color: #fff;
    border: none;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 22px;
  }
}
</style>
