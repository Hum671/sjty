<script setup lang="ts">
import { showToast } from 'vant'
import router from '@/router'

const i18n = useI18n()
const route = useRoute()
const detailItem = ref(JSON.parse(route.query.detail as string) || {})
const pdDetailList = ref<Array<{ key: any; value: any }>>([])
const isSelect = ref(true)

watchEffect(() => {
  const detailInfo = detailItem.value
  pdDetailList.value = [
    {
      key: i18n.t('project_name'),
      value: detailInfo.title,
    },
    {
      key: i18n.t('project_progress'),
      value: `${detailInfo.process}%`,
    },
    {
      key: i18n.t('total_project'),
      value: `${detailInfo.totalInvestAmount} USDT`,
    },
    {
      key: i18n.t('Balance'),
      value: `${detailInfo.remainAmount} USDT`,
    },
    {
      key: i18n.t('limit_the_number_of_votes'),
      value: detailInfo.timeLimit,
    },
    {
      key: i18n.t('average_daily_income'),
      value: `${detailInfo.avgRate}%`,
    },
  ]
})

function handlePayClick() {
  if (isSelect.value) {
    // to do
  } else {
    showToast(i18n.t('pls_read_financial'))
  }
}

function toXiye() {
  router.push('/financial-agreement')
}
</script>

<template>
  <div class="trade-detail-box light">
    <Navbar2 :title="$t('transaction_details')" />
    <IntrCard :isHiddenTitleLine="true" :title="detailItem.title">
      <div class="desc">
        <span>{{ detailItem.limitMin }}{{ $t('starting_amount') }}</span>
        <span class="split">|</span>
        <span>{{ $t('limit_cast') }}{{ detailItem.limitMax }}</span>
        <span class="split">|</span>
        <span>{{ $t('lock_up') }}{{ detailItem.days }}{{ $t('day') }}</span>
      </div>
    </IntrCard>
    <IntrCard :isHiddenTitleLine="true" :title="$t('buy_limit')">
      <div class="desc1">{{ $t('Minimum_purchase') }} {{ detailItem.limitMin }}USDT</div>
    </IntrCard>
    <IntrCard :title="$t('product_detail')" :list="pdDetailList" class="detail" />
    <div class="bottom">
      <div class="pay" @click="handlePayClick">{{ $t('pay') }}</div>
      <div class="xieyi flex-box-sa">
        <div class="bo flex-box-nm">
          <div class="box" @click="isSelect = !isSelect">
            <van-icon v-if="isSelect" class="check" name="success" />
          </div>
          <div class="btm">
            {{ $t('read_agree') }}
            <a @click="toXiye">{{ $t('financial_agreement') }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.trade-detail-box {
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100);
  .desc {
    color: #999999;
    span {
      font-size: 11.5px;
    }
    .split {
      margin: 0 9px;
    }
  }
  .desc1 {
    color: #999999;
    font-size: 12px;
  }
  :deep(.detail) {
    .label,
    .value {
      font-size: 14px !important;
    }
  }
}
.bottom {
  margin-top: 160px;
  .pay {
    width: 90%;
    height: 45px;
    line-height: 45px;
    background-color: #32353e;
    margin: 0 auto;
    text-align: center;
    border-radius: 6px;
    margin-bottom: 35px;
    font-size: 16px;
  }

  .bo {
    .box {
      width: 17px;
      height: 17px;
      border-radius: 50%;
      border: 1px solid #999999;
      margin-right: 10px;
      .check {
        background-color: #1989fa;
        color: #fff;
        border-radius: 50%;
        font-size: 18px;
      }
    }
  }
  .btm {
    color: #999999;
    a {
      color: #0c44ff;
      text-decoration-line: underline;
    }
  }
}
</style>
