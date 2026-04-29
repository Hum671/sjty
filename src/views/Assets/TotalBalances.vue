<script setup lang="ts">
import { handleEncryption, usFormat } from '@/utils/utils'
import { useUserStore } from '@/stores/user'

const emits = defineEmits<{
  (e: 'isShowChange', isShow: boolean): void
}>()

withDefaults(
  defineProps<{
    amount?: number
    isShowDetailBtn?: boolean
    title?: string
  }>(),
  {
    amount: 0,
    isShowDetailBtn: true,
    title: 'h5.user_info.assets.wallet_assets_converted',
  },
)
const router = useRouter()
const isShow = ref(true)
const { todayIncome, todayIncomeYield } = storeToRefs(useUserStore())

watchEffect(() => {
  emits('isShowChange', isShow.value)
})
function toDetail() {
  router.push('/transaction-record')
}
</script>

<template>
  <div class="box flex-box-sb light">
    <div class="left">
      <div class="top flex-box-nm">
        <div class="label">{{ $t(title) }}</div>
        <div class="isShow" @click="isShow = !isShow">
          <EyeIcon v-if="isShow" />
          <EyeCloseIcon v-else />
        </div>
      </div>
      <div class="amount">
        <span>{{ handleEncryption(`$${usFormat(amount)}`, isShow) || 0 }}</span>
        <span class="unit" v-if="isShow">USDT</span>
      </div>
      <div class="income">
        <span class="label">{{ $t('h5.purchaseGold.today_Earnings') }}</span>
        <span v-if="isShow" class="unit" :class="todayIncome.includes('-') ? 'red' : 'green'">
          ${{ usFormat(Number(todayIncome).toFixed(2)) }} ({{
            usFormat(Number(todayIncomeYield).toFixed(4))
          }}%)
        </span>
        <span v-else class="unit"> ****** </span>
      </div>
    </div>
    <div v-if="isShowDetailBtn" class="right" @click="toDetail">
      <DetailIcon class="detail" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.box {
  .left {
    width: 100%;
    .top {
      width: 100%;
      margin-bottom: 14px;
      color: var(--cb-fColor5);
      .label {
        margin-right: 14px;
        font-size: 17px;
      }
      .isShow {
        position: relative;
        top: -2px;
        font-size: 22px;
        color: #999999;
      }
    }
    .amount {
      color: var(--cb-fColor2);
      span {
        font-size: 22px;
        font-weight: bold;
      }
      .unit {
        margin-left: 6px;
        font-size: 16px;
        color: #999999;
      }
    }
    .income {
      margin-top: 20px;
      color: var(--cb-fColor5);
      .label {
        font-size: 16px;
        font-weight: normal;
      }
      .unit {
        margin-left: 6px;
        font-size: 16px;
        color: var(--cb-fColor2);
      }
    }
  }
  .right {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 29px;
    background-color: #4f4f4f;
    border-radius: 50%;
    .detail {
      font-size: 18px;
    }
  }
}
.light {
  .right {
    background-color: #a3a2a2;
    color: #fff;
  }
}
.red {
  color: #ff4834 !important;
}
.green {
  color: #00c572 !important;
}
</style>
