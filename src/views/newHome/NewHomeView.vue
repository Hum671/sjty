<script setup lang="ts" name="keepAliveHome">
import { useParticlesBackground } from '@/hooks/useStartHook'

const canvasRef = ref()
useParticlesBackground(canvasRef, {
  bgColor: '#fff',
  dotSize: 5,
  lineWidth: 1,
  dotColor: '#eae8fa',
  lineColor: 'rgba(234, 232, 250, 0.5)',
  particleCount: 25,
  maxDistance: 180,
})
</script>
<template>
  <div class="home">
    <Navbar />
    <div class="contain">
      <HomeNotice />
      <PromotionCenter />
      <HomeJoin />
    </div>
    <canvas class="canvasRef" ref="canvasRef"></canvas>
  </div>
</template>

<style lang="less" scoped>
.home {
  padding-bottom: 50px;
  font-size: 14px;
  background-color: #fff;
  background: url(@/assets/images/homebg.png) repeat;
  background-size: 100%;
  .contain {
    padding: 0 15px;
  }
  .canvasRef {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
  }
}
:deep(.van-notice-bar__content) {
  font-size: 14px;
}
</style>
