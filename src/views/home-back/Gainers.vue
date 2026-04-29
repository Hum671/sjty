<script setup lang="ts">
import { getGainers } from '@/api/home'

const gainerList = ref<any[]>([])

watchEffect(() => {
  getGainers(1).then((res) => {
    gainerList.value = res.data
  })
})
</script>

<template>
  <div class="list-box">
    <div class="title">{{ $t('gainers') }}</div>
    <div class="item-list-box">
      <div class="item-list">
        <div class="item" v-for="(item, index) of gainerList" :key="index">
          <img :src="item.iconUrl" class="icon" />
          <div class="info">
            <span class="coin-symbol">{{ item.coinSymbol }}</span>
            <span class="amount">{{ item.amount }}</span>
          </div>
          <div class="status-rate">
            <van-icon name="down" class="up" />
            1.66%
          </div>
        </div>
      </div>
    </div>
  </div>
  <van-divider />
</template>

<style lang="less" scoped>
.title {
  font-size: 18px;
  margin-left: 16px;
}
.item-list-box {
  width: 100%;
  overflow-x: scroll;
  .item-list {
    display: flex;
    margin: 16px;
    .darkbg {
      background: #1a1a1a !important;
    }
    .item {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex-shrink: 0;
      padding: 15px;
      box-sizing: border-box;
      width: 145px;
      height: 145px;
      border-radius: 12px;
      background: #f0f0f0;
      margin-right: 13px;
      .icon {
        width: 32px;
        height: 32px;
      }
      .info {
        .coin-symbol {
          margin-right: 8px;
          font-size: 16px;
        }
        .amount {
          font-size: 15px;
          color: #919191;
        }
      }
      .status-rate {
        display: flex;
        align-items: center;
        color: #2ebd85;
        font-size: 18px;
        .up {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
