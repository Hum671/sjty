<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { coinCancel, getCoinRecords } from '@/api/order'
import { CoinRecordsItem, CoinRecordsParams } from '@/api/order/model/orderModel'

import { confirm } from '@/utils/dialog'
import { formatToLocaleTime } from '@/utils/utils'

const loading = ref(false)
const finished = ref(false)
const data = reactive<CoinRecordsParams>({
  page: 1,
  pageSize: 10,
  type: 0,
  direction: 0,
})
const list = ref<CoinRecordsItem[]>([])
const btnLoading = reactive([])

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
  getCoinRecords(data)
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

function handleCancel(id: number, index: number) {
  confirm('h5.coin.cofirm_cancel').then(() => {
    btnLoading[index] = true
    coinCancel(id)
      .then((res) => {
        if (res.code === SUCCESS_CODE) {
          list.value[index].status = 4
        }
      })
      .catch(() => {
        btnLoading[index] = false
      })
  })
}
</script>

<template>
  <div class="records light">
    <Navbar2 :title="$t('h5.contract.record.title')" :is-show-right="false" />

    <Empty v-if="finished && list.length === 0" class="table-empty" />

    <van-list
      v-else
      v-model:loading="loading"
      :finished="finished"
      :finished-text="$t('h5.common.no_more')"
      @load="onLoad"
    >
      <div class="list">
        <div v-for="(item, index) in list" :key="item.id" class="item">
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
                <span v-if="item.status === 1 || item.status === 2" class="ing">
                  {{ $t('h5.common.ing') }}
                </span>
                <span v-else-if="item.status === 3" class="green">
                  {{ $t('h5.common.finished') }}
                </span>
                <span v-else class="red">{{ $t('h5.common.cancelled') }}</span>
              </div>
            </div>
          </div>

          <div class="container">
            <div class="flex">
              <div>{{ $t('h5.coin.deal_name') }}</div>
              <div>{{ `${item.coin}/USDT` }}</div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.contract.index.direction') }}</div>
              <div>
                <span v-if="item.direction === 1" class="green">
                  {{ $t('h5.coin.buy') }}
                </span>
                <span v-if="item.direction === 2" class="red">
                  {{ $t('h5.coin.sell') }}
                </span>
              </div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.contract.index.price') }}</div>
              <div>
                <span>{{ Number(item.price) }}</span>
              </div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.contract.index.number') }}</div>
              <div>{{ `${Number(item.number)}${item.coin}` }}</div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.withdrwa.commission_fee') }}</div>
              <div>{{ `${Number(item.feeNumber)}${item.coin}` }}</div>
            </div>

            <van-button
              v-if="item.status === 1"
              :loading="btnLoading?.[index] ?? false"
              type="primary"
              size="normal"
              class="submit-btn"
              color="#28ba98"
              @click="handleCancel(item.id, index)"
            >
              {{ $t('h5.coin.cancel_buy') }}
            </van-button>
          </div>
        </div>
      </div>
    </van-list>

    <div class="end"></div>
  </div>
</template>

<style lang="less" scoped>
@psize: 16px;

.ing {
  color: #7c63e8;
}

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
      border-bottom: 1px solid #f2f2f2;
      padding-bottom: 20px;
      margin-top: 5px;
      .header {
        font-size: 16px;
        .NO {
          color: #333;
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
        color: #333;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        &.container {
          border-radius: 7px;
          padding: 15px;
          margin: 15px 0 0;
          background-color: #f2f2f2;
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
