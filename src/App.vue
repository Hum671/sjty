<script setup lang="ts">
import App2 from './App2.vue'

const isPC = ref(false)
const iframeSrc = location.origin

// 页面加载时检测设备类型
onMounted(() => {
  checkDeviceType()
  // 添加窗口大小变化的监听
  window.addEventListener('resize', checkDeviceType)
})

// 组件销毁时移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkDeviceType)
})

function checkDeviceType() {
  // 如果屏幕宽度大于 768px，认为是 PC 端
  isPC.value = window.innerWidth > 768
}
</script>

<template>
  <div class="pc-box">
    <template v-if="isPC">
      <iframe class="no-change-iframe" ref="iframe" :src="iframeSrc"></iframe>
    </template>

    <template v-else>
      <App2 />
    </template>
  </div>
</template>

<style lang="less" scoped>
.pc-box {
  display: flex;
  /* 现代浏览器 */
  height: 100dvh;

  /* 兼容旧 Safari */
  height: -webkit-fill-available;

  /* JS 注入的兜底 */
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  align-items: center;
  justify-content: space-around;
}
.no-change-iframe {
  width: 438px;
  /* 现代浏览器 */
  height: 100dvh;

  /* 兼容旧 Safari */
  height: -webkit-fill-available;

  /* JS 注入的兜底 */
  height: calc(var(--vh, 1vh) * 100);
  border: 0.1px solid #ccc;
  box-sizing: border-box;
}
</style>
