<script setup lang="ts">
import { BaseParams } from '@/api/model/BaseModel'
import { withdrawRecords } from '@/api/user'
import { WithdrawRecordItem } from '@/api/user/model/userModel'
import { formatToLocaleTime, getIconImage, usFormat } from '@/utils/utils'

const props = defineProps<{
  activeKey?: string
}>()

const route = useRoute()
const loading = ref(false)
const finished = ref(false)
const isAllRecord = ref(false)
const { t } = useI18n()
const data = reactive<BaseParams>({
  page: 1,
  pageSize: 15,
})
const list = ref<WithdrawRecordItem[]>([])

watch(
  () => props.activeKey,
  () => {
    if (props.activeKey === 'WithdrawRecord') {
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
  withdrawRecords(data)
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
    <Navbar2 v-if="!isAllRecord" :title="$t('h5.withdraw.record.title')" :is-show-right="false" />

    <van-list
      v-model:loading="loading"
      :finished="finished"
      :finished-text="$t('h5.common.no_more')"
      @load="onLoad"
    >
      <div class="list">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="flex-box-sb">
            <div class="flex-box-nm">
              <img class="coinlogo" :src="getIconImage(item.type.toUpperCase())" alt="" />
              <div class="flex title">
                <span>{{ item.type }}</span>
                <span v-if="item.standard">-{{ item.standard }}</span>
              </div>
            </div>
            <div class="time">{{ formatToLocaleTime(item.createTime) }}</div>
          </div>

          <div class="flex">
            <div>{{ $t('h5.withdraw.number') }}</div>
            <div class="value">{{ usFormat(item.number) }}</div>
          </div>

          <div class="flex">
            <div>{{ $t('h5.common.status') }}</div>
            <div class="status" :class="handleStatusClass(item.status)">
              {{ handleStatusText(item.status) }}
            </div>
          </div>
          <div class="flex address">
            <!-- {{ $t('h5.withdraw.address') }} -->
            {{ item.address }}
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
  color: var(--cb-fColor9);
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
      // background-color: var(--cb-bgc6);
      padding: 15px 10px;
      border-radius: 5px;
      border: 1px solid var(--cb-borderColor2);
      .coinlogo {
        margin-right: 8px;
        width: 26px;
        border-radius: 50%;
      }
      .address {
        text-align: right;
        word-break: break-word;
      }
      .time {
        color: var(--cb-fColor5);
      }
      .flex {
        display: flex;
        justify-content: space-between;
        color: var(--cb-fColor9);
        &.title {
          font-size: 16px;
        }
        .value {
          color: var(--cb-fColor);
        }
        .address {
          word-break: break-word;
          max-width: 200px;
          text-align: right;
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
