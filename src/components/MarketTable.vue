<script setup lang="ts">
import useMarketHook from '@/hooks/useMarketHook'
import router from '@/router'
import { sessionCache } from '@/utils/cache'
import { getIconImage, usFormat } from '@/utils/utils'
import EventBus from '@/utils/eventBus'
import type { MarketListItem } from '@/api/market/model/MarketModel'
import CONST from '@/const/index'

interface Props {
  top?: string
  isCustomShow?: boolean
  showSymbols?: string[]
  isMarketShow: boolean
}

const props = withDefaults(defineProps<Props>(), {
  top: '0',
  isCustomShow: false,
  isMarketShow: false,
})

const { currencyMarketDataList, handlePriceChangePercent, handlePriceColor } = useMarketHook()
const showAll = ref(false)
const sliceCount = 4
const showSymbolList = ref<MarketListItem[]>([])

watch(
  () => currencyMarketDataList.value,
  () => {
    showSymbolList.value = currencyMarketDataList.value.filter((item) => {
      if (props.showSymbols?.includes(item.symbol)) {
        return item
      }
    })
  },
)

function filterShowSymbols(symbol: string) {
  if (!props.isCustomShow) {
    return true
  }
  return props.showSymbols?.includes(symbol)
}

function handleClickItem(data) {
  sessionCache.setCache(CONST.CONTRACTKEY, data)
  router.push({
    path: '/newContract',
  })
  EventBus.emit('custom-event', { selectItem: data })
}
</script>

