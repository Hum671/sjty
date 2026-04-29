<script setup lang="ts">
defineProps<{
  value: number
}>()
</script>

<template>
  <div class="desccard">
    <div class="top flex-box-nm">
      <img src="~@/assets/images/descIcon.png" alt="" />
      <h3 class="label">{{ $t(`h5.purchaseGold.AiDesc.label${value}`) }}</h3>
    </div>
    <p class="content">
      {{ $t(`h5.purchaseGold.AiDesc.content${value}`) }}
    </p>
  </div>
</template>

<style lang="less" scoped>
.desccard {
  padding: 20px 18px;
  box-shadow: 0 0 7px 0 rgba(87, 86, 86, 0.5);
  border-radius: 12px;
  margin-bottom: 20px;
  img {
    width: 30px;
  }
  .label {
    margin-left: 10px;
    font-size: 18px;
  }
  h3 {
    font-weight: normal;
  }
  .content {
    padding-top: 20px;
    line-height: 22px;
  }
}
</style>
