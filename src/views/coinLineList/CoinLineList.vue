<script setup lang="ts">
defineProps<{
  list?: any[]
}>()
</script>

<template>
  <div class="list">
    <div v-for="(item, index) of list" :key="index" class="item">
      <div class="left">
        <img class="icon" :src="item.iconUrl" />
        <div class="label">
          <div class="symbol">{{ item.symbol }}</div>
          <div class="c-box">
            <span class="coin-symbol">{{ item.coinSymbol }}</span>
            <span class="level">{{ item.level }}</span>
          </div>
        </div>
      </div>
      <div class="center">
        <LineEchat />
      </div>
      <div class="right">
        <div>{{ item.amount }}</div>
        <div class="status-rate">
          <van-icon name="down" class="up" />
          <div>{{ item.statusRate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.list {
  height: calc(100dvh - 226px);
  height: calc(-webkit-fill-available - 226px);
  height: calc(var(--vh, 1vh) * 100 - 226px);
  overflow: scroll;
  margin: 0 16px;
  .item {
    display: flex;
    align-items: center;
    height: 70px;
    text-align: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      .icon {
        width: 32px;
        height: 32px;
        margin-right: 16px;
      }
      .label {
        .symbol {
          margin-bottom: 4px;
          font-size: 14px;
        }
        .c-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .coin-symbol {
            font-size: 14px;
            color: #999999;
          }
          .level {
            color: rgb(19, 59, 244);
            background-color: rgba(19, 59, 244, 0.2);
            padding: 1px 4px;
          }
        }
      }
    }
    .center {
      width: 60px;
      text-align: center;
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 36px;
      .status-rate {
        display: flex;
        align-items: center;
        color: #2ebd85;
        .up {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
@/hooks/useSortHook
