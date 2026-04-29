<script setup lang="ts" name="keepAlive-optional">
const isLoading = ref(false)

function formatStr(str: string) {
  return str[0].concat(str.slice(1).toLocaleLowerCase())
}
</script>

<template>
  <div class="box">
    <div>{{ $t('select-currncy') }}</div>
    <div class="list">
      <div v-for="item of []" class="item" :key="item.coinSymbol">
        <div class="left">
          <div class="top">
            <span>{{ item.coinSymbol }}</span>
            <span class="label-c">/ {{ item.baseSymbol }}</span>
          </div>
          <div class="btm">
            {{ formatStr(item.symbol) }}
          </div>
        </div>
        <van-icon name="success" size="24" :color="item.isSelect ? '#2267f8' : ''" />
      </div>
    </div>
    <van-button class="btn" block color="#0052ff" size="normal" :loading="isLoading">
      {{ $t('add-to-optional') }}
    </van-button>
  </div>
</template>

<style lang="less" scoped>
.box {
  margin-top: 20px;
  padding: 0 16px;
  .list {
    padding: 15px 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 47%;
      height: 50px;
      border-bottom: 1px solid #202020;
      margin-bottom: 23px;
      .top {
        margin-bottom: 5px;
      }
      .btm,
      .label-c {
        color: #7f8aa1;
      }
    }
  }
  .btn {
    margin: 0 auto;
    width: 60%;
  }
}
</style>
