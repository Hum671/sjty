<script setup lang="ts">
import { getTradeHistory } from '@/api/market'
import { TradeHistoryItem } from '@/api/market/model/MarketModel'
import { formatToLocaleTime, getIconImage, getCoinNameBySymbol, usFormat } from '@/utils/utils'

const props = defineProps<{
  activeKey?: string
}>()

const route = useRoute()
const isAllRecord = ref(false)
const loading = ref(false)
const finished = ref(false)
const list = ref<TradeHistoryItem[]>([])

watch(
  () => props.activeKey,
  () => {
    if (props.activeKey === 'YongRecord') {
      isAllRecord.value = route.path === '/allrecord'
      list.value = []
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

function handleRequest() {
  loading.value = true
  getTradeHistory()
    .then((res) => {
      list.value = res
    })
    .finally(() => {
      finished.value = true
      loading.value = false
    })
}
</script>

<template>
  <div class="records light">
    <Navbar2 v-if="!isAllRecord" :title="$t('h5.yongxu_record_title')" :is-show-right="false" />

    <Empty v-if="finished && list.length === 0" class="table-empty" />
    <van-list
      v-else
      v-model:loading="loading"
      :finished="finished"
      :finished-text="$t('h5.common.no_more')"
    >
      <div class="list">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="header flex-box-nm">
            <img :src="getIconImage(item.currency)" alt="" />
            <div class="title">{{ getCoinNameBySymbol(item.currency) }}</div>
            <div class="r2 flex-box-nm">
              <div v-if="item.direction === -1" class="label red">
                {{ $t('h5.contract.index.decline') }}
              </div>
              <div v-else class="label green">{{ $t('h5.contract.index.rise') }}</div>

              <div v-if="item.type === 2" class="label black">
                {{ $t('h5.yongxu_quancang') }}
              </div>
              <div v-else class="label black">{{ $t('h5.yongxu_zhucang') }}</div>
              <div class="label black">x{{ item.lever }}</div>
            </div>
          </div>

          <div class="container">
            <div class="flex">
              <div>{{ $t('h5.coin.time') }}</div>
              <div>
                {{ item.createTime || '-' }}
              </div>
            </div>
            <div class="flex">
              <div>{{ $t('h5.heyue_record_weituo_type') }}</div>
              <div>
                {{
                  item.entrustPrice ? `${usFormat(item.entrustPrice)} USDT` : $t('h5.yongxu_shijia')
                }}
              </div>
            </div>
            <div class="flex">
              <div>{{ $t('h5.heyue_record_kaicang_price') }}</div>
              <div>{{ usFormat(item.openPrice) }} USDT</div>
            </div>
            <div class="flex">
              <div>{{ $t('h5.heyue_record_big_chicang') }}</div>
              <div>
                {{ usFormat(item.number) }}
                {{ getCoinNameBySymbol(item.currency) }}
              </div>
            </div>
            <div class="flex">
              <div>{{ $t('h5.heyue_record_pingcang_num') }}</div>
              <div>
                {{ usFormat(item.closeNumber) }}
                {{ getCoinNameBySymbol(item.currency) }}
              </div>
            </div>
            <div class="flex">
              <div>{{ $t('h5.heyue_record_pingcang_junjia') }}</div>
              <div>{{ usFormat(item.closePrice) }} USDT</div>
            </div>
            <div class="flex">
              <div>{{ $t('h5.heyue_record_pingcang_type') }}</div>
              <span v-if="item.isFinish === 0">
                {{ $t('h5.heyue_record_pingcang_bufen') }}
              </span>
              <span v-else>
                {{ $t('h5.heyue_record_pingcang_all') }}
              </span>
            </div>
            <div class="flex">
              <div>{{ $t('h5.heyue_record_pingcang_time') }}</div>
              <div>
                {{ item.closeTime ? formatToLocaleTime(item.closeTime) : '-' }}
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="flex">
              <div>{{ $t('h5.contract.index.profit') }}</div>
              <div :class="item.yield > 0 ? 'green' : 'red'">{{ Number(item.yield * 100) }}%</div>
            </div>
            <div class="flex">
              <div>{{ $t('h5.heyue_record_yishixian_income') }}</div>
              <div :class="Number(item.income) > 0 ? 'green' : 'red'">
                {{ usFormat(item.income) }} USDT
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
      border: 1px solid var(--cb-borderColor);
      padding-bottom: 30px;
      background-color: var(--cb-bgc5);
      padding: 15px;
      border-radius: 5px;
      .header {
        font-size: 16px;
        margin-bottom: 6px;
        font-size: 14px;
        img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 5px;
        }
        .title {
          margin-right: 10px;
        }
        .btn {
          min-width: 70px;
          padding: 0px 10px;
          border: 1px solid var(--cb-borderColor);
          background-color: var(--cb-bgc2);
          color: var(--cb-fColor);
          border-radius: 5px;
          font-size: 12px;
        }
        .r2 {
          font-size: 12px;
          .label {
            margin-right: 10px;
          }
        }
        .NO {
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
