<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useCoinMarketStore } from '@/stores/coinMarket'

import { deepCopy, formatNumber } from '@/utils/utils'
import { CoinCoinItem } from '@/api/market/model/MarketModel'
import USDTIcon from '@/assets/icons/USDT.png'

interface AssetsItem extends CoinCoinItem {
  number?: number
  occNumber?: number
  rateNumber?: number
}

// const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const coinMarketStore = useCoinMarketStore()

const { coinList } = storeToRefs(coinMarketStore)
const { userBalance, userCoinBalance } = storeToRefs(userStore)
const showBalance = ref(false)
const btns = [
  {
    code: 'h5.recharge.title',
    path: '/recharge/index',
  },
  {
    code: 'h5.withdraw.title',
    path: '/withdraw-cell',
  },
  {
    code: 'h5.gridmenu.Transfer',
    path: '/swap',
  },
  {
    code: 'h5.user_info.assets.transfer',
    path: '/transfer',
  },
]
const assetsList = ref<AssetsItem[]>([])

const totalAssets = computed(() => {
  const total = assetsList.value.reduce((total, next) => {
    if (next.rateNumber) {
      return Number(formatNumber(total + next.rateNumber, 8))
    } else {
      return total
    }
  }, 0)
  return total
})

watch(coinList, (val) => {
  if (val.length > 0) {
    handleCoinCoinList()
  }
})

watch(coinList, () => {
  if (!coinList.value || !userCoinBalance.value || !userBalance.value) {
    return
  }

  const newAssetsList = deepCopy(unref(assetsList.value))
  newAssetsList.forEach((val) => {
    const findBalance = userCoinBalance.value.find((item) => item.coin === val.name)
    const occName = val.name.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())

    let number = Number(userBalance.value?.[val.name.toLowerCase()] ?? 0) // 合约余额
    let occNumber = Number(userBalance.value?.[`occ${occName}`] ?? 0) // 冻结合约余额

    if (findBalance) {
      number = Number(formatNumber(Number(findBalance?.number ?? '0') + number, 8))
      occNumber = Number(formatNumber(Number(findBalance?.occNumber ?? '0') + occNumber, 8))
    }

    val.number = number
    val.occNumber = occNumber

    if (val.name === 'USDT') {
      val.rateNumber = number
      return
    }

    const find = coinList.value.find((item) => item.name === val.name)
    val.rateNumber = Number(formatNumber(val.number * (find?.data?.tick?.lastPrice ?? 0), 8))
  })
  assetsList.value = newAssetsList
})

onMounted(() => {
  userStore.requestUserCoinBalance()
  userStore.requestUserBalance()

  if (coinList.value && coinList.value.length > 0) {
    handleCoinCoinList()
  }
})

onActivated(() => {
  userStore.requestUserCoinBalance()
  userStore.requestUserBalance()
})

function handleCoinCoinList() {
  if (assetsList.value.length > 0) {
    return
  }

  assetsList.value = [
    {
      name: 'USDT',
      id: -1,
      symbol: '',
      sort: -1,
      fee: '0',
      icon: -1,
      attachments: { host: '', filepath: USDTIcon },
    },
    ...unref(coinList.value),
  ]
}

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
  <div>
    <div class="spot-box">
      <div class="balance-box">
        <TotalBalances
          :amount="totalAssets"
          :is-show-detail-btn="false"
          @is-show-change="handleIsShowChange"
        />

        <div class="btns flex-box-sb">
          <van-button
            v-for="(item, index) of btns"
            :key="item.code"
            class="btn"
            :class="{ 'comfirm-btn': index === 0 }"
            :color="index === 0 ? '#10ab9d' : '#f1f5fb'"
            :style="index === 0 ? 'color: white' : 'color: #1e1e1e'"
            @click="handleBtnClick(item)"
          >
            {{ $t(item.code) }}
          </van-button>
        </div>
      </div>

      <div class="cell-list">
        <div class="cell-item" v-for="item in assetsList" :key="item.id">
          <div class="top flex-box-nm">
            <img
              v-if="item.attachments.filepath"
              :src="`${item.attachments.host ? `${item.attachments.host}/` : ''}${
                item.attachments.filepath
              }`"
            />
            <div class="label">{{ item.name }}</div>
          </div>
          <div class="center flex-box-sb">
            <div class="c-item">
              <div class="label">{{ $t('h5.contract.index.balance') }}</div>
              <div class="value v-1">
                <template v-if="showBalance">{{ item.number ?? 0 }}</template>
                <template v-else>***</template>
              </div>
            </div>
            <div class="c-item">
              <div class="label c-label">{{ $t('h5.user_info.assets.occupy') }}</div>
              <div class="value v-2">
                <template v-if="showBalance">{{ item.occNumber ?? 0 }}</template>
                <template v-else>***</template>
              </div>
            </div>
            <div class="c-item">
              <div class="label r-label">{{ $t('h5.user_info.assets.converted') }}(USDT)</div>
              <div class="value v-3">
                <template v-if="showBalance">{{ item.rateNumber ?? 0 }}</template>
                <template v-else>***</template>
              </div>
            </div>
          </div>
          <van-divider />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.spot-box {
  --van-divider-border-color: #e9e9e9;
  margin-top: 20px;
  padding: 0 16px;
  padding-bottom: 80px;
  .balance-box {
    .btns {
      margin: 30px 0 0;
      padding-bottom: 15px;
      border-bottom: 1px solid #e9e9e9;
      .btn {
        width: 23%;
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
  .cell-list {
    height: calc(100dvh - 272px);
    height: calc(-webkit-fill-available - 272px);
    height: calc(var(--vh, 1vh) * 100 - 272px);
    overflow: scroll;
    .cell-item {
      margin: 20px 0;
      .top {
        margin-bottom: 16px;
        img {
          width: 30px;
          height: 30px;
          margin-right: 12px;
        }
      }
      .center {
        .c-item {
          flex: 1;
          .label {
            margin-bottom: 16px;
            font-size: 12px;
          }
          .r-label {
            text-align: right;
          }
          .c-label {
            text-align: center;
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
  .btn {
    border: none;
  }
}
</style>
