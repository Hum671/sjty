<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getCoinRecords } from '@/api/order'
import { CoinRecordsItem } from '@/api/order/model/orderModel'

const props = defineProps<{
  isBuy: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updateBalance'): void
}>()

let timer = 0
let isStart = true
const list = ref<CoinRecordsItem[]>([])

watch(list, (val, oldVal) => {
  if (val.length < oldVal.length) {
    emit('updateBalance')
  }
  if (!val.some((item) => item.status === 1) || !isStart) {
    return
  }

  clearTimer()
  timer = window.setTimeout(() => {
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
  isStart = true
})

onUnmounted(() => {
  clearTimer()
  isStart = false
})

onActivated(() => {
  requestData()
  isStart = true
})

onDeactivated(() => {
  clearTimer()
  isStart = false
})

function clearTimer() {
  clearTimeout(timer)
  timer = 0
}

function requestData() {
  getCoinRecords({
    page: 1,
    pageSize: 10,
    direction: 0,
    type: 0,
  }).then((res) => {
    if (res.code === SUCCESS_CODE) {
      list.value = res.data.list ?? []
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
          <span v-if="item.direction === 1" class="green">{{ $t('h5.coin.buy') }}</span>
          <span v-else class="red">{{ $t('h5.coin.sell') }}</span>
        </div>
        <div>{{ Number(item.price) }}</div>
        <div>{{ `${Number(item.number)}${item.coin}` }}</div>
        <div>
          <span class="ing" v-if="item.status === 1 || item.status === 2">
            {{ $t('h5.common.ing') }}
          </span>
          <span class="green" v-if="item.status === 3">
            {{ $t('h5.common.finished') }}
          </span>
          <span class="red" v-if="item.status === 4">
            {{ $t('h5.common.cancelled') }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.ing {
  color: #7c63e8;
}

.realtime-records {
  padding-bottom: 30px;
  .table-item {
    display: grid;
    grid-template-columns: 1fr 1.2fr 1.8fr 1fr;
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