<template>
  <div class="market-table">
    <div class="title">
      <img src="@/assets/images/home-market.svg" alt="" />
      {{ $t('h5.tabbar.market2') }}
    </div>
    <div class="table-header" :style="{ top }">
      <div>{{ $t('h5.common.type') }}</div>
      <template v-if="isMarketShow">
        <div>{{ $t('h5.list.LAST_PRICE') }}</div>
        <div>{{ $t('h5.list.24H_CHANGE') }}</div>
      </template>
      <template v-else>
        <div>{{ $t('h5.home.market_24h') }}</div>
        <div>{{ $t('h5.yongxu_zuixinprice') }}</div>
      </template>
    </div>

    <div class="table">
      <div v-if="currencyMarketDataList.length === 0" class="loading">
        <div v-for="item in 6" :key="item" class="loading-item">
          <van-skeleton-paragraph />
          <van-skeleton-paragraph />
        </div>
      </div>

      <div
        v-for="item in showSymbolList.slice(0, sliceCount)"
        :key="item.id"
        class="item body"
        :class="{ marketbody: props.isMarketShow }"
        @click="handleClickItem(item)"
      >
        <div class="flex-box-nm">
          <img :src="getIconImage(item.name)" alt="" />
          <span class="name">{{ item.name }}</span>
          <span v-if="item.subName" class="sub-name">{{ `/${item.subName}` }}</span>
          <span class="t-name">{{ $t(`B_${item.symbol}`) }}</span>
        </div>

        <template v-if="props.isMarketShow">
          <div class="center">
            <span class="price">{{ usFormat(Number(item.data?.Price ?? 0)) }}</span>
            <span class="usd">≈ USD {{ usFormat(Number(item.data?.Price ?? 0)) }}</span>
          </div>
          <div class="right1">
            <div class="tag" :class="handlePriceColor(item.data ?? 0)">
              {{ handlePriceChangePercent(item.data ?? 0) }}
            </div>
          </div>
        </template>

        <template v-else>
          <LineEchat :line-color="handlePriceColor(item.data ?? 0)" class="center1" />
          <div class="right">
            <div class="price">{{ usFormat(Number(item.data?.Price ?? 0)) }}</div>
            <div :class="handlePriceColor(item.data ?? 0)">
              {{ handlePriceChangePercent(item.data ?? 0) }}
            </div>
          </div>
        </template>
      </div>

      <template v-if="showAll || props.isMarketShow">
        <div
          v-for="item in showSymbolList.slice(sliceCount)"
          :key="item.id"
          class="item body"
          :class="{ marketbody: props.isMarketShow }"
          @click="handleClickItem(item)"
        >
          <div class="flex-box-nm">
            <img :src="getIconImage(item.name)" alt="" />
            <span class="name">{{ item.name }}</span>
            <span v-if="item.subName" class="sub-name">{{ `/${item.subName}` }}</span>
            <span class="t-name">{{ $t(`B_${item.symbol}`) }}</span>
          </div>

          <template v-if="props.isMarketShow">
            <div class="center">
              <span class="price">{{ usFormat(Number(item.data?.Price ?? 0)) }}</span>
              <span class="usd">≈ USD {{ usFormat(Number(item.data?.Price ?? 0)) }}</span>
            </div>
            <div class="right1">
              <div class="tag" :class="handlePriceColor(item.data ?? 0)">
                {{ handlePriceChangePercent(item.data ?? 0) }}
              </div>
            </div>
          </template>

          <template v-else>
            <LineEchat :line-color="handlePriceColor(item.data ?? 0)" class="center1" />
            <div class="right">
              <div class="price">{{ usFormat(Number(item.data?.Price ?? 0)) }}</div>
              <div :class="handlePriceColor(item.data ?? 0)">
                {{ handlePriceChangePercent(item.data ?? 0) }}
              </div>
            </div>
          </template>
        </div>
      </template>

      <div v-if="!props.isMarketShow" class="more flex-box-ce" @click="showAll = !showAll">
        {{ $t(showAll ? 'h5.common.shouqi' : 'h5.common.showmore') }}
        <van-icon :name="showAll ? 'arrow-up' : 'arrow-down'" size="18" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.market-table {
  background-color: var(--cb-bgc);
  color: var(--cb-fColor);
  .title {
    padding: 10px 15px;
    font-size: 16px;
    color: var(--cb-fColor6);
    img {
      position: relative;
      top: 4px;
      margin-right: 5px;
    }
  }
  .table-header {
    position: sticky;
    background-color: var(--cb-cardBgc);
    z-index: 1;
    padding: 10px 15px;
    display: grid;
    grid-template-columns: 1.1fr 1fr 1fr;
    color: var(--cb-fColor7);
    font-size: 12px;
    border-top: 1px solid var(--cb-borderColor2);
    border-bottom: 1px solid var(--cb-borderColor2);
    background-color: var(--cb-bgc);
    & > div:nth-child(2) {
      text-align: center;
    }
    & > div:nth-child(3) {
      text-align: right;
    }
  }
  .table {
    padding: 0 15px 15px;
    .loading {
      padding: 15px 0;
      .loading-item {
        margin-bottom: 25px;
      }
    }
    .item {
      display: grid;
      align-items: center;
      grid-template-columns: 1.1fr 1fr 1fr;
      color: #919fac;
      font-size: 15px;
      background-color: var(--cb-bgc);
      img {
        width: 22px;
        margin-right: 5px;
        border-radius: 50%;
      }
      & > div:nth-child(2) {
        text-align: center;
      }
      & > div:nth-child(3) {
        text-align: right;
      }
      &.marketbody {
        padding: 15px 0 !important;
      }
      &.body {
        padding: 5px 0;
        border-bottom: 1px solid var(--cb-borderColor2);
        .flex-box-nm {
          flex-wrap: wrap;
          img {
            position: relative;
            top: 7px;
          }
        }
        .name {
          color: var(--cb-fColor);
          font-weight: 400;
          font-size: 14px;
          margin-bottom: 3px;
        }
        .t-name {
          display: block;
          width: 100%;
          padding-left: 27px;
          font-size: 12px;
        }
        .sub-name {
          font-size: 12px;
        }
        .center {
          display: flex;
          flex-direction: column;
          .price {
            color: var(--cb-fColor);
          }
          .usd {
            font-size: 11px;
          }
        }
        .center1 {
          width: 70%;
          padding: 0 10px;
        }
        .right {
          .tag {
            background-color: #8a8d98;
            color: white;
            height: 24px;
            width: 60px;
            line-height: 24px;
            border-radius: 3px;
            text-align: center;
            font-size: 13px;
            &.green {
              background-color: #00c572;
            }
            &.red {
              background-color: #ff4834;
            }
          }
        }
        .right1 {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .tag {
            // background-color: #8a8d98;
            color: var(--cb-fColor);
            height: 24px;
            width: 60px;
            line-height: 24px;
            border-radius: 3px;
            text-align: center;
            font-size: 14px;
            &.green {
              color: #00c572;
            }
            &.red {
              color: #ff4834;
            }
          }
        }
      }
    }
  }
  .more {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
