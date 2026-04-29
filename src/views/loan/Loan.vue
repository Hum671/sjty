<script setup lang="ts">
import { getLoanConfig, loanApplyApi } from '@/api/loan/index'
import { formatInputUs, usFormat, parseFormatInputUsNumber } from '@/utils/utils'
import { showToast } from 'vant'

const { t } = useI18n()
const router = useRouter()
const loading = ref(false)
const subLoading = ref(false)
const loanConfig = ref({})
const timerate = ref<{ day: number; rate: number }[]>([])
const loanBtc = ref()
const loanEth = ref()
const loanUsdtTrc = ref()
const currentTimerate = ref()
const phone = ref()
const address = ref()
const age = ref()
const annualIncome = ref()
const citizenship = ref()
const amount = ref()
const allRate = computed(() => {
  if (!currentTimerate.value || !amount.value) {
    return 0
  }

  return (
    Number((currentTimerate.value.rate / 100).toFixed(5)) * currentTimerate.value.day * amount.value
  )
})

const prePayBack = computed(() => {
  if (!allRate.value) {
    return 0
  }

  return allRate.value + amount.value
})

onMounted(() => {
  getLoanConfig().then((res) => {
    loanConfig.value = res.data
    handleData(res.data)
  })
})

function handleData(list) {
  list.forEach((item) => {
    if (item.key === 'LOAN_TIME_RATE') {
      const list = JSON.parse(item.value)
      list[0].min = 1000
      list[0].max = 100000
      list[1].min = 1000
      list[1].max = 1000000
      list[2].min = 1000
      list[2].max = 2000000
      timerate.value = list
      currentTimerate.value = timerate.value[1]
    }

    if (item.key === 'LOAN_BTC') {
      loanBtc.value = item.value
    }

    if (item.key === 'LOAN_ETH') {
      loanEth.value = item.value
    }

    if (item.key === 'LOAN_USDT_TRC') {
      loanUsdtTrc.value = item.value
    }
  })
}

function onTimerateClick(item) {
  currentTimerate.value = item
}

function verifyParam() {
  if (amount.value < currentTimerate.value.min || amount.value > currentTimerate.value.max) {
    showToast(t('h5.loan.amount_warn'))
    return false
  }

  if (!phone.value) {
    showToast(`${t('h5.passwor.phone_num')}${t('h5.loan.empty_warn')}`)
    return false
  }

  if (!address.value) {
    showToast(`${t('h5.loan.address')}${t('h5.loan.empty_warn')}`)
    return false
  }

  if (!age.value) {
    showToast(`${t('h5.loan.age')}${t('h5.loan.empty_warn')}`)
    return false
  }

  if (!annualIncome.value) {
    showToast(`${t('h5.loan.annualIncome')}${t('h5.loan.empty_warn')}`)
    return false
  }

  if (!citizenship.value) {
    showToast(`${t('h5.loan.citizenship')}${t('h5.loan.empty_warn')}`)
    return false
  }

  return true
}

function onSubmit() {
  if (verifyParam()) {
    subLoading.value = true
    loanApplyApi({
      amount: amount.value,
      cycle: currentTimerate.value.day,
      rate: currentTimerate.value.rate,
      phone: phone.value,
      address: address.value,
      age: age.value,
      annualIncome: annualIncome.value,
      citizenship: citizenship.value,
    })
      .then((res) => {
        if (res.code === 200) {
          showToast(t('h5.loan.submit_success'))
          resetParam()
        } else {
          showToast(t(res.msg))
        }
      })
      .finally(() => {
        subLoading.value = false
      })
  }
}

function resetParam() {
  amount.value = null
  phone.value = null
  address.value = null
  age.value = null
  annualIncome.value = null
  citizenship.value = null
}

function onRecordClick() {
  router.push('allrecord?type=LoanRecord')
}

function onInput(e) {
  const val = e.target.value
  // 去掉千分符，保持原始值
  amount.value = parseFormatInputUsNumber(val)
}

function onInput2(e) {
  const val = e.target.value
  // 去掉千分符，保持原始值
  annualIncome.value = parseFormatInputUsNumber(val)
}
</script>

