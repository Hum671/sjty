<script setup lang="ts" name="keepAliveContractAssets">
import * as echarts from 'echarts'
import { useUserStore } from '@/stores/user'
import { useMarketStore } from '@/stores/market'
import { formatNumber, debounceFunc, usFormat } from '@/utils/utils'

const router = useRouter()
const userStore = useUserStore()
const { contractBalance, userBalance, financialBalance, balanceLoading } = storeToRefs(userStore)
const { hasDataChange, typePriceMap } = storeToRefs(useMarketStore())

const showBalance = ref(false)
const totalAssets = ref(0)
const firstLoad = ref(true)
const chartDom = ref()
const myChart = ref()
const contractTotal = ref()
const userTotal = ref()
const financialTotal = ref()
const contractPercenet = computed(() => {
  if (!contractTotal.value) {
    return 0
  }
  return (
    (contractTotal.value / (userTotal.value + contractTotal.value + financialTotal.value)) *
    100
  ).toFixed(2)
})
const userPercenet = computed(() => {
  if (!userTotal.value) {
    return 0
  }
  return (
    (userTotal.value / (userTotal.value + contractTotal.value + financialTotal.value)) *
    100
  ).toFixed(2)
})
const financialPercenet = computed(() => {
  if (!financialTotal.value) {
    return 0
  }
  return (
    (financialTotal.value / (userTotal.value + contractTotal.value + financialTotal.value)) *
    100
  ).toFixed(2)
})

watch(
  () => [hasDataChange.value],
  () => {
    if (typePriceMap.value.size === 0) {
      return
    }

    // 赋值交易賬戶
    contractBalance.value.forEach((item) => {
      if (item.type === 'usdt') {
        item.rateNumber = Number(item.number)
        return
      }
      item.rateNumber = Number(
        formatNumber(item.number * (typePriceMap.value.get(item.type) || 0), 8),
      )
    })

    // 赋值資金賬戶
    userBalance.value.forEach((item) => {
      if (item.type === 'usdt') {
        item.rateNumber = Number(item.number)
        return
      }

      item.rateNumber = Number(
        formatNumber(item.number * (typePriceMap.value.get(item.type) || 0), 8),
      )
    })

    // 赋值理财賬戶
    financialBalance.value.forEach((item) => {
      if (item.type === 'usdt') {
        item.rateNumber = Number(item.number)
        return
      }

      item.rateNumber = Number(
        formatNumber(item.number * (typePriceMap.value.get(item.type) || 0), 8),
      )
    })

    contractTotal.value = contractBalance.value.reduce((accumulator, currentValue) => {
      return accumulator + Number(currentValue.rateNumber)
    }, 0)

    userTotal.value = userBalance.value.reduce((accumulator, currentValue) => {
      return accumulator + Number(currentValue.rateNumber)
    }, 0)

    financialTotal.value = financialBalance.value.reduce((accumulator, currentValue) => {
      return accumulator + Number(currentValue.rateNumber)
    }, 0)

    totalAssets.value = Number(
      formatNumber(
        Number(contractTotal.value) + Number(userTotal.value) + Number(financialTotal.value),
        8,
      ),
    )
  },
)

watchEffect(() => {
  if (
    !balanceLoading.value &&
    contractTotal.value >= 0 &&
    userTotal.value >= 0 &&
    financialTotal.value >= 0
  ) {
    const data = [userTotal.value, contractTotal.value, financialTotal.value]
    debonceCreateEchart(data)
  }
})

function debonceCreateEchart(date: number[] = []) {
  const createFunc = debounceFunc(createEchart, 300)
  createFunc(date)
}

function createEchart(data: number[] = []) {
  if (!myChart.value) {
    myChart.value = echarts.init(chartDom.value)
  }
  myChart.value.setOption({
    color: ['#91cff3', '#ce885d', '#68be66'],
    series: [
      {
        type: 'pie',
        radius: ['50%', '80%'], // 设置环形图的内外半径
        center: ['50%', '50%'], // 饼图的中心位置
        avoidLabelOverlap: false, // 防止标签重叠
        data,
        labelLine: {
          show: false, // 去掉延伸线（指示线）
        },
        label: {
          show: false, // 去掉环形图上的标签
        },
      },
    ],
  })
}

function handleIsShowChange(isShow: boolean) {
  showBalance.value = isShow
}

function refresh() {
  myChart.value.dispose()
  myChart.value = null

  firstLoad.value = true
  userStore.requestUserBalance()
}

function goPath(path) {
  router.push(path)
}
</script>

