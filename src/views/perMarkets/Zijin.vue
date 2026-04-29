<script setup lang="ts" name="keepAliveAssetsView">
import { useUserStore } from '@/stores/user'
import { useMarketStore } from '@/stores/market'
import { formatNumber, getToken, getIconImage, formataFix2 } from '@/utils/utils'

import withdrawIcon from '@/assets/images/withdraw.png'
import exchangeIcon from '@/assets/images/exchange.png'
import depositIcon from '@/assets/images/deposit.png'
import crosschainIcon from '@/assets/images/crosschain.png'
import router from '@/router'

const props = defineProps<{
  componentsKey: string
}>()

const userStore = useUserStore()
const { contractBalance, balanceLoading } = storeToRefs(userStore)
const { hasDataChange, typePriceMap } = storeToRefs(useMarketStore())

const showBalance = ref(true)
const totalAssets = ref(0)
const assetList = ref([])
const showAssetList = ref([])
const btns = [
  {
    code: 'h5.recharge.title',
    icon: depositIcon,
    path: '/recharge/index',
  },
  {
    code: 'h5.withdraw.title',
    icon: withdrawIcon,
    path: '/withdraw/index',
  },
  {
    code: 'h5.gridmenu.Transfer',
    icon: exchangeIcon,
    path: '/swap',
  },
  {
    code: 'h5.user_info.assets.transfer',
    icon: crosschainIcon,
    path: '/transfer',
  },
]
const ZIJIN = 'Zijin'

watch(
  () => props.componentsKey,
  () => {
    if (props.componentsKey === ZIJIN) {
      if (!getToken()) {
        router.push('/login')
        return
      }
      userStore.requestUserBalance()
    }
  },
  {
    immediate: true,
  },
)

watch(contractBalance, (val) => {
  if (!val) {
    return
  }
  assetList.value = val
})

watch(hasDataChange, () => {
  if (typePriceMap.value.size === 0) {
    return
  }

  // 1、赋值
  assetList.value.forEach((item) => {
    if (item.type === 'usdt') {
      item.rateNumber = Number(item.number)
      return
    }
    item.rateNumber = Number(
      formatNumber(item.number * (typePriceMap.value.get(item.type) || 0), 8),
    )
  })
  // 2、排序
  assetList.value = assetList.value.sort((a, b) => b.rateNumber - a.rateNumber)

  const total = assetList.value.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.rateNumber)
  }, 0)

  totalAssets.value = Number(formatNumber(total, 8))
  showAssetList.value = assetList.value
})

function handleIsShowChange(isShow: boolean) {
  showBalance.value = isShow
}

function handleBtnClick(item: { code: string; path: string }) {
  router.push({
    path: item.path,
  })
}
</script>
<template>
  <div class="assets-box">
    <div class="spot-box">
      <div class="cell-list">
        <van-skeleton v-if="balanceLoading" class="skeleton" title :row="5" />
        <Empty v-if="showAssetList.length === 0 && !balanceLoading" />
        <div class="cell-item" v-for="item in showAssetList" :key="item.key">
          <div class="top flex-box-sb">
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
    <!-- <Loading v-if="balanceLoading" /> -->
  </div>
</template>

<style lang="less" scoped>
.assets-box {
  min-height: calc(100vh - 50px);
  // background-color: var(--cb-bgc4);
  color: var(--cb-fColor3);
  :deep(.van-tabs--line .van-tabs__wrap) {
    height: 50px;
    padding-top: 10px;
    background-color: white;
  }
  :deep(.van-tab__text) {
    font-size: 17px;
  }
  :deep(.van-tabs) {
    height: 100%;
  }
  :deep(.van-tabs__content) {
    height: calc(100% - 60px);
  }

  .spot-box {
    padding: 20px 16px 40px;
    .skeleton {
      padding: 20px 0px;
    }
    .balance-box {
      border: 1px solid var(--cb-borderColor);
      border-radius: 15px;
      padding: 18px;
      background-color: var(--cb-bgc3);
      margin-bottom: 20px;
      .btns {
        display: grid;
        grid-template-columns: repeat(4, minmax(70px, 1fr));
        justify-content: space-between;
        width: 100%;
        margin-top: 30px;
        padding-bottom: 4px;
        flex-shrink: 0;
        .btn {
          text-align: center;
          font-size: 13px;
          .logo {
            width: 42px;
            margin-bottom: 12px;
          }
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
      // margin-top: 20px;
      .empty {
        margin-top: 100px;
      }
      .cell-item {
        border: 1px solid var(--cb-borderColor);
        border-radius: 15px;
        padding: 10px 18px;
        background-color: var(--cb-bgc3);
        margin: 10px 0;
        .top {
          margin-bottom: 16px;
          font-size: 13px;
          // color: var(--cb-fColor3);
          img {
            width: 34px;
            height: 34px;
            margin-right: 8px;
            border-radius: 50%;
          }
        }
        .center {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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
}
</style>
