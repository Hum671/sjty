<script setup lang="ts"></script>

<template>
  <div>
    <div class="currency-box">
      <div class="title">{{ $t('currency-list') }}</div>
    </div>
    <van-divider />
  </div>
</template>

<style lang="less" scoped>
.currency-box {
  margin: 20px;
  .title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .home-list {
    height: 210px;
  }
}
</style>
