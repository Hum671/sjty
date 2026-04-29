<script setup lang="ts" name="keepAliveAssetsView">
import { useUserStore } from '@/stores/user'
import { useMarketStore } from '@/stores/market'
import { formatNumber } from '@/utils/utils'

import withdrawIcon from '@/assets/images/withdraw.png'
import exchangeIcon from '@/assets/images/exchange.png'
import depositIcon from '@/assets/images/deposit.png'
import useCurrencyHook from '@/hooks/useCurrencyHook'

const router = useRouter()
const userStore = useUserStore()
const { userBalance } = storeToRefs(userStore)
const { hasDataChange, currencyMarketList } = storeToRefs(useMarketStore())
const { iconMapType } = useCurrencyHook()

const showBalance = ref(false)
const totalAssets = ref(0)
const assetList = ref([])
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
]

watch(userBalance, (val) => {
  if (!val) {
    return
  }
  assetList.value = val
})

watch(hasDataChange, () => {
  if (!currencyMarketList.value) {
    return
  }

  const ETHFindPrice = currencyMarketList.value.find((item) => item.StockCode === 'ethusdt')
  const BTCFindPrice = currencyMarketList.value.find((item) => item.StockCode === 'btcusdt')
  const USDCFindPrice = currencyMarketList.value.find((item) => item.StockCode === 'usdcusdt')
  const DOGEFindPrice = currencyMarketList.value.find((item) => item.StockCode === 'dogeusdt')
  const XAUTFindPrice = currencyMarketList.value.find((item) => item.StockCode === 'xautusdt')

  const priceMapType = {
    eth: ETHFindPrice?.Price,
    btc: BTCFindPrice?.Price,
    usdc: USDCFindPrice?.Price,
    doge: DOGEFindPrice?.Price,
    xaut: XAUTFindPrice?.Price,
  }

  // 1、赋值
  assetList.value.forEach((item) => {
    if (item.type === 'usdt') {
      item.rateNumber = Number(item.number)
      return
    }
    item.rateNumber = Number(formatNumber(item.number * priceMapType[item.type], 8))
  })

  // 2、排序
  assetList.value = assetList.value.sort((a, b) => b.rateNumber - a.rateNumber)

  const total = assetList.value.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.rateNumber)
  }, 0)

  totalAssets.value = Number(formatNumber(total, 8))
})

onMounted(() => {
  userStore.requestUserBalance()
})

onActivated(() => {
  userStore.requestUserBalance()
})

function handleBtnClick(item: { code: string; path: string }) {
  router.push({
    path: item.path,
  })
}

function handleIsShowChange(isShow: boolean) {
  showBalance.value = isShow
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
        <div v-for="item of btns" :key="item.code" class="btn" @click="handleBtnClick(item)">
          <img :src="item.icon" class="logo" alt="icon" />
          <div>{{ $t(item.code) }}</div>
        </div>
      </div>
    </div>

    <div class="detail-titel">{{ $t('h5.ntf.asset_detail') }}</div>

    <div class="cell-list">
      <van-skeleton v-if="assetList.length === 0" class="skeleton" title :row="5" />
      <div class="cell-item" v-for="item in assetList" :key="item.key">
        <div class="top flex-box-sb">
          <img :src="iconMapType[item.type]" />
          <div class="label">{{ item.type.toUpperCase() }}</div>
        </div>
        <div class="center flex-box-sb">
          <div class="c-item">
            <div class="label">{{ $t('h5.contract.index.balance') }}</div>
            <div class="value v-1">
              <template v-if="showBalance">{{ Number(item.number ?? 0) }}</template>
              <template v-else>***</template>
            </div>
          </div>
          <div class="c-item">
            <div class="label v-2">{{ $t('h5.user_info.assets.occupy') }}</div>
            <div class="value v-2">
              <template v-if="showBalance">{{ Number(item.occ ?? 0) }}</template>
              <template v-else>***</template>
            </div>
          </div>
          <div class="c-item">
            <div class="label v-3">{{ $t('h5.user_info.assets.converted') }}(USDT)</div>
            <div class="value v-3">
              <template v-if="showBalance">{{ item.rateNumber ?? 0 }}</template>
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
  padding: 20px 16px 40px;
  .skeleton {
    padding: 20px 0px;
  }
  .balance-box {
    border: 1px solid var(--cb-borderColor);
    border-radius: 15px;
    padding: 18px;
    background-color: var(--cb-cardBgc);
    margin-bottom: 40px;
    .btns {
      width: 100%;
      margin-top: 30px;
      padding-bottom: 4px;
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
    margin-top: 20px;
    .empty {
      margin-top: 100px;
    }
    .cell-item {
      border: 1px solid var(--cb-borderColor);
      border-radius: 15px;
      padding: 10px 18px;
      background-color: var(--cb-cardBgc);
      margin: 7px 0;
      .top {
        margin-bottom: 16px;
        font-size: 16px;
        // color: var(--cb-fColor3);
        img {
          width: 34px;
          height: 34px;
          margin-right: 8px;
        }
      }
      .center {
        .c-item {
          flex: 1;
          .label {
            margin-bottom: 16px;
            font-size: 12px;
            // color: var(--cb-fColor3);
          }
          .value {
            color: var(--cb-fColor2);
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
