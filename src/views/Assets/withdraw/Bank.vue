<script setup lang="ts">
import useCurrencyHook from '@/hooks/useCurrencyHook'
import { useUserStore } from '@/stores/user'
import { useConfigStore } from '@/stores/config'
import router from '@/router'
import { withdraw, getBankInfo } from '@/api/user'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { showToast } from 'vant'

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
const password = ref('')
const loading = ref(false)
const showBottom = ref(false)
const isBankInfoEditAble = ref(false)
const remark = reactive({
  bank: '',
  banchbank: '',
  account: '',
  code: '',
  accountnumber: null,
})
let standard = ''
const assetList = ref<any[]>([
  {
    key: 'USDT-ERC',
    name: 'USDT-ERC',
    callback: handleSelect,
  },
  {
    key: 'USDT-TRC',
    name: 'USDT-TRC',
    callback: handleSelect,
  },

  {
    key: 'ETH-ERC',
    name: 'ETH-ERC',
    callback: handleSelect,
  },
  {
    key: 'BTC',
    name: 'BTC',
    callback: handleSelect,
  },
  {
    key: 'TWD',
    name: t('h5.bank.money.twd'),
    callback: handleSelect,
  },
  {
    key: 'USD',
    name: t('h5.bank.money.usd'),
    callback: handleSelect,
  },
  {
    key: 'EUR',
    name: t('h5.bank.money.eur'),
    callback: handleSelect,
  },
  {
    key: 'CAD',
    name: t('h5.bank.money.cad'),
    callback: handleSelect,
  },
  {
    key: 'HKD',
    name: t('h5.bank.money.hkd'),
    callback: handleSelect,
  },
  {
    key: 'GBP',
    name: t('h5.bank.money.gbp'),
    callback: handleSelect,
  },
  {
    key: 'JPY',
    name: t('h5.bank.money.jpy'),
    callback: handleSelect,
  },
  {
    key: 'AUD',
    name: t('h5.bank.money.aud'),
    callback: handleSelect,
  },
  {
    key: 'INR',
    name: t('h5.bank.money.inr'),
    callback: handleSelect,
  },
  {
    key: 'GEL',
    name: t('h5.bank.money.gel'),
    callback: handleSelect,
  },
  {
    key: 'THB',
    name: t('h5.bank.money.thb'),
    callback: handleSelect,
  },
])

// 手续费
const fee = computed(() => {
  if (assetConfig.value) {
    const find = assetConfig.value.find((item) => item.key === 'WITHDRAW_FEE')
    return find?.value ?? ''
  }
  return ''
})

watchEffect(() => {
  getBankInfo().then((res) => {
    if (res.code === SUCCESS_CODE) {
      isBankInfoEditAble.value = !res.data
      remark.account = res.data?.account
      remark.accountnumber = res.data?.accountnumber
      remark.bank = res.data?.bank
    }
  })
})

watchEffect(() => {
  if (currency.value && userBalance.value) {
    if (currency.value === 'ETH') {
      balance.value = Number(userBalance.value.eth)
    } else if (currency.value === 'BTC') {
      balance.value = Number(userBalance.value.btc)
    } else if (currency.value === 'USDT') {
      balance.value = Number(userBalance.value.usdt)
    } else {
      balance.value = 0
    }
  }
})

onMounted(() => {
  setCurreny(route.query.type as string)
  userStore.requestUserBalance()
  configStore.requestAssetsConfig()
})

function setCurreny(type: string) {
  currentCurrency.value = assetList.value.find((item) => item.key === type)

  if (currentCurrency.value) {
    const units = currentCurrency.value.key.split('-')
    currency.value = units?.[0] ?? ''
    standard = units?.[1] ?? ''
  }
}

function onAll() {
  number.value = String(balance.value)
}

