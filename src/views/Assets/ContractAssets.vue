<script setup lang="ts" name="keepAliveContractAssets">
import { useUserStore } from '@/stores/user'
import { useMarketStore } from '@/stores/market'
import { formatNumber, getIconImage, formataFix2 } from '@/utils/utils'

const router = useRouter()
const userStore = useUserStore()
const { contractBalance, balanceLoading } = storeToRefs(userStore)
const { hasDataChange, typePriceMap } = storeToRefs(useMarketStore())

const showBalance = ref(false)
const totalAssets = ref(0)
const showAssetList = ref([])
const firstLoad = ref(true)

watch(hasDataChange, () => {
  if (typePriceMap.value.size === 0) {
    return
  }

  // 1、赋值
  contractBalance.value.forEach((item) => {
    if (item.type === 'usdt') {
      item.rateNumber = Number(item.number)
      return
    }
    item.rateNumber = Number(
      formatNumber(item.number * (typePriceMap.value.get(item.type) || 0), 8),
    )
  })

  // 2、排序
  contractBalance.value = contractBalance.value.sort((a, b) => b.rateNumber - a.rateNumber)

  const total = contractBalance.value.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.rateNumber)
  }, 0)

  totalAssets.value = Number(formatNumber(total, 8))
  showAssetList.value = contractBalance.value
  firstLoad.value = false
})

function handleIsShowChange(isShow: boolean) {
  showBalance.value = isShow
}

function onContract() {
  router.push('/newContract')
}
function onTransfer() {
  router.push('/transfer')
}
</script>

<template>
  <div class="spot-box">
    <div class="balance-box">
      <TotalBalances
        :amount="totalAssets"
        :is-show-detail-btn="false"
        @is-show-change="handleIsShowChange"
      />

      <div class="btns flex-box-sb">
        <div class="btn" @click="onContract">{{ $t('h5.tabbar.trade') }}</div>
        <div class="btn" @click="onTransfer">{{ $t('h5.user_info.assets.transfer') }}</div>
      </div>
    </div>

    <Loading v-if="balanceLoading && firstLoad" />

    <div v-else class="cell-list">
      <Empty v-if="showAssetList.length === 0 && !balanceLoading" class="empty" />
      <div class="cell-item" v-for="item in showAssetList" :key="item.key">
        <div class="top flex-box-nm">
          <img :src="getIconImage(item.type.toUpperCase())" />
          <div class="label">{{ item.type.toUpperCase() }}</div>
        </div>
        <div class="center">
          <div class="c-item">
            <div class="label">{{ $t('h5.contract.index.balance') }}</div>
            <div class="value v-1">
              <template v-if="showBalance">{{ formataFix2(item.number) }}</template>
              <template v-else>***</template>
            </div>
          </div>
          <div class="c-item">
            <div class="label v-2">{{ $t('h5.user_info.assets.occupy') }}</div>
            <div class="value v-2">
              <template v-if="showBalance">{{ formataFix2(item.occ) }}</template>
              <template v-else>***</template>
            </div>
          </div>
          <div class="c-item">
            <div class="label v-3">{{ $t('h5.user_info.assets.converted') }}(USDT)</div>
            <div class="value v-3">
              <template v-if="showBalance">{{ formataFix2(item.rateNumber) }}</template>
              <template v-else>***</template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.spot-box {
  border: 1px solid var(--cb-borderColor2);
  border-radius: 8px;
  margin: 0 14px;
  padding: 20px 16px 10px;
  color: var(--cb-fColor5);
  .skeleton {
    padding: 20px 0px;
  }
  .balance-box {
    border-bottom: 1px solid var(--cb-borderColor2);
    .btns {
      margin: 30px 0;
      flex-shrink: 0;
      gap: 20px;
      .btn {
        flex: 1;
        border-radius: 20px;
        padding: 13px 10px;
        text-align: center;
        font-size: 14px;
        background-color: var(--cb-btnBgc);
        color: #fff;
      }
    }
  }
  .asset-detail {
    box-shadow: 0 0.1px 0px rgb(32, 31, 31);
    .title {
      .label {
        font-size: 16px;
      }
    }
    .tip {
      font-size: 12px;
    }
  }
  .detail-titel {
    font-size: 15px;
  }
  .cell-list {
    margin-top: 20px;
    height: calc(var(--vh, 1vh) * 100 - 370px);
    overflow-y: auto;
    .empty {
      margin-top: 130px;
    }
    .cell-item {
      border-bottom: 1px solid var(--cb-borderColor2);
      padding: 20px 0;
      .top {
        margin-bottom: 16px;
        font-size: 13px;
        img {
          width: 24px;
          height: 24px;
          margin-right: 8px;
          border-radius: 50%;
        }
      }
      .center {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        box-sizing: border-box;
        .c-item {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .label {
            margin-bottom: 10px;
            font-size: 11px;
            width: 100%;
            white-space: normal;
            word-break: break-word;
          }
          .value {
            word-break: break-all;
            color: var(--cb-fColor2);
            font-size: 12px;
          }
          .v-1 {
            text-align: left;
          }
          .v-2 {
            text-align: center;
          }
          .v-3 {
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
