<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getPledgeRecords, abortEarlyApi } from '@/api/pledge'
import { IPledgeRecordItem, IGetPledgeRecordParam } from '@/api/pledge/model/pledgeModel'
import { formatToLocaleTime, usFormat } from '@/utils/utils'
import { showConfirmDialog, showToast } from 'vant'

const props = defineProps<{
  activeKey?: string
}>()

const route = useRoute()
const { t } = useI18n()
const isAllRecord = ref(false)
const loading = ref(false)
const finished = ref(false)
const router = useRouter()
const data = reactive<IGetPledgeRecordParam>({
  page: 1,
  pageSize: 10,
  isSettlement: 0,
})
const list = ref<IPledgeRecordItem[]>([])

watch(
  () => props.activeKey,
  () => {
    if (props.activeKey === 'PledgeRecord') {
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

watch(
  () => data.isSettlement,
  () => {
    finished.value = false
    data.page = 1
    list.value = []
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
  getPledgeRecords(data)
    .then((res) => {
      if (res.code === SUCCESS_CODE && res.data?.list) {
        const newList = list.value.concat(res.data.list as [])
        list.value = newList

        if (newList.length >= res.data.total) {
          finished.value = true
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function handleItemHeaderClick(item: IPledgeRecordItem) {
  router.push({
    path: '/purchaseGold',
    query: {
      id: item.id,
      title: item.name,
      readOnly: '1',
    },
  })
}

function onEndClick(id: number) {
  showConfirmDialog({
    title: t('h5.withdraw.notification'),
    message: t('h5.pledge.end_order_warn', { percent: '20%' }),
    confirmButtonText: t('h5.common.confirm'),
    cancelButtonText: t('h5.common.cancel'),
  }).then(() => {
    loading.value = true
    abortEarlyApi(id)
      .then((res) => {
        if (res.code === 200) {
          // 刷新列表
          finished.value = false
          data.page = 1
          list.value = []
          handleRequest()
        } else {
          showToast(t('h5.yongxu_yinsun_error'))
        }
      })
      .catch(() => {
        showToast(t('h5.yongxu_yinsun_error'))
      })
      .finally(() => {
        loading.value = false
      })
  })
}
</script>
<template>
  <div class="records">
    <Navbar2 v-if="!isAllRecord" :title="$t('h5.pledge.record_title2')" :is-show-right="false" />

    <div class="toggle flex-box-se">
      <div
        class="running"
        :class="data.isSettlement === 0 && 'active'"
        @click="data.isSettlement = 0"
      >
        {{ $t('h5.pledge.status0') }}
      </div>
      <div
        class="finish"
        :class="data.isSettlement === 1 && 'active'"
        @click="data.isSettlement = 1"
      >
        {{ $t('h5.pledge.status1') }}
      </div>
    </div>
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
          <div class="header" @click="handleItemHeaderClick(item)">
            <div class="flex">
              <div class="left">
                <div class="NO">
                  <span>{{ $t('h5.contract.record.no') }}</span>
                  <span class="num">{{ item.id }}</span>
                </div>
                <div class="time">{{ formatToLocaleTime(item.createTime) }}</div>
              </div>
              <div class="right">
                <span v-if="Number(item.isSettlement) === 0" class="red">
                  {{ $t('h5.pledge.status0') }}
                </span>
                <span v-else-if="Number(item.isSettlement) === 1" class="green">
                  {{ $t('h5.pledge.status1') }}
                </span>
                <span v-else>-</span>
              </div>
            </div>
          </div>

          <div class="container">
            <div class="flex">
              <div>{{ $t('h5.pledge.cycle') }}</div>
              <div>{{ Number(item.day) }} {{ $t('h5.pledge.day') }}</div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.pledge.buyNum') }}</div>
              <div>{{ usFormat(item.buyNumber) }} USDT</div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.pledge.Rate') }}</div>
              <div>{{ item.fee ? item.fee / 100 : 0 }} %</div>
            </div>

            <div class="flex">
              <div>{{ $t('h5.pledge.Fee') }}</div>
              <div>{{ usFormat(item.totalFee) }} USDT</div>
            </div>
          </div>

          <div class="footer">
            <div class="flex">
              <div>{{ $t('h5.pledge.Total_earnings') }}</div>
              <div>
                <span v-if="Number(item.xaut) === 0" class="red">
                  {{ usFormat(item.xaut) }} USDT
                </span>
                <span v-else-if="Number(item.xaut) > 0" class="green">
                  {{ usFormat(item.xaut) }} USDT
                </span>
                <span v-else>-</span>
              </div>
            </div>
            <div v-if="Number(item.isSettlement) === 0" class="btn" @click="onEndClick(item.id)">
              {{ $t('h5.pledge.end_order') }}
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
  .toggle {
    position: sticky;
    top: 50px;
    z-index: 9999;
    background-color: var(--cb-bgc);
    padding: 16px;
    font-size: 16px;
    border-top: 1px solid var(--cb-bgc2);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    & > div {
      flex: 1;
      margin: 0 10px;
      text-align: center;
      height: 45px;
      line-height: 45px;
      text-align: center;
      border-radius: 22px;
      background-color: var(--cb-bgc2);
      color: #fff;
    }
    .active {
      background: var(--cb-btnBgc);
      color: #fff;
    }
  }
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
      color: var(--cb-fColor);
      // background-color: var(--cb-bgc3);
      padding: 15px;
      border-radius: 5px;

      // border-bottom: 1px solid #f2f2f2;
      // padding-bottom: 30px;
      // margin-top: 12px;
      .header {
        font-size: 16px;
        .NO {
          //   color: #333;
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
        // color: #333;
      }

      .container,
      .footer {
        display: flex;
        flex-direction: column;
        gap: 15px;
        .btn {
          height: 44px;
          line-height: 44px;
          background-color: #f04a5a;
          text-align: center;
          border-radius: 5px;
          color: #fff;
        }
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
