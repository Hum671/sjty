<script setup lang="ts">
import { MarketListItem } from '@/api/market/model/MarketModel'
import useMarketHook from '@/hooks/useMarketHook'
import { getIconImage } from '@/utils/utils'
import MarketsView from '../markets/MarketsView.vue'
import EventBus from '@/utils/eventBus'

const emit = defineEmits<{
  (e: 'onBack'): void
  (e: 'onItem', data: MarketListItem): void
}>()

onMounted(() => {
  EventBus.on('custom-event', (message) => {
    emit('onItem', message.selectItem)
  })
})

onBeforeUnmount(() => {
  EventBus.off('custom-event')
})
// const searchValue = ref('');
// const { currencyMarketDataList, handlePriceChangePercent, handlePriceColor } = useMarketHook();

// function handleSearchValue(item) {
// 	if (!searchValue.value || !item) {
// 		return true;
// 	}

// 	if (item.name.includes(searchValue.value.toUpperCase())) {
// 		return true;
// 	}
// 	return false;
// }
</script>

<template>
  <div class="left-search">
    <div class="head">
      <div class="title" @click="$emit('onBack')">
        <span class="u-icon__icon uicon-arrow-leftward u-iconfont"></span>
      </div>
      <!-- <van-search
				v-model="searchValue"
				shape="round"
				:placeholder="$t('h5.contract.letf.placeholder')" /> -->
      <!-- <div class="label flex-box-sb">
				<div class="name">{{ $t('h5.common.type') }}</div>
				<div class="price">{{ $t('h5.list.LAST_PRICE') }}</div>
			</div> -->
    </div>

    <!-- <div class="list"> -->
    <MarketsView />
    <!-- <template v-for="item of currencyMarketDataList">
				<div
					v-if="handleSearchValue(item)"
					:key="item.symbol"
					class="list-item flex-box-sb"
					@click="$emit('onItem', item)">
					<div class="name flex-box-nm">
						<img :src="getIconImage(item.name)" alt="" />
						<span class="t-name">{{ item.name }}</span>
						<span v-if="item.subName" class="unit">/{{ item.subName }}</span>
					</div>
					<div class="price" :class="handlePriceColor(item.data)">
						<div class="p1">{{ item.data?.Price ?? '0.00' }}</div>
						<div class="change">{{ handlePriceChangePercent(item.data ?? null) }}</div>
					</div>
				</div>
			</template> -->
    <!-- </div> -->
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
    // padding: 15px @pd;
    .list-item {
      margin-bottom: 20px;
      .unit {
        font-size: 11px;
        color: #8a8d98;
      }
      .name {
        img {
          width: 22px;
          margin-right: 5px;
        }
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
