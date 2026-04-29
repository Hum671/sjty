<script setup lang="ts">
import useCustomizedHook from '@/hooks/useCustomizedHook'

const props = defineProps<{
  ikey: string
}>()
const { getSymbols } = useCustomizedHook()
const showSymbols = ref<string[]>([])

watch(
  () => props.ikey,
  (newKey) => {
    if (newKey === 'MyOption') {
      showSymbols.value = getSymbols()
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="container">
    <MarketTable :is-custom-show="true" :show-symbols="showSymbols" />
    <div class="empty">
      <Empty v-if="showSymbols.length === 0" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  position: relative;
  top: -2px;
  height: calc(100dvh - 110px);
  height: calc(-webkit-fill-available - 110px);
  height: calc(var(--vh, 1vh) * 100 - 110px);
  overflow-y: auto;
  padding-bottom: 80px;
  box-sizing: border-box;
  .empty {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
  }
}
</style>
