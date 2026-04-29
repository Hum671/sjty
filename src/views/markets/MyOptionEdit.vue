<script setup lang="ts">
const checkedCoinSymbols = ref([])
const isSelectAll = ref(false)

function onClickLeft() {
  history.back()
}
</script>

<template>
  <div class="box">
    <van-nav-bar :left-text="$t('selfEdit')" left-arrow @click-left="onClickLeft" />
    <div>
      <van-checkbox-group v-model="checkedCoinSymbols" shape="square" class="list">
        <van-checkbox v-for="item of []" :key="item.coinSymbol" :name="item.coinSymbol">
          <div class="item">
            <div class="left">
              <span class="label-a">{{ item.coinSymbol }}</span>
              <span class="label-c">/ {{ item.baseSymbol }}</span>
            </div>
            <div class="center">
              {{ item.amount }}
            </div>
            <div class="right">{{ item.statusRate }}</div>
          </div>
        </van-checkbox>
      </van-checkbox-group>
      <van-checkbox v-model="isSelectAll" shape="square" class="btm" label-disabled>
        <div class="btm-box">
          <div class="all"></div>
          <van-button type="primary" :disabled="checkedCoinSymbols.length === 0">
            {{ $t('delete') }}({{ checkedCoinSymbols.length }})
          </van-button>
        </div>
      </van-checkbox>
    </div>
  </div>
</template>

<style lang="less" scoped>
.box {
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100);
  :deep(.van-checkbox__label) {
    width: 100%;
  }
  .list {
    margin: 0 16px;
    height: calc(100dvh - 110px);
    height: calc(-webkit-fill-available - 110px);
    height: calc(var(--vh, 1vh) * 100 - 110px);
    overflow: scroll;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 13px 0;
      .top {
        margin-bottom: 5px;
      }
      .center {
        width: 70px;
        font-size: 15px;
      }
      .right {
        padding: 4px 10px;
        background-color: #7d919d;
        color: #fff;
      }
      .label-a {
        font-size: 16px;
      }
      .label-c {
        margin-left: 3px;
        color: #999999;
        font-size: 13px;
      }
    }
  }
  .btm {
    margin: 0 16px;
    .btm-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      :deep(.van-button) {
        height: 34px;
      }
      .all,
      .del {
        font-size: 17px;
      }
    }
  }
  .no-data {
    position: relative;
    top: 20%;
    text-align: center;
  }
  :deep(.van-nav-bar__content) {
    height: 55px;
    .van-nav-bar__text {
      font-size: 17px;
    }
  }
}
</style>