<template>
  <div class="loan">
    <Navbar2 :title="$t('h5.loan.title')" :is-show-right="false" back-path="/home" />
    <van-skeleton v-if="loading" class="skeleton" title :row="3" />
    <div v-else class="content">
      <div class="record-btn" @click="onRecordClick">{{ $t('h5.loan.record') }}</div>

      <div>
        <div class="label flex-box-nm">
          <i class="cent"></i>
          {{ $t('h5.loan.qixian') }}
        </div>
        <div class="day-box flex-box-sb">
          <div
            v-for="item of timerate"
            class="day"
            :class="{ active: currentTimerate?.day === item.day }"
            :key="item.day"
            @click="onTimerateClick(item)"
          >
            {{ item.day }}{{ $t('h5.pledge.day') }}
          </div>
        </div>
      </div>

      <div>
        <div class="label flex-box-nm">
          <i class="cent"></i>
          {{ $t('h5.loan.qujian') }}
        </div>
        <div class="l-inp">
          {{ usFormat(currentTimerate?.min) }} - {{ usFormat(currentTimerate?.max) }}
        </div>
      </div>

      <div>
        <div class="label flex-box-nm">
          <i class="cent"></i>
          {{ $t('h5.loan.jine') }}
        </div>
        <div class="l-inp flex-box-sb">
          <input :value="formatInputUs(amount)" @input="onInput" />
          <img src="@/assets/svg/unit-t.svg" alt="" />
        </div>
      </div>

      <div>
        <div class="label flex-box-nm">
          <i class="cent"></i>
          {{ $t('h5.passwor.phone_num') }}
        </div>
        <div class="l-inp">
          <input v-model="phone" type="text" />
        </div>
      </div>

      <div>
        <div class="label flex-box-nm">
          <i class="cent"></i>
          {{ $t('h5.loan.address') }}
        </div>
        <div class="l-inp">
          <input v-model="address" type="text" />
        </div>
      </div>
      <div>
        <div class="label flex-box-nm">
          <i class="cent"></i>
          {{ $t('h5.loan.age') }}
        </div>
        <div class="l-inp">
          <input v-model="age" type="number" />
        </div>
      </div>
      <div>
        <div class="label flex-box-nm">
          <i class="cent"></i>
          {{ $t('h5.loan.annualIncome') }}(USD)
        </div>
        <div class="l-inp">
          <input :value="formatInputUs(annualIncome)" @input="onInput2" />
        </div>
      </div>
      <div>
        <div class="label flex-box-nm">
          <i class="cent"></i>
          {{ $t('h5.loan.citizenship') }}
        </div>
        <div class="l-inp">
          <input v-model="citizenship" type="text" />
        </div>
      </div>

      <div class="list">
        <div class="item flex-box-sb">
          <div class="lab">{{ $t('h5.loan.ribilixi') }}</div>
          <div class="value">{{ currentTimerate?.rate || 0 }}%</div>
        </div>
        <div class="item flex-box-sb">
          <div class="lab">{{ $t('h5.loan.zongbixi') }}</div>
          <div class="value">{{ usFormat(allRate) }} USDT</div>
        </div>
        <div class="item flex-box-sb">
          <div class="lab">{{ $t('h5.loan.huankuanjigou') }}</div>
          <div class="value">Derivmark</div>
        </div>
        <div class="item flex-box-sb">
          <div class="lab">{{ $t('h5.loan.huankuanfangshi') }}</div>
          <div class="value">Bullet payment</div>
        </div>
        <div class="item last flex-box-sb">
          <div class="lab">{{ $t('h5.loan.yuguyinghuan') }}</div>
          <div class="value">{{ usFormat(prePayBack) }} USDT</div>
        </div>
      </div>
    </div>

    <div class="subbtn">
      <van-button :loading="subLoading" class="btn" size="large" @click="onSubmit">
        {{ $t('h5.loan.lijijiebi') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.skeleton {
  padding: 20px 16px;
}
.content {
  font-size: 16px;
  padding: 16px;
  font-weight: normal;
  padding-bottom: 100px;
  .record-btn {
    padding: 12px;
    background-color: var(--cb-btnBgc2);
    color: #000;
    border-radius: 5px;
  }

  .label {
    margin: 20px 0 10px;
  }

  .l-inp {
    border: 1px solid var(--cb-borderColor2);
    padding: 12px;
    border-radius: 5px;
    background-color: var(--cb-loan-input-bgc);
    img {
      width: 20px;
    }
    input {
      width: 100%;
      color: var(--cb-fColor);
    }
  }

  .day-box {
    gap: 10px;
    .day {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid var(--cb-borderColor2);
      border-radius: 5px;
      text-align: center;
      background-color: var(--cb-btnBgc3);
      img {
        width: 20px;
      }
    }
    .active {
      background-color: var(--cb-loan-active-bg-color);
      color: var(--cb-loan-active-color);
    }
  }

  .cent {
    display: inline-block;
    margin-right: 5px;
    width: 8px;
    height: 8px;
    background-color: var(--cb-fColor);
    border-radius: 1px;
  }

  .list {
    margin: 20px 0;
    padding: 16px;
    border-radius: 5px;
    background-color: var(--cb-btnBgc3);
    .item {
      margin-bottom: 16px;
    }
    .last {
      margin-bottom: 0 !important;
    }
  }
}

.subbtn {
  position: fixed;
  bottom: 0;
  background-color: var(--cb-loan-bottom-bgc);
  padding: 16px;
  width: 100vw;
  box-sizing: border-box;
  .btn {
    text-align: center;
    padding: 14px 16px;
    background-color: var(--cb-loan-bottom-btn-bgc);
    border-radius: 5px;
    color: #fff;
    border: none;
  }
}
</style>
