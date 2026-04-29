<script setup lang="ts">
import { BaseParams } from '@/api/model/BaseModel'
import { getRecordsSecond } from '@/api/order'
import { OrderRecordItem } from '@/api/order/model/orderModel'
import { formatToLocaleTime, convertSeconds, usFormat } from '@/utils/utils'

const props = defineProps<{
  activeKey?: string
}>()

const route = useRoute()
const isAllRecord = ref(false)
const loading = ref(false)
const finished = ref(false)
const data = reactive<BaseParams>({
  page: 1,
  pageSize: 10,
})
const list = ref<OrderRecordItem[]>([])

watch(
  () => props.activeKey,
  () => {
    if (props.activeKey === 'MiaoRecord') {
      isAllRecord.value = route.path === '/allrecord'
      list.value = []
      data.page = 1
      finished.value = false
      handleRequest()
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  if (!isAllRecord.value && !props.activeKey) {
    handleRequest()
  }
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
  getRecordsSecond(data)
    .then((res) => {
      const newList = list.value.concat(res.data.list)
      list.value = newList

      if (newList.length >= res.data.total) {
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
    <Navbar2 v-if="!isAllRecord" :title="$t('h5.heyue_record_title')" :is-show-right="false" />

    <Empty v-if="finished && list.length === 0" class="table-empty" />

    <van-list
      v-else
      v-model:loading="loading"
      :finished="finished"
      :finished-text="$t('h5.common.no_more')"
      @load="onLoad"
    >
      <div class="list">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="header">
            <div class="flex">
              <div class="left">
                <div class="NO">
                  <span>{{ `${$t('h5.contract.record.no')}` }}</span>
                  <span class="num">{{ item.id }}</span>
                </div>
                <div class="time">{{ formatToLocaleTime(item.createTime) }}</div>
              </div>
              <div class="right">
                <span v-if="item.status === 1">-</span>
                <template v-else>
                  <span v-if="Number(item.gain) === 0">
                    {{ $t('h5.contract.record.fair_price') }}
                  </span>
                  <span v-else-if="Number(item.gain) > 0" class="green">
                    {{ $t('h5.contract.record.gain') }}
                  </span>
                  <span v-else class="red">{{ $t('h5.contract.record.loss') }}</span>
                </template>
              </div>
            </div>
          </div>

          <div class="container">
            <div class="flex">
              <div>{{ $t('h5.contract.index.number') }}</div>
              <div>{{ usFormat(item.number) }}</div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.list.name') }}</div>
              <div>
                <span>{{ item.name }}</span>
                <span v-if="item.subName">/{{ item.subName }}</span>
              </div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.contract.index.duration') }}</div>
              <div>{{ convertSeconds(item.time) }}</div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.contract.index.buy_price') }}</div>
              <div>{{ usFormat(item.buyPrice) }}</div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.contract.record.close_price') }}</div>
              <div>{{ Number(item.closePrice) === 0 ? '-' : usFormat(item.closePrice) }}</div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.contract.index.direction') }}</div>
              <div>
                <span v-if="item.direction === 1" class="green">
                  {{ $t('h5.contract.index.rise') }}
                </span>
                <span v-if="item.direction === 2" class="red">
                  {{ $t('h5.contract.index.decline') }}
                </span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="flex">
              <div>{{ $t('h5.contract.record.gain_loss') }}</div>
              <div>
                <span v-if="item.status === 1">-</span>
                <template v-else>
                  <span v-if="Number(item.gain) === 0">{{ `${usFormat(item.gain)}U` }}</span>
                  <span v-else-if="Number(item.gain) > 0" class="green">
                    {{ `${usFormat(item.gain)}U` }}
                  </span>
                  <span v-else class="red">{{ `${usFormat(item.gain)}U` }}</span>
                </template>
              </div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.contract.record.net_income') }}</div>
              <div>
                <span v-if="Number(item.finalNumber) === 0">-</span>
                <span v-else>{{ `${usFormat(item.finalNumber)}U` }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>

    <div class="end"></div>
  </div>
</template>

<style lang="less" scoped>
@psize: 16px;

.records {
  .table-empty {
    padding-top: 50%;
    img {
      width: 60%;
    }
  }
  .list {
    padding: @psize;
    display: flex;
    flex-direction: column;
    gap: @psize;
    font-size: 14px;

    .item {
      border: 1px solid var(--cb-borderColor2);
      padding-bottom: 30px;
      background-color: var(--cb-bgc5);
      padding: 15px;
      border-radius: 5px;
      .header {
        font-size: 16px;
        .NO {
          color: var(--cb-fColor5);
          .num {
            margin-left: 5px;
            font-size: 12px;
            opacity: 0.5;
          }
        }
        .time {
          font-size: 14px;
          margin-top: 5px;
          opacity: 0.6;
        }
      }

      .flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--cb-fColor5);
      }

      .container,
      .footer {
        display: flex;
        flex-direction: column;
        gap: 15px;
        &.container {
          border-radius: 7px;
          padding: 15px;
          margin: 15px 0;
          background-color: var(--cb-bgc7);
        }
        .flex {
          & > div:nth-child(1) {
            opacity: 0.5;
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
