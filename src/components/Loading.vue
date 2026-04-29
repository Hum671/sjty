<script setup lang="ts">
import { useCpnCtrlStore } from '@/stores/cpnCtrl'

defineProps<{
  loadingText?: any
}>()

const { isShowTabbar } = storeToRefs(useCpnCtrlStore())
</script>

<template>
  <van-overlay class="ovler" :class="{ ovlerh: isShowTabbar }" :show="true" z-index="100">
    <div class="wrapper">
      <LoadingLogo />
      <div class="text">{{ loadingText }}</div>
    </div>
  </van-overlay>
</template>

<style lang="less" scoped>
@topNavBarH: 58px;
@BtmTabBarH: 60px;
.ovler {
  --van-overlay-background: rgba(118, 145, 226, 0.6);
  position: fixed;
  z-index: 999;
  top: @topNavBarH;
  height: calc(100% - @topNavBarH);
  width: 100vw;
  .wrapper {
    position: relative;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 100px;
    .text {
      position: absolute;
      top: 80px;
      left: -50%;
      text-align: center;
      width: 100%;
      color: #fff;
    }
  }
}
.ovlerh {
  top: 0;
  bottom: @BtmTabBarH;
}
</style>