<template>
  <div class="spot-box">
    <div class="balance-box">
      <TotalBalances
        title="h5.assets.all_alltitle"
        :amount="totalAssets"
        :is-show-detail-btn="false"
        @is-show-change="handleIsShowChange"
      />

      <div class="btns flex-box-sb">
        <div class="btn" @click="goPath('/recharge/index')">{{ $t('h5.assets.chongbi') }}</div>
        <div class="btn" @click="goPath('/withdraw/index')">{{ $t('h5.assets.tibi') }}</div>
        <div class="btn" @click="goPath('/swap')">{{ $t('h5.assets.shandui') }}</div>
      </div>
      <div class="btns flex-box-sb">
        <div class="btn b2" @click="goPath('/transfer')">
          {{ $t('h5.user_info.assets.transfer') }}
        </div>
        <div class="btn b2" @click="goPath('/allrecord')">{{ $t('h5.assets.zhangdan') }}</div>
      </div>
    </div>

    <Loading v-if="balanceLoading" />

    <div class="fenbu">
      <div class="title flex-box-nm">
        {{ $t('h5.assets.zcfenbu') }}
        <img src="@/assets/images/redo.svg" alt="" @click="refresh" />
      </div>
      <div class="flex-box-sb">
        <div class="ping" ref="chartDom"></div>
        <div class="right">
          <div class="r-t flex-box-sb">
            <span class="label1">{{ $t('h5.assets.zj_account') }}</span>
            <span>{{ userPercenet }}%</span>
          </div>
          <div class="r-t flex-box-sb">
            <span class="label2">{{ $t('h5.user_info.assets.contract_account') }}</span>
            <span>{{ contractPercenet }}%</span>
          </div>
          <div class="r-t flex-box-sb">
            <span class="label3">{{ $t('h5.financial.title') }}</span>
            <span>{{ financialPercenet }}%</span>
          </div>
        </div>
      </div>

      <div class="line"></div>

      <div class="list">
        <div class="item">
          <span class="label1">{{ $t('h5.assets.zj_account') }}</span>
          <div class="cen">${{ 0 }}</div>
          <span class="righ">{{ usFormat(userTotal) }}</span>
        </div>
        <div class="item">
          <span class="label2">{{ $t('h5.user_info.assets.contract_account') }}</span>
          <div class="cen">${{ 0 }}</div>
          <span class="righ">{{ usFormat(contractTotal) }}</span>
        </div>
        <div class="item">
          <span class="label3">{{ $t('h5.financial.title') }}</span>
          <div class="cen">${{ 0 }}</div>
          <span class="righ">{{ usFormat(financialTotal) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.spot-box {
  margin: 0 14px;
  color: var(--cb-fColor5);
  .skeleton {
    padding: 20px 0px;
  }
  .balance-box {
    background-color: var(--cb-bgc5);
    padding: 10px 0px 10px;
    border-radius: 12px;

    .btns {
      box-sizing: border-box;
      margin: 30px 0;
      gap: 10px;
      .btn {
        min-width: 80px;
        flex-shrink: 0;
        border-radius: 20px;
        padding: 13px 10px;
        text-align: center;
        font-size: 14px;
        background-color: var(--cb-assets-btn-bgc);
        word-wrap: break-word;
        border: 1px solid var(--cb-borderColor2);
      }
      .b2 {
        min-width: 130px;
      }
    }
  }
  .fenbu {
    background-color: var(--cb-bgc5);
    padding: 20px 0px 10px;
    font-size: 14px;
    border-top: 1px solid var(--cb-borderColor2);
    .title {
      font-size: 18px;
      margin-bottom: 5px;
      img {
        margin-left: 10px;
        width: 20px;
      }
    }
    .ping {
      width: 150px;
      height: 150px;
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      padding-left: 20px;
      height: 150px;
      .r-t {
        .label1 {
          position: relative;
          padding-left: 30px;
          color: #91cff3;
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 14px;
            height: 14px;
            background-color: #91cff3;
            border-radius: 50%;
          }
        }
        .label2 {
          position: relative;
          padding-left: 30px;
          color: #ce885d;
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 14px;
            height: 14px;
            background-color: #ce885d;
            border-radius: 50%;
          }
        }
        .label3 {
          position: relative;
          padding-left: 30px;
          color: #68be66;
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 14px;
            height: 14px;
            background-color: #68be66;
            border-radius: 50%;
          }
        }
      }
    }

    .line {
      margin: 30px 0;
      width: 100%;
      height: 1px;
      background-color: var(--cb-borderColor2);
    }
    .list {
      width: 100%;
      .item {
        display: grid;
        grid-template-columns: 30% 5% 65%;
        margin-bottom: 30px;
        font-size: 14px;
        .label1 {
          color: #91cff3;
        }
        .label2 {
          color: #ce885d;
        }
        .label3 {
          color: #68be66;
        }
        .cen {
          text-align: left;
        }
        .righ {
          text-align: right;
          color: #2faa70;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