function submitVerify() {
  if (!number.value) {
    showToast(`${t('h5.real.Please_enter')}${t('h5.bank.t2')}`)
    return false
  }

  if (!remark.bank) {
    showToast(`${t('h5.real.Please_enter')}${t('h5.bank.bankname')}`)
    return false
  }

  // if (!remark.banchbank) {
  // 	showToast(`${t('h5.real.Please_enter')}${t('h5.bank.banchbank')}`);
  // 	return false;
  // }

  if (!remark.account) {
    showToast(`${t('h5.real.Please_enter')}${t('h5.bank.account')}`)
    return false
  }

  if (!remark.accountnumber) {
    showToast(`${t('h5.real.Please_enter')}${t('h5.bank.acountnumber')}`)
    return false
  }

  if (!password.value) {
    showToast(t('h5.withdraw.password_placeholder'))
    return false
  }

  // 判断最小金额
  const minNumber =
    assetConfig.value.find((item) => item.key === `MIN_WITHDRAW_${currency.value}`)?.value ?? ''
  if (Number(number.value) === 0 || Number(number.value) < Number(minNumber)) {
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
    address: 'BANK',
    type: currency.value,
    password: password.value,
    standard,
    remark: JSON.stringify(remark),
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

function handleSelect(action) {
  setCurreny(action.key)
  number.value = ''
}

function handleRecord() {
  router.push('/withdraw/records')
}

function handleBack() {
  showBottom.value = true
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
        <div class="title">{{ $t('h5.bank.t1') }}</div>
        <div class="item" @click="handleBack">
          <img v-if="currentCurrency.icon" :src="currentCurrency.icon" />
          <span class="name">{{ currentCurrency.key }}</span>
          <span class="iconfont icon-yanzhengma text-ddd"></span>
        </div>
        <van-action-sheet
          v-model:show="showBottom"
          :actions="assetList"
          :cancel-text="$t('h5.common.cancel')"
          close-on-click-action
          safe-area-inset-bottom
          :description="$t('h5.swap.promat')"
        />
      </div>

      <div class="number container-item">
        <div class="title">{{ $t('h5.bank.t2') }}</div>
        <div class="item">
          <input
            v-model="number"
            :placeholder="`${t('h5.real.Please_enter')}${t('h5.bank.t2')}`"
            type="number"
          />
          <div class="suffix" @click="onAll">{{ $t('h5.common.all') }}</div>
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
        <div class="title">{{ $t('h5.bank.bankname') }}</div>
        <div class="item">
          <input
            v-model="remark.bank"
            :disabled="!isBankInfoEditAble"
            :placeholder="`${t('h5.real.Please_enter')}${t('h5.bank.bankname')}`"
            type="text"
          />
        </div>
      </div>
      <!-- <div class="number container-item">
				<div class="title">{{ $t('h5.bank.banchbank') }}</div>
				<div class="item">
					<input
						v-model="remark.banchbank"
						:placeholder="`${t('h5.real.Please_enter')}${t('h5.bank.banchbank')}`"
						type="text" />
				</div>
			</div> -->
      <div class="number container-item">
        <div class="title">{{ $t('h5.bank.account') }}</div>
        <div class="item">
          <input
            v-model="remark.account"
            :disabled="!isBankInfoEditAble"
            :placeholder="`${t('h5.real.Please_enter')}${t('h5.bank.account')}`"
            type="text"
          />
        </div>
      </div>
      <!-- <div class="number container-item">
				<div class="title">{{ $t('h5.bank.code') }}</div>
				<div class="item">
					<input
						v-model="remark.code"
						:placeholder="`${t('h5.real.Please_enter')}${t('h5.bank.code')}`"
						type="text" />
				</div>
			</div> -->
      <div class="number container-item">
        <div class="title">{{ $t('h5.bank.acountnumber') }}</div>
        <div class="item">
          <input
            v-model="remark.accountnumber"
            :disabled="!isBankInfoEditAble"
            :placeholder="`${t('h5.real.Please_enter')}${t('h5.bank.acountnumber')}`"
            type="text"
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
          <div class="text handing-fee">
            <span>{{ $t('h5.withdrwa.commission_fee') }}:</span>
            <span class="fee">{{ fee }}</span>
          </div>
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
