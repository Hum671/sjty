<script setup lang="ts">
import useCurrencyHook from '@/hooks/useCurrencyHook'
import { useUserStore } from '@/stores/user'
import { useConfigStore } from '@/stores/config'
import router from '@/router'
import { showToast } from 'vant'
import { withdraw, getBindInfo } from '@/api/user'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { confirm } from '@/utils/dialog'

const userStore = useUserStore()
const configStore = useConfigStore()
const { assetCurrencyList } = useCurrencyHook()
const route = useRoute()

const { userBalance } = storeToRefs(userStore)
const { assetConfig } = storeToRefs(configStore)
const { t } = useI18n()
const currentCurrency = ref<(typeof assetCurrencyList)[0]>()
const balance = ref(0)
const currency = ref('')
const number = ref('')
const address = ref('')
const password = ref('')
const loading = ref(false)
let standard = ''

// 手续费
const fee = computed(() => {
  if (assetConfig.value) {
    const find = assetConfig.value.find((item) => item.key === 'WITHDRAW_FEE')
    return find?.value ?? ''
  }
  return ''
})

watchEffect(() => {
  if (currency.value && userBalance.value) {
    if (currency.value === 'ETH') {
      balance.value = Number(userBalance.value.eth)
    }

    if (currency.value === 'BTC') {
      balance.value = Number(userBalance.value.btc)
    }

    if (currency.value === 'USDT') {
      balance.value = Number(userBalance.value.usdt)
    }
  }
})

onMounted(() => {
  const type = route.query.type as string
  currentCurrency.value = assetCurrencyList.find((item) => {
    if (type === 'ETH-ERC' && item.key === 'ETH') {
      return true
    }
    return item.key === type
  })

  if (currentCurrency.value) {
    const units = type.split('-')
    currency.value = units?.[0] ?? ''
    standard = units?.[1] ?? ''
  }

  getBindInfo().then((res) => {
    if (res.code === SUCCESS_CODE) {
      if (!res.data) {
        confirm('h5.bindcard.warn').then(() => {
          router.push('/bindCard')
        })
        return
      }

      const typeKey = capitalizeAfterDash(type)
      address.value = (res.data as any)[typeKey]
      if (!address.value) {
        confirm('h5.bindcard.warn').then(() => {
          router.push('/bindCard')
        })
      }
    }
  })
  userStore.requestUserBalance()
  configStore.requestAssetsConfig()
})

function capitalizeAfterDash(inputString) {
  // 使用正则表达式替换
  return inputString.toLowerCase().replace(/-(.)/, function (match, p1) {
    return p1.toUpperCase()
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

  if (!password.value) {
    showToast(t('h5.withdraw.password_placeholder'))
    return false
  }

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
        router.replace('/withdraw/records')
      } else {
        showToast(t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function handleRecord() {
  router.push('/withdraw/records')
}

function handleBack() {
  router.back()
}

function handleAddressClick() {
  router.push('/bindCard')
}
</script>

<template>
  <div class="light">
    <Navbar2
      :title="$t('h5.withdraw.title')"
      :is-show-right="false"
      :is-show-records="true"
      @on-record="handleRecord"
    />

    <div v-if="currentCurrency" class="container">
      <div class="currency container-item">
        <div class="title">{{ $t('h5.withdraw.currency_type') }}</div>
        <div class="item" @click="handleBack">
          <img :src="currentCurrency.icon" />
          <span class="name">{{ currentCurrency.key }}</span>
          <span class="iconfont icon-yanzhengma text-ddd"></span>
        </div>
      </div>

      <div class="number container-item">
        <div class="title">{{ $t('h5.withdraw.current_balance') }}</div>
        <div class="item">
          <input :value="balance" disabled type="number" />
          <div class="suffix">{{ currency }}</div>
        </div>
      </div>

      <div class="number container-item">
        <div class="title">{{ $t('h5.withdraw.number') }}</div>
        <div class="item">
          <input
            v-model="number"
            :placeholder="$t('h5.withdraw.number_placeholder')"
            type="number"
          />
          <div class="suffix" @click="onAll">{{ $t('h5.common.all') }}</div>
        </div>
      </div>

      <div class="number container-item">
        <div class="title">{{ $t('h5.withdraw.address') }}</div>
        <div class="item" @click="handleAddressClick">
          <input
            v-model="address"
            class="address"
            :placeholder="$t('h5.withdraw.address_placeholder')"
          />
        </div>
      </div>

      <div class="number container-item">
        <div class="title">{{ $t('h5.withdraw.password') }}</div>
        <div class="item">
          <input
            v-model="password"
            :placeholder="$t('h5.withdraw.password_placeholder')"
            type="password"
          />
        </div>
      </div>

      <div class="number container-item">
        <div class="title">{{ $t('h5.withdraw.notification') }}</div>
        <div class="content">
          <div class="text">
            {{ $t('h5.withdraw.notification_content') }}
          </div>
          <!-- <div class="text handing-fee">
						<span>{{ $t('h5.withdrwa.commission_fee') }}:</span>
						<span class="fee">{{ fee }}</span>
					</div> -->
        </div>
      </div>

      <van-button
        :loading="loading"
        class="btn-submit"
        color="#10ab9d"
        size="large"
        @click="handleSubmit"
      >
        {{ $t('h5.withdraw.confirm') }}
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="less">
@item-background-color: #f6f7fb;

.container {
  padding: 20px 16px;
  color: #919fac;
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
      img {
        @size: 26px;
        height: @size;
        width: @size;
      }
      .name {
        flex: 1;
        font-size: 16px;
        color: #1e1e1e;
      }
      input {
        flex: 1;
      }
      .suffix,
      .iconfont {
        color: #1e1e1e;
      }
    }
    .content {
      .text {
        margin-top: 10px;
        .fee {
          margin-left: 5px;
          color: #1e1e1e;
        }
      }
    }
    &.number {
      margin-top: 20px;
      input {
        height: 28px;
        width: 100%;
        color: #1e1e1e;
      }
    }
  }
  .address {
    pointer-events: none; /* 禁止元素接收点击事件 */
  }

  .btn-submit {
    margin-top: 30px;
    margin-bottom: 80px;
  }
}
</style>
