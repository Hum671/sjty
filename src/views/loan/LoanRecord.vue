<script setup lang="ts">
import { getLoanRecords } from '@/api/loan'
import type { LoanRecordItem, LoanCurrentPrice } from '@/api/loan/model/loanModel'
import { formatToLocaleTime, usFormat } from '@/utils/utils'

const props = defineProps<{
  activeKey?: string
}>()

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const finished = ref(false)
const { t } = useI18n()
const isAllRecord = ref(false)
const loanList = ref<LoanRecordItem[]>()
const currentPrice = ref<LoanCurrentPrice>()

watch(
  () => props.activeKey,
  () => {
    if (props.activeKey === 'LoanRecord') {
      isAllRecord.value = route.path === '/allrecord'
      loanList.value = []
      finished.value = false
      handleRequest()
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  if (!isAllRecord.value && !props.activeKey) {
    handleRequest()
  }
})

function onLoad() {
  if (finished.value) {
    return
  }

  handleRequest()
}

function handleRequest() {
  loading.value = true
  getLoanRecords()
    .then((res) => {
      if (res.code === 200) {
        loanList.value = res.data?.list
        currentPrice.value = res.data?.currentPrice
      }
    })
    .finally(() => {
      finished.value = true
      loading.value = false
    })
}

function handleStatusClass(status: number) {
  if (status === 2) {
    return 'finished'
  }
  if (status === 3) {
    return 'reject'
  }
  if (status === 4) {
    return 'finished'
  }
}

function handleRepaymentStatusClass(repaymentStatus: number) {
  if (repaymentStatus === 1) {
    return 'repayBtn_1'
  }
  if (repaymentStatus === 2) {
    return 'repayBtn_2'
  }
  if (repaymentStatus === 3) {
    return 'repayBtn_3'
  }
  if (repaymentStatus === 4) {
    return 'repayBtn_4'
  }
}

function handleStatusText(status: number) {
  if (status === 1) {
    return t('h5.loan.record.status_1')
  }
  if (status === 2) {
    return t('h5.loan.record.status_2')
  }
  if (status === 3) {
    return t('h5.loan.record.status_3')
  }
  if (status === 4) {
    return t('h5.loan.record.status_4')
  }
}

function handleRepaymentStatusText(repaymentStatus: number) {
  if (repaymentStatus === 1) {
    return t('h5.loan.record.repaymentStatus_1')
  }
  if (repaymentStatus === 2) {
    return t('h5.loan.record.repaymentStatus_2')
  }
  if (repaymentStatus === 3) {
    return t('h5.loan.record.repaymentStatus_3')
  }
  if (repaymentStatus === 4) {
    return t('h5.loan.record.repaymentStatus_4')
  }
}

function prePayBack(rate, amount, day) {
  const allRate = Number(rate / 1000000) * day * Number(amount)
  return Number(allRate) + Number(amount)
}

function onPaymentClick(item: LoanRecordItem) {
  // 还款待审核和还款完成不可点击
  if (item.repaymentStatus === 2 || item.repaymentStatus === 4) {
    return
  }

  router.push({
    path: '/loan/loanPayment',
    query: {
      data: JSON.stringify(item),
      currentPrice: JSON.stringify(currentPrice.value),
    },
  })
}
</script>

<template>
  <div class="records light">
    <Navbar2 v-if="!isAllRecord" :title="$t('h5.loan.record.title')" :is-show-right="false" />

    <van-list
      v-model:loading="loading"
      :finished="finished"
      :finished-text="$t('h5.common.no_more')"
      @load="onLoad"
    >
      <div class="list">
        <div v-for="item in loanList" :key="item.id" class="item">
          <div class="flex">
            <div>{{ $t('h5.common.time') }}</div>
            <div class="time">{{ formatToLocaleTime(item.createTime) }}</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.loan.jine') }}</div>
            <div class="amount">{{ usFormat(item.amount) }} USDT</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.loan.qixian') }}</div>
            <div class="amount">{{ Number(item.cycle) }}{{ $t('h5.pledge.day') }}</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.loan.ribilixi') }}</div>
            <div class="amount">{{ Number(item.rate / 10000) }}%</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.loan.yuguyinghuan') }}</div>
            <div class="amount">
              {{ usFormat(prePayBack(item.rate, item.amount, item.cycle)) }} USDT
            </div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.passwor.phone_num') }}</div>
            <div class="amount">{{ item.phone }}</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.loan.address') }}</div>
            <div class="amount">{{ item.address }}</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.loan.age') }}</div>
            <div class="amount">{{ item.age }}</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.loan.citizenship') }}</div>
            <div class="amount">{{ item.citizenship }}</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.loan.annualIncome') }}</div>
            <div class="amount">{{ usFormat(item.annualIncome) || item.annualIncome }}</div>
          </div>

          <div class="flex">
            <div>{{ $t('h5.loan.record.status') }}</div>
            <div class="status" :class="handleStatusClass(item.status)">
              {{ handleStatusText(item.status) }}
            </div>
          </div>

          <!-- <div class="flex">
            <div>{{ $t('h5.loan.record.repaymentStatus') }}</div>
            <div class="status" :class="handleStatusClass(item.status)">
              {{ handleStatusText(item.status, item.repaymentStatus) }}
            </div>
          </div> -->
          <div
            v-if="item.status === 2"
            class="repayBtn"
            :class="handleRepaymentStatusClass(item.repaymentStatus)"
            @click="onPaymentClick(item)"
          >
            {{ handleRepaymentStatusText(item.repaymentStatus) }}
          </div>
        </div>
      </div>
      <template v-if="loanList.length === 0" #finished>
        <Empty class="empty" />
      </template>
    </van-list>

    <div class="end"></div>
  </div>
</template>

<style lang="less" scoped>
@psize: 16px;

.records {
  .empty {
    margin-top: 150px;
    line-height: 20px;
  }
  .list {
    padding: @psize;
    display: flex;
    flex-direction: column;
    gap: @psize;

    .item {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 15px 10px;
      border-radius: 5px;
      border: 1px solid var(--cb-borderColor2);
      .coinlogo {
        margin-right: 8px;
        width: 26px;
      }
      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--cb-fColor9);
        .time {
          color: var(--cb-fColor);
        }
        &.title {
          color: var(--cb-fColor);
        }
        .amount {
          color: var(--cb-fColor);
        }
        .status {
          color: #2277fc;
          &.finished {
            color: #17ba83;
          }
          &.reject {
            color: #f04a5a;
          }
        }
      }
      .repayBtn {
        padding: 12px;
        text-align: center;
        border-radius: 5px;
        color: #fff;
      }
      .repayBtn_1 {
        background-color: #2277fc;
      }
      .repayBtn_2 {
        background-color: #f04a5a;
      }
      .repayBtn_3 {
        background-color: #f04a5a;
      }
      .repayBtn_4 {
        background-color: #17ba83;
      }
    }
  }
  .end {
    height: 20px;
  }
}
</style>
