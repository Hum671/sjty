<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: any
    isShowLine?: boolean
  }>(),
  {
    isShowLine: true,
  },
)
</script>

<template>
  <div class="title-box" :class="!isShowLine && 'no-line'">
    <strong class="text">
      {{ title }}
    </strong>
  </div>
</template>

<style lang="less" scoped>
.title-box {
  margin-bottom: 16px;
  .text {
    font-size: 0.42667rem;
    font-weight: 400;
    padding-left: 0.29333rem;
    position: relative;
    &::before {
      content: '';
      width: 0.08rem;
      height: 100%;
      background-color: #0052ff;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 50px;
    }
  }
}
.no-line {
  .text {
    padding-left: 0;
    &::before {
      display: none;
    }
  }
}
</style>
