<script setup lang="ts">
import { BaseParams } from '@/api/model/BaseModel'
import { getRecordsSecond } from '@/api/order'
import { OrderRecordItem } from '@/api/order/model/orderModel'
import { formatToLocaleTime, convertSeconds, getToken, usFormat } from '@/utils/utils'

const props = defineProps<{
  isUpdata: boolean
  countTime: number
  componentsKey?: string
}>()

const COMPONENTKEY = 'KMarket'
const loading = ref(false)
const finished = ref(false)
const route = useRoute()
const router = useRouter()
const data = reactive<BaseParams>({
  page: 0,
  pageSize: 15,
})
const list = ref<OrderRecordItem[]>([])
let intervalTimer: any

watch(
  () => [props.componentsKey, route.path],
  () => {
    if (props.componentsKey === COMPONENTKEY && route.path === '/newContract') {
      getData()
    } else {
      // 暫停接口調用
      if (intervalTimer) {
        clearInterval(intervalTimer)
        intervalTimer = null
      }
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.isUpdata,
  () => {
    if (getToken()) {
      refresh()
    }
  },
)

watch(
  () => data.page,
  () => {
    if (getToken()) {
      handleRequest()
    }
  },
)

function getData() {
  if (!intervalTimer) {
    intervalTimer = setInterval(() => {
      handleRequest()
    }, 5000)
  }
}

function onLoad() {
  if (finished.value && !getToken()) {
    return
  }

  data.page++
}

function handleRequest() {
  loading.value = true
  getRecordsSecond(data)
    .then((res) => {
      list.value = res.data.list
      finished.value = true
    })
    .finally(() => {
      loading.value = false
    })
}

function refresh() {
  data.page = 1
  finished.value = false
  handleRequest()
}

function handleRecord() {
  router.push('/allrecord?type=MiaoRecord')
}
</script>

<template>
  <div class="records light">
    <div class="top-title flex-box-sb">
      <div class="flex-box-nm">
        {{ $t('h5.market.order_history') }}
        <img src="@/assets/images/redo.svg" alt="" @click="refresh" />
      </div>
      <div class="record" @click="handleRecord">
        <span class="u-icon__icon uicon-order u-iconfont"></span>
      </div>
    </div>

    <Empty v-if="finished && list.length === 0" class="table-empty" />

    <van-list v-else v-model:loading="loading" :finished="finished" @load="onLoad">
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
                  <span v-if="Number(item.gain) === 0">{{ `${usFormat(item.gain)} U` }}</span>
                  <span v-else-if="Number(item.gain) > 0" class="green">
                    {{ `${usFormat(item.gain)} U` }}
                  </span>
                  <span v-else class="red">{{ `${usFormat(item.gain)} U` }}</span>
                </template>
              </div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.contract.record.net_income') }}</div>
              <div>
                <span v-if="item.status === 1">-</span>
                <span v-if="item.status === 2">{{ `${usFormat(item.finalNumber)} U` }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #finished>
        <div
          v-if="route.path === '/newContract' && list.length > 0"
          class="showmore"
          @click="handleRecord"
        >
          {{ $t('h5.common.showMore') }}
        </div>
        <div v-else>
          {{ finished && list.length > 0 ? $t('h5.common.no_more') : '' }}
        </div>
      </template>
    </van-list>

    <div class="end"></div>
  </div>
</template>

<style lang="less" scoped>
@psize: 12px;

.records {
  .top-title {
    padding: 20px 12px 8px;
    font-size: 15px;
    background-color: var(--cb-bgc);
    border-top: 1px solid var(--cb-borderColor2);
    img {
      margin-left: 10px;
    }
    .record {
      font-size: 16px;
    }
  }
  .table-empty {
    padding-top: 20px;
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
  .showmore {
    text-align: center;
    text-decoration: underline;
  }
  .end {
    height: 20px;
  }
}
</style>
