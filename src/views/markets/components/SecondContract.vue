<script setup lang="ts">
import { useCurrencyStore } from '@/stores/currency'

const props = defineProps<{
  ikey: string
  searchValue?: string
  isMarketShow?: boolean
}>()

const currencyStore = useCurrencyStore()
const { currencyList } = storeToRefs(currencyStore)

const showSymbols = ref<string[]>([])

onMounted(() => {
  handleSymbols()
})

watch(
  () => props.ikey,
  () => {
    handleSymbols()
  },
)

watch(
  () => [currencyList.value, props.searchValue],
  () => {
    handleSymbols()
  },
)

function handleSearchValue(itemName: string) {
  if (!props.searchValue || !itemName) {
    return true
  }

  if (itemName.includes(props.searchValue.toUpperCase())) {
    return true
  }

  return false
}

function handleSymbols() {
  if (!currencyList.value) {
    return
  }

  const result = []
  currencyList.value.list.forEach((item) => {
    if (item.type === props.ikey && handleSearchValue(item.name)) {
      return result.push(item.symbol)
    }
  })
  showSymbols.value = result
}
</script>

<template>
  <div class="container">
    <MarketTable
      :show-symbols="showSymbols"
      :isCustomShow="true"
      :is-market-show="props.isMarketShow"
    />
  </div>
</template>

<style lang="less" scoped>
.container {
  background-color: var(--cb-bgc3);
  // position: relative;
  // top: -2px;
  // height: calc(100dvh - 110px);
  // height: calc(-webkit-fill-available - 110px);
  // height: calc(var(--vh, 1vh) * 100 - 110px);
  // overflow-y: auto;
  // padding-bottom: env(safe-area-inset-bottom);
  // box-sizing: border-box;
  // background-color: var(--cb-cardBgc2);
}
</style>
