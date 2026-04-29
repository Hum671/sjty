<script setup lang="ts">
import BTCIcon from '@/assets/icons/BTC.png'
import ETHIcon from '@/assets/icons/ETH.png'
import USDTIcon from '@/assets/icons/USDT.png'
import Bankcard from '@/assets/icons/bankcard.png'
import router from '@/router'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const { isWithdrawBankShow } = storeToRefs(configStore)

const assetList = ref([
  {
    icon: USDTIcon,
    key: 'USDT-TRC',
  },
  {
    icon: USDTIcon,
    key: 'USDT-ERC',
  },
  {
    icon: BTCIcon,
    key: 'BTC',
  },
  {
    icon: ETHIcon,
    key: 'ETH-ERC',
  },
  {
    icon: Bankcard,
    key: 'BANK',
    isHidden: true,
  },
])

watchEffect(() => {
  assetList.value[4].isHidden = !isWithdrawBankShow.value
})

function handleSubmit(type: string) {
  if (type === 'BANK') {
    router.push({
      path: '/withdraw/bank',
      query: {
        type: 'USDT-ERC',
      },
    })
    return
  }
  router.push({
    path: '/withdraw/index',
    query: {
      type,
    },
  })
}
</script>

<template>
  <div class="light">
    <Navbar2 :title="$t('h5.withdraw.title')" :is-show-right="false" />
    <div class="content">
      <div class="title">{{ $t('h5.withdraw.currency_type') }}</div>
      <div class="s-box">
        <template v-for="item in assetList">
          <div
            v-if="!item.isHidden"
            :key="item.key"
            class="cell-item flex-box-sb"
            @click="handleSubmit(item.key)"
          >
            <div class="left flex-box-nm">
              <img :src="item.icon" />
              <div class="label">{{ item.key }}</div>
            </div>
            <van-icon name="arrow" size="18" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.content {
  padding: 20px 16px 0 16px;
  .s-box {
    height: calc(100dvh - 100px);
    height: calc(-webkit-fill-available - 100px);
    height: calc(var(--vh, 1vh) * 100 - 100px);
    overflow: scroll;
  }
  .title {
    color: #999999;
  }
  .cell-item {
    margin-top: 20px;
    background-color: #1a1a1a;
    padding: 12px 16px;
    .left {
      img {
        width: 30px;
        height: 30px;
        margin-right: 14px;
      }
    }
  }
}
.label {
  font-size: 16px;
}
.light {
  .nav-bar {
    background-color: #ffffff !important;
  }
  .content {
    .item {
      background-color: #e3e3e3 !important;
    }
  }
  .cell-item {
    margin-top: 20px;
    background-color: #f1f1f1;
  }
}
</style>
