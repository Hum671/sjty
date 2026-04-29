<script setup lang="ts">
import { INTFRecordParams, INTFRecordItem } from '@/api/ntf/model/ntfModel'
import { getRecords } from '@/api/ntf'
import { formatToLocaleTime } from '@/utils/utils'

const loading = ref(false)
const finished = ref(false)
const data = reactive<INTFRecordParams>({
  page: 1,
  limit: 10,
})
const list = ref<INTFRecordItem[]>([])

onMounted(() => {
  handleRequest()
})

watch(
  () => data.page,
  () => {
    handleRequest()
  },
)

function onLoad() {
  if (finished.value) {
    return
  }

  data.page++
}

function handleRequest() {
  loading.value = true
  getRecords(data)
    .then((res) => {
      const newList = list.value.concat(res.data.list)
      list.value = newList

      if (newList.length >= res.data.count) {
        finished.value = true
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="records light">
    <Navbar2 :title="$t('h5.ntf.exchange_record')" :is-show-right="false" />

    <van-list
      v-model:loading="loading"
      :finished="finished"
      :finished-text="$t('h5.common.no_more')"
      @load="onLoad"
    >
      <div class="list">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="flex">
            <div class="NO">
              <span>{{ `${$t('h5.contract.record.no')}` }}</span>
              <span class="num">{{ item.id }}</span>
            </div>
            <div class="time">{{ formatToLocaleTime(item.createTime) }}</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.list.name') }}</div>
            <div>{{ $t(item.langKey) }}</div>
          </div>
          <div class="flex">
            <div>{{ $t('h5.ntf.exchange_getvalue') }}</div>
            <div class="amount">{{ Number(item.number) }} USDT</div>
          </div>
        </div>
      </div>
      <template v-if="list.length === 0" #finished>
        <Empty class="empty" />
      </template>
    </van-list>

    <div class="end"></div>
  </div>
</template>

<style lang="less" scoped>
@psize: 16px;

.records {
  .empty {
    margin-top: 150px;
    line-height: 20px;
  }
  .list {
    padding: @psize;
    display: flex;
    flex-direction: column;
    gap: @psize;

    .item {
      display: flex;
      flex-direction: column;
      gap: 15px;
      background-color: var(--cb-cardBgc);
      padding: 15px 10px;
      border-radius: 5px;
      .coinlogo {
        margin-right: 8px;
        width: 26px;
      }
      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #848598;
        &.title {
          color: #1e1e1e;
        }
        .amount {
          color: #1e1e1e;
        }
        .status {
          color: #2277fc;
          &.finished {
            color: #17ba83;
          }
          &.reject {
            color: #f04a5a;
          }
        }
      }
    }
  }
  .end {
    height: 20px;
  }
}
</style>
