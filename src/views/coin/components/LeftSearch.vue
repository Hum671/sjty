<script setup lang="ts">
import { useCoinMarketStore } from '@/stores/coinMarket'

import type { CoinCoinItem } from '@/api/market/model/MarketModel'

defineEmits<{
  (e: 'onBack'): void
  (e: 'onItem', data: CoinCoinItem): void
}>()

const coinMarketStore = useCoinMarketStore()

const searchValue = ref('')
const { coinList } = storeToRefs(coinMarketStore)

function handleSearchValue(item) {
  if (!searchValue.value || !item) {
    return true
  }

  if (item.name.includes(searchValue.value.toUpperCase())) {
    return true
  }
  return false
}
</script>

<template>
  <div class="left-search">
    <div class="head">
      <div class="title" @click="$emit('onBack')">
        <span class="u-icon__icon uicon-arrow-leftward u-iconfont"></span>
      </div>
      <van-search
        v-model="searchValue"
        shape="round"
        :placeholder="$t('h5.contract.letf.placeholder')"
      />
      <div class="label flex-box-sb">
        <div class="name">{{ $t('h5.list.name') }}</div>
        <div class="price">{{ $t('h5.list.LAST_PRICE') }}</div>
      </div>
    </div>

    <div class="list">
      <template v-for="item of coinList">
        <div
          v-if="handleSearchValue(item)"
          :key="item.symbol"
          class="list-item flex-box-sb"
          @click="$emit('onItem', item)"
        >
          <div class="name">
            <span class="t-name">{{ item.name }}</span>
            <span class="unit">/USDT</span>
          </div>
          <div class="price" :class="coinMarketStore.handlePriceColor(item.data?.tick)">
            <div class="p1">{{ item.data?.tick.lastPrice ?? '0.00' }}</div>
            <div class="change">
              {{ coinMarketStore.handlePriceChangePercent(item.data?.tick ?? null) }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
@pd: 14px;
.left-search {
  position: relative;
  top: -2;
  background-color: #fff;
  color: #1e1e1e;
  .head {
    background-color: #fff;
    position: sticky;
    top: 0;
    padding-bottom: 10px;
    .title {
      font-size: 21px;
      padding: 15px @pd 5px;
    }
  }

  .label {
    padding: 0 @pd;
    font-size: 11px;
    color: #8a8d98;
    margin-top: 10px;
  }
  .list {
    padding: 15px @pd;
    .list-item {
      margin-bottom: 20px;
      .unit {
        font-size: 11px;
        color: #8a8d98;
      }
      .t-name {
        font-weight: 700;
      }
      .price {
        text-align: right;
        color: #8a8d98;
        font-size: 16px;

        &.red {
          color: #ff4834;
        }
        &.green {
          color: #00c572;
        }

        .change {
          font-size: 12px;
        }
        .p1 {
          font-weight: 700;
        }
      }
    }
  }
}
</style>
