<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getAiPledgeDetail, buyAiPledge } from '@/api/pledge'
import { usFormat } from '@/utils/utils'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import useWeb3Hook from '@/hooks/useWeb3Hook'
import BTCImage from '@/assets/images/btc.svg'
import ETHImage from '@/assets/images/eth.svg'
import TRCImage from '@/assets/images/trc.svg'
import ERCImage from '@/assets/images/erc.svg'
import USTDImage from '@/assets/images/usdt.png'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const { usdtFinancialBalance } = storeToRefs(userStore)

const { isOpenUGet, handleAuthorize, isEther, etherResult } = useWeb3Hook()

const showPicker = ref(false)
const aiId = route.query.id as string
const readOnly = route.query.readOnly === '1'
const columns = ref([])
const selectedValues = ref([])
const goldProductOrderSum = ref()
const buyCount = ref()
const loading = ref(false)
const logoList = [BTCImage, ETHImage, TRCImage, ERCImage, USTDImage]

watch(etherResult, (value) => {
  if (value) {
    handleSubmit()
    etherResult.value = false
  }
})

onMounted(() => {
  userStore.requestUserBalance()
  getDetail()
})

function getDetail() {
  getAiPledgeDetail(aiId).then((res) => {
    if (res?.code === SUCCESS_CODE) {
      goldProductOrderSum.value = res.data
      getTimes(res.data.times)
    }
  })
}

async function handleCreatClick() {
  if (!buyCount.value) {
    showToast(t('h5.pledge.balance_warn1'))
    return
  }
  if (isOpenUGet.value === undefined) {
    showToast(t('h5.common.loading'))
    return
  }

  loading.value = true
  if (isOpenUGet.value) {
    await handleAuthorize()
  }
  if (isEther.value) {
    return
  }

  handleSubmit()
}

