<script setup lang="ts">
import { getCoinRecords } from '@/api/order'
import type { CoinRecordsParams, CoinRecordsItem } from '@/api/order/model/orderModel'
import { getIconImage, getToken, formatToLocaleTime, usFormat } from '@/utils/utils'
import { showToast } from 'vant'

const props = defineProps<{
  activeKey?: string
  isUpdata?: boolean
  componentKey?: string
}>()

const loading = ref(false)
const finished = ref(false)
const requstParams = reactive<CoinRecordsParams>({
  page: 0,
  limit: 10,
  status: 2,
})
const list = ref<CoinRecordsItem[]>([])

watch(
  () => props.componentKey,
  (cpn) => {
    if (cpn === 'SPerMarketsView') {
      refresh()
    }
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
  () => props.activeKey,
  () => {
    if (props.activeKey === 'SPerMarketRecord') {
      if (getToken()) {
        refresh()
      }
    }
  },
)

watch(
  () => requstParams.page,
  () => {
    if (getToken() && requstParams.page > 0) {
      handleRequest()
    }
  },
)

function onLoad() {
  if (finished.value) {
    return
  }
  requstParams.page++
}

function handleRequest() {
  loading.value = true
  getCoinRecords(requstParams)
    .then((res) => {
      const newList = list.value.concat(res.data.list)
      list.value = newList
      if (list.value.length >= res.data.total || res.data.list.length === 0) {
        finished.value = true
      }
    })
    .catch((err) => {
      showToast(err)
      finished.value = true
    })
    .finally(() => {
      loading.value = false
    })
}

function refresh() {
  list.value = []
  finished.value = false
  if (requstParams.page === 1) {
    handleRequest()
    return
  } else {
    requstParams.page = 1
  }
}

function updateList() {}

defineExpose<{
  updateList: (num: number) => void
}>({
  updateList,
})
</script>

<template>
  <div class="records light">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      :finished-text="finished && list.length > 0 ? $t('h5.common.no_more') : ''"
      @load="onLoad"
    >
      <div class="list">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="top flex-box-sb">
            <div class="flex-box-nm">
              <img :src="getIconImage(item.coinName.toLocaleLowerCase())" alt="" />
              <div class="title">
                {{ item.coinName }}
              </div>
            </div>
          </div>

          <div class="r2 flex-box-nm">
            <div v-if="item.type === 2" class="label green">
              {{ $t('h5.coin.market_price') }}
            </div>
            <div v-else class="label red">{{ $t('h5.coin.limit_price') }}</div>

            <div v-if="item.direction === 1" class="label green">
              {{ $t('h5.coin.buy') }}
            </div>
            <div v-else class="label red">{{ $t('h5.coin.sell') }}</div>

            <div class="time">{{ formatToLocaleTime(item.createTime) }}</div>
          </div>

          <div class="r3">
            <div>
              <div class="label">
                {{ $t('h5.yongxu_weituoshulaing') }}
                ({{ item.direction === 1 ? 'USDT' : item.coinName }})
              </div>
              <div class="value">
                {{ usFormat(item.number) }}
              </div>
            </div>
            <div class="i2">
              <div class="label">{{ $t('h5.yongxu_chengjiaoshulaing') }}({{ item.coinName }})</div>
              <div class="value">
                {{ item.direction === 2 ? item.number || 0 : usFormat(item.realNumber) }}
              </div>
            </div>
            <div class="i3">
              <div class="label">{{ $t('h5.contract.market.spot.chengjiao_price') }}</div>
              <div class="value">{{ usFormat(item.price) }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-list>

    <Empty v-if="finished && list.length === 0" class="empty" />

    <div class="end"></div>
  </div>
</template>

<style lang="less" scoped>
@psize: 16px;
@green: #00c572;
@red: #f04a5a;
@pd: 15px;

.records {
  position: relative;
  color: var(--cb-fColor3);
  min-height: calc(100dvh - 520px);
  padding-bottom: 50px;
  box-sizing: border-box;

  .red {
    color: @red;
  }
  .green {
    color: @green;
  }
  .black {
    color: #000;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: @psize;
    padding: @psize 0;
    .item {
      padding: 8px 15px 16px;
      border-bottom: 1px solid var(--cb-borderColor2);
      .top {
        margin-bottom: 6px;
        img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 5px;
        }
        .title {
          font-size: 12px;
          color: var(--cb-fColor);
        }
        .btn {
          min-width: 70px;
          padding: 0px 10px;
          border: 1px solid var(--cb-borderColor2);
          background-color: var(--cb-btnBgc2);
          color: var(--cb-fColor);
          border-radius: 5px;
        }
      }
      .r2 {
        color: var(--cb-fColor);
        .label {
          margin-right: 10px;
        }
      }
      .r3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(100px, 1fr));
        justify-content: space-between;
        width: 100%;
        margin-top: 10px;
        padding-bottom: 4px;
        flex-shrink: 0;
        .label {
          margin-bottom: 5px;
        }
        .value {
          color: var(--cb-fColor);
        }
        .i2 {
          .value,
          .label {
            text-align: center;
          }
        }
        .i3 {
          .value,
          .label {
            text-align: right;
          }
        }
      }
    }
  }
  .empty {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translateX(-50%);
    img {
      margin-bottom: 0 !important;
    }
  }
  .block {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .end {
    height: 20px;
  }
}
</style>
