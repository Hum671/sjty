<script setup lang="ts"></script>

<template>
  <div class="empty">
    <EmptySvg class="pic" />
    <div>{{ $t('h5.common.empty') }}</div>
  </div>
</template>

<style lang="less" scoped>
.empty {
  max-width: 0 auto;
  text-align: center;
  color: var(--cb-fColor);
  font-size: 12px;
  .pic {
    margin-bottom: 14px;
    width: 100px;
  }
}
</style>
