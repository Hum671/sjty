<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const url = computed(() => route.query.iframeUrl as string)
</script>

<template>
  <div class="ifream-page">
    <div class="back" @click="router.back()">
      <ArrowBack class="icon" />
    </div>
    <iframe class="iframe-box" :src="url" frameborder="0"></iframe>
  </div>
</template>

<style lang="less" scoped>
.iframe-box {
  box-sizing: border-box;
  width: 100vw;
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;
}
.ifream-page {
  position: relative;
  .back {
    z-index: 9999;
    position: absolute;
    width: 20px;
    height: 20px;
    top: 10px;
    left: 10px;
    background: white;
    border-radius: 50%;
    padding: 3px;
    box-sizing: border-box;
    display: flex;
    .icon {
      font-size: 20px;
      color: #007aff;
    }
  }
}
</style>
