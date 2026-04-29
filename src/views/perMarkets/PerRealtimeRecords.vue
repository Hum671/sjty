<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getRealtimeRecords } from '@/api/order'
import { OrderRecordItem } from '@/api/order/model/orderModel'
import { getToken } from '@/utils/utils'

const props = defineProps<{
  isBuy: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updateBalance'): void
}>()

let timer = 0
const list = ref<OrderRecordItem[]>([])

watch(list, (val, oldVal) => {
  clearTimer()
  if (val.length < oldVal.length) {
    emit('updateBalance')
  }
  if (val.length === 0) {
    return
  }

  timer = setTimeout(() => {
    requestData()
  }, 1000)
})

watch(
  () => props.isBuy,
  (val) => {
    if (val) {
      requestData()
    }
  },
)

onMounted(() => {
  requestData()
})

onUnmounted(() => {
  clearTimer()
})

function clearTimer() {
  clearTimeout(timer)
  timer = 0
}

function requestData() {
  if (!getToken()) {
    return
  }

  getRealtimeRecords().then((res) => {
    if (res.code === SUCCESS_CODE) {
      list.value = res.data
      emit('close')
    }
  })
}
</script>

<template>
  <div class="realtime-records">
    <Empty v-if="list.length === 0" class="table-empty" />

    <template v-else>
      <div v-for="item of list" :key="item.id" class="table-item">
        <div>
          {{
            item.direction === 1 ? $t('h5.contract.index.rise') : $t('h5.contract.index.decline')
          }}
        </div>
        <div>{{ Number(item.number) }}</div>
        <div>{{ `${Number(item.time)}s` }}</div>
        <div>{{ Number(item.buyPrice) }}</div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.realtime-records {
  padding-bottom: 30px;
  .table-item {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1.2fr 1.5fr;
    padding: 15px 0;
    & > div {
      text-align: center;
      opacity: 0.9;
    }
  }

  .table-empty {
    padding-top: 50px;
    img {
      width: 60%;
    }
  }
}
</style>
