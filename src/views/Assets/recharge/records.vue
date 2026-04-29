<script setup lang="ts">
import { BaseParams } from '@/api/model/BaseModel'
import { rechargeRecords } from '@/api/user'
import { RechargeRecordItem } from '@/api/user/model/userModel'
import { formatToLocaleTime, usFormat } from '@/utils/utils'
import useCurrencyHook from '@/hooks/useCurrencyHook'

const props = defineProps<{
  activeKey?: string
}>()

const route = useRoute()
const loading = ref(false)
const finished = ref(false)
const { t } = useI18n()
const { iconMapType } = useCurrencyHook()
const isAllRecord = ref(false)
const data = reactive<BaseParams>({
  page: 1,
  pageSize: 15,
})
const list = ref<RechargeRecordItem[]>([])

watch(
  () => props.activeKey,
  () => {
    if (props.activeKey === 'RechargeRecord') {
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

watch(
  () => data.page,
  () => {
    handleRequest()
  },
)

onMounted(() => {
  if (!isAllRecord.value && !props.activeKey) {
    handleRequest()
  }
})

function onLoad() {
  if (finished.value) {
    return
  }

  data.page++
}

function handleRequest() {
  loading.value = true
  rechargeRecords(data)
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

function handleStatusClass(status: number) {
  if (status === 2) {
    return 'finished'
  }
  if (status === 3) {
    return 'reject'
  }
}

function handleStatusText(status: number) {
  if (status === 1) {
    return t('h5.common.processing')
  }
  if (status === 2) {
    return t('h5.common.finished')
  }
  if (status === 3) {
    return t('h5.common.reject')
  }
}
</script>

<template>
  <div class="records light">
    <Navbar2 v-if="!isAllRecord" :title="$t('h5.recharge.record.title')" :is-show-right="false" />

    <van-list
      v-model:loading="loading"
      :finished="finished"
      :finished-text="$t('h5.common.no_more')"
      @load="onLoad"
    >
      <div class="list">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="flex">
            <!-- <div>{{ $t('h5.common.time') }}</div> -->
            <div class="flex-box-nm">
              <img class="coinlogo" :src="iconMapType[item.type.toLocaleLowerCase()]" alt="" />
              <div class="flex title">
                <div class="flex-box-nm">
                  <!-- <img class="coinlogo" :src="iconMapType[item.type.toLocaleLowerCase()]" alt="" /> -->
                  <span>{{ item.type }}</span>
                </div>
                <span v-if="item.standard">-{{ item.standard }}</span>
              </div>
            </div>
            <div class="time">{{ formatToLocaleTime(item.createTime) }}</div>
          </div>
          <!-- <div class="flex">
						<div>{{ $t('h5.recharge.currency_type') }}</div>

					</div> -->
          <div class="flex">
            <div>{{ $t('h5.recharge.number') }}</div>
            <div class="amount">{{ usFormat(item.number) }}</div>
          </div>

          <div class="flex">
            <div>{{ $t('h5.common.status') }}</div>
            <div class="status" :class="handleStatusClass(item.status)">
              {{ handleStatusText(item.status) }}
            </div>
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
      padding: 15px 10px;
      border-radius: 5px;
      border: 1px solid var(--cb-borderColor2);
      .coinlogo {
        margin-right: 8px;
        width: 26px;
      }
      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--cb-fColor9);
        .time {
          color: var(--cb-fColor);
        }
        &.title {
          color: var(--cb-fColor);
        }
        .amount {
          color: var(--cb-fColor);
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
