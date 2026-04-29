<script setup lang="ts">
import useMarketHook from '@/hooks/useMarketHook'
import { getIconImage, usFormat } from '@/utils/utils'

const { currencyMarketDataList, handlePriceChangePercent, handlePriceColor } = useMarketHook()
</script>

<template>
  <div class="banner">
    <div class="scroll">
      <div v-for="item in currencyMarketDataList" :key="item.id" class="item flex-box-nm">
        <img :src="getIconImage(item.name)" alt="" />
        <span class="name">{{ item.name }}</span>
        <span class="price">{{ usFormat(Number(item.data?.Price ?? 0)) }}</span>
        <span :class="handlePriceColor(item.data ?? 0)">
          { {{ handlePriceChangePercent(item.data ?? 0) }} }
        </span>
      </div>
      <div v-for="item in currencyMarketDataList" :key="item.id" class="item flex-box-nm">
        <img :src="getIconImage(item.name)" alt="" />
        <span class="name">{{ item.name }}</span>
        <span class="price">{{ usFormat(Number(item.data?.Price ?? 0)) }}eee</span>
        <span :class="handlePriceColor(item.data ?? 0)">
          { {{ handlePriceChangePercent(item.data ?? 0) }} }
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.banner {
  border-top: 1px solid var(--cb-borderColor2);
  border-bottom: 1px solid var(--cb-borderColor2);
  background: var(--cb-bgc4);
  color: var(--cb-fColor);
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  overflow: hidden;
  .scroll {
    display: inline-flex;
    animation: scroll 100s linear infinite;
  }
  .item {
    width: 240px;
    white-space: nowrap; // 不换行
    img {
      width: 18px;
      border-radius: 50%;
    }
    .name {
      margin: 0 5px 0 4px;
    }
    .price {
      margin-right: 5px;
    }
  }
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
}
</style>