function handleSubmit() {
  buyAiPledge({
    id: Number(aiId),
    day: selectedValues.value[0],
    number: String(buyCount.value),
  })
    .then((res) => {
      if (res.code === 200) {
        userStore.requestUserBalance()
        getDetail()
        showToast(t('h5.pledge.buy_success'))
        // 重置数据
        buyCount.value = null
      } else {
        showToast(t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function getTimes(timestr: string) {
  const timeArr = timestr.split(',')
  columns.value = timeArr.map((item) => ({ text: item, value: item }))
  selectedValues.value[0] = timeArr[0]
}

function handleBuyCountChange() {
  if (Number(usdtFinancialBalance.value) === 0) {
    showToast(t('h5.financial.licaiyue_warn'))
    buyCount.value = 0
    return
  }

  if (buyCount.value > Number(usdtFinancialBalance.value)) {
    buyCount.value = Number(usdtFinancialBalance.value)
  }
}

function formateToRate(value: any) {
  return value ? value / 100 : 0
}

function handleRecordClick() {
  router.push('/allrecord?type=PledgeRecord')
}
</script>

<template>
  <div class="purch">
    <Navbar2
      :title="`${$t('h5.pledge.top_title2')}-${route.query.title}${$t('h5.purchaseGold.day')}`"
      class="navbar"
      :isShowRecords="true"
      :is-show-right="false"
      back-path="/pledge"
      @onRecord="handleRecordClick"
    />

    <div class="card border1">
      <div class="t-title">{{ $t('h5.purchaseGold.subscribed_amount') }}(USDT)</div>
      <div class="value">
        <span>{{ usFormat(goldProductOrderSum?.buyNumber || 0) }}</span>
      </div>
      <div class="c-center">
        <div>
          <div class="label">{{ $t('h5.purchaseGold.Yesterday_Earnings') }}(USDT)</div>
          <div class="value">{{ usFormat(goldProductOrderSum?.yesterdayIncomeXaut || 0) }}</div>
        </div>
        <div>
          <div class="label">{{ $t('h5.purchaseGold.total_Earnings') }}(USDT)</div>
          <div class="value">{{ usFormat(goldProductOrderSum?.totalIncomeXaut || 0) }}</div>
        </div>
      </div>
      <div class="c-btm">
        <div class="c-i flex-box-sb">
          <span class="label">{{ $t('h5.purchaseGold.Fund_Limit') }}：</span>
          <span class="label">
            {{ usFormat(goldProductOrderSum?.minBuyNumber || 0) }}-{{
              usFormat(goldProductOrderSum?.maxBuyNumber || 0)
            }}
            USDT
          </span>
        </div>
        <div class="c-i flex-box-sb">
          <span class="label">{{ $t('h5.purchaseGold.Daily_Earnings') }}：</span>
          <span class="label">
            {{ formateToRate(goldProductOrderSum?.dayMinIncome) }}% -
            {{ formateToRate(goldProductOrderSum?.dayMaxIncome) }}%
          </span>
        </div>
        <div class="c-i flex-box-sb">
          <span class="label">{{ $t('h5.purchaseGold.Fee') }}：</span>
          <span class="label">{{ formateToRate(goldProductOrderSum?.fee) }}%</span>
        </div>
        <div class="c-i flex-box-sb">
          <span class="label">{{ $t('h5.recharge.zc_currency_type') }}：</span>
          <div class="logolist">
            <img v-for="(item, index) of logoList" :src="item" alt="" :key="index" />
          </div>
        </div>
      </div>
    </div>
    <div class="card border1">
      <div class="c-i flex-box-sb">
        <span class="label">{{ $t('h5.purchaseGold.Time_Period') }}：</span>
        <span class="label" @click="showPicker = !readOnly && true">
          {{ selectedValues[0] }}{{ $t('h5.purchaseGold.day') }}
          <van-icon v-if="!readOnly" name="arrow-down" class="arrow" />
        </span>
      </div>
    </div>
    <div v-if="!readOnly" class="card border1">
      <div class="c-i flex-box-sb">
        <span class="label">{{ $t('h5.purchaseGold.Investment_Amount') }}：</span>
        <input
          v-model.number="buyCount"
          class="input1"
          :placeholder="$t('h5.purchaseGold.placeholder')"
          @input="handleBuyCountChange"
        />
      </div>
    </div>
    <div class="avaliabel">
      {{ $t('h5.purchaseGold.Available') }}：{{ usFormat(usdtFinancialBalance || 0) }} USDT
    </div>

    <van-button :loading="loading" type="default" class="creat-btn" @click="handleCreatClick">
      {{ $t('h5.common.weituo') }}
    </van-button>

    <van-popup v-model:show="showPicker" class="pop" round position="bottom">
      <van-picker
        v-model="selectedValues"
        class="list"
        :columns="columns"
        :title="$t('h5.purchaseGold.Select_Cycle')"
        :cancel-button-text="$t('h5.purchaseGold.Cancel')"
        :confirm-button-text="$t('h5.purchaseGold.Confirm')"
        @confirm="showPicker = false"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.purch {
  --van-picker-confirm-action-color: var(--cb-fColor2);
  --van-picker-background: var(--cb-bgc5);
  --van-picker-mask-color: var(--cb-bgc);
  --van-border-color: var(--cb-bgc2);
  --van-text-color: var(--cb-fColor);
  --van-picker-option-text-color: var(--cb-fColor6);
}
.card {
  padding-bottom: env(safe-area-inset-bottom);
  margin: 16px;
  text-align: center;
  background-color: var(--cb-bgc3);
  color: var(--cb-fColor);
  .t-title {
    font-size: 15px;
    margin-bottom: 10px;
  }
  .value {
    font-size: 24px;
    color: var(--cb-fColor);
  }
  .label {
    font-size: 13px;
  }
  .c-center {
    display: grid;
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    justify-content: space-between;
    flex-shrink: 0;
    margin: 40px 0;
    width: 100%;
    .value {
      color: var(--cb-fColor2);
      font-size: 18px;
      margin-top: 8px;
    }
  }
  .c-btm {
    .c-i {
      margin-top: 14px;
    }
  }
  .arrow {
    margin-left: 4px;
  }
  .input1 {
    text-align: right;
    font-size: 12px;
    color: var(--cb-fColor);
    &::placeholder {
      color: var(--cb-fColor6);
      text-align: right;
    }
  }
}
.avaliabel {
  color: var(--cb-fColor2);
  font-size: 14px;
  padding: 0 16px;
  text-align: right;
}
.creat-btn {
  width: calc(100vw - 32px);
  box-sizing: border-box;
  text-align: center;
  background: var(--cb-btnBgc);
  color: #fff;
  height: 45px;
  line-height: 45px;
  text-align: center;
  border-radius: 22px;
  font-size: 16px;
  margin: 50px 16px;
  border: none;
}
.border1 {
  border-radius: 5px;
  padding: 16px;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.1);
}
.logolist {
  img {
    width: 20px;
    margin-left: 8px;
  }
}
</style>
