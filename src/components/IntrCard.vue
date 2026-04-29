<script setup lang="ts">
defineProps<{
  title?: any
  content?: any
  isHiddenTitleLine?: any
  list?: Array<{
    key: any
    value: any
  }>
}>()
</script>

<template>
  <div class="card-box">
    <Title v-if="title" :title="title" :isShowLine="!isHiddenTitleLine" />
    <slot>
      <div class="content">
        {{ content }}
      </div>
    </slot>
    <div v-if="list?.length" class="cell-box">
      <div v-for="item of list" class="item flex-box-sb" :key="item.key">
        <div class="label">{{ item.key }}</div>
        <div class="value">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card-box {
  background-color: #e3e3e3;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
  .content {
    font-size: 12px;
    line-height: 18px;
  }
  .cell-box {
    .item {
      margin-top: 16px;
      .label {
        color: #999;
        font-size: 12px;
      }
      .value {
        font-size: 12px;
      }
    }
  }
}
</style>
