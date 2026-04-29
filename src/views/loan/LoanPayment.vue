<script setup lang="ts">
import { getRepaymentRecord, getLoanConfig, loanrePaymentApi } from '@/api/loan'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { uploadImage } from '@/api/userInfo'
import router from '@/router'
import { usFormat } from '@/utils/utils'
import { showToast } from 'vant'

const route = useRoute()
const { t } = useI18n()
const prepaybackNum = ref()
const paymentData = ref()
const showPopover = ref(false)
const subLoading = ref(false)
const needNumber = ref()
const actions = ref([])
const currentCoinType = ref()
const fileList2 = ref([])
const picId = ref<number>()
const queryData = JSON.parse(route.query.data)
const queryCurrentPrice = JSON.parse(route.query.currentPrice)

watch(
  () => [paymentData.value, actions.value],
  () => {
    if (actions.value.length === 0) {
      return
    }

    if (paymentData.value) {
      // 初始化凭证
      picId.value = paymentData.value.certificate
      nextTick(() => {
        setTimeout(() => {
          fileList2.value[0] = {
            url: `${paymentData.value.certificatePath.host}/${paymentData.value.certificatePath.filepath}`,
          }
        }, 500)
      })
      // 初始化应还金额
      prepaybackNum.value = Number(paymentData.value.number)
      // 初始化应还数量
      needNumber.value = Number(paymentData.value.needNumber)
      currentCoinType.value = actions.value.find((item) => item.text === paymentData.value.currency)
    } else {
      // 没有还款记录，默认使用usdt还款
      currentCoinType.value = actions.value[2]
      initByRouteQuery()
    }
  },
)

onMounted(() => {
  getLoanConfig().then((res) => {
    handleData(res.data)
  })

  getRepaymentRecord(queryData.id).then((res) => {
    if (res.code === 200) {
      paymentData.value = res.data
    }
  })
})

function initByRouteQuery() {
  prepaybackNum.value = prePayBack(queryData.rate, queryData.amount, queryData.cycle)

  if (currentCoinType.value?.text.includes('ETH')) {
    needNumber.value = prepaybackNum.value / queryCurrentPrice.eth || 0
  }

  if (currentCoinType.value?.text.includes('BTC')) {
    needNumber.value = prepaybackNum.value / queryCurrentPrice.btc || 0
  }

  if (currentCoinType.value?.text.includes('USDT')) {
    needNumber.value = prepaybackNum.value || 0
  }
}

function prePayBack(rate, amount, day) {
  const allRate = Number(rate / 1000000) * day * Number(amount)
  return Number(allRate) + Number(amount)
}

function handleData(list) {
  const newList = []
  list.forEach((item) => {
    if (item.key === 'LOAN_BTC') {
      newList.push({ text: 'BTC', value: item.value })
    }

    if (item.key === 'LOAN_ETH') {
      newList.push({ text: 'ETH', value: item.value })
    }

    if (item.key === 'LOAN_USDT_TRC') {
      newList.push({ text: 'USDT_TRC', value: item.value })
    }
  })
  actions.value = newList
}

function onSelect(action) {
  currentCoinType.value = action
  initByRouteQuery()
}

function afterRead(file) {
  file.status = 'uploading'
  uploadImage(file)
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        picId.value = res.data.id
        file.status = ''
      } else {
        file.status = 'failed'
        showToast(res.msg)
        fileList2.value = []
      }
    })
    .catch(() => {
      file.status = 'failed'
      fileList2.value = []
    })
}

function onSubmit() {
  if (!picId.value || fileList2.value.length === 0) {
    showToast(t('h5.loan.repayment.pingzheng_empty'))
    return
  }
  loanrePaymentApi({
    loanId: queryData.id,
    currency: currentCoinType.value.text,
    address: currentCoinType.value.value,
    certificate: picId.value,
    needNumber: needNumber.value,
  })
    .then((res) => {
      if (res.code === 200) {
        showToast(t('h5.loan.repayment.success'))
        router.back()
      }
    })
    .catch((err) => {
      showToast(err)
    })
}
</script>

<template>
  <div class="payment">
    <Navbar2
      :title="$t('h5.loan.repayment.title')"
      :is-show-right="false"
      back-path="/allrecord?type=LoanRecord"
    />
    <div class="content">
      <div class="item flex-box-sb">
        <div class="label">{{ $t('h5.loan.repayment.yinghuanjine') }}</div>
        <div class="value">{{ usFormat(prepaybackNum) }} USDT</div>
      </div>

      <div class="item flex-box-sb">
        <div class="label">{{ $t('h5.loan.repayment.cointype') }}</div>
        <van-popover
          v-model:show="showPopover"
          :actions="actions"
          placement="left"
          @select="onSelect"
        >
          <template #reference>
            <div class="cointype flex-box-sb">{{ currentCoinType?.text }}<i></i></div>
          </template>
        </van-popover>
      </div>

      <div class="item flex-box-sb">
        <div class="label">{{ $t('h5.loan.repayment.number') }}</div>
        <div class="value">
          {{ usFormat(needNumber) }} {{ currentCoinType?.text.replace('_TRC', '') }}
        </div>
      </div>

      <div class="item flex-box-sb">
        <div class="label">{{ $t('h5.loan.repayment.address') }}</div>
        <div class="value">{{ currentCoinType?.value }}</div>
      </div>

      <div class="pc">
        <div class="tip">{{ $t('h5.loan.repayment.pingzheng') }}</div>
        <div class="p1 flex-box-sa">
          <van-uploader
            v-model="fileList2"
            :deletable="true"
            :after-read="(file) => afterRead(file)"
            max-count="1"
          >
            <span class="add-icon u-icon__icon uicon-plus u-iconfont"></span>
          </van-uploader>
        </div>
      </div>
    </div>
    <div class="subbtn">
      <van-button :loading="subLoading" class="btn" size="large" @click="onSubmit">
        {{ $t('h5.loan.repayment.title') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.payment {
  padding-bottom: 100px;
  .content {
    padding: 16px;
    .item {
      margin-bottom: 16px;
      .cointype {
        gap: 8px;
        position: relative;
        padding: 4px 10px;
        border-radius: 5px;
        background-color: var(--cb-btnBgc);
        i {
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #fff; /* 设置三角形的颜色 */
        }
      }
    }
  }
  .pc {
    margin-bottom: 20px;
    .p1 {
      font-size: 28px;
      height: 140px;
      padding: 5px;
      background-color: var(--cb-bgc);
      border: 1px solid var(--cb-borderColor2);
    }
    .tip {
      margin-bottom: 12px;
      text-align: left;
    }
  }
  .subbtn {
    position: fixed;
    bottom: 0;
    background-color: #000;
    padding: 16px;
    width: 100vw;
    box-sizing: border-box;
    .btn {
      text-align: center;
      padding: 14px 16px;
      background-color: var(--cb-btnBgc3);
      border-radius: 5px;
      color: var(--cb-fColor);
      border: none;
    }
  }
  :deep(.van-uploader__preview) {
    margin: 0;
  }
  :deep(.van-uploader__preview-image) {
    width: 100%;
    height: 150px;
  }
  :deep(.van-uploader__upload) {
    border: 1px dotted #98a7b1;
    width: 100px;
    height: 100px;
    margin: 0;
  }
}
</style>
