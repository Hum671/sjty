<script setup lang="ts">
import { cancelOrderApi } from '@/api/market'
import type { OpenOrdersItem } from '@/api/market/model/MarketModel'
import { getIconImage, getCoinNameBySymbol, usFormat } from '@/utils/utils'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

interface NItem extends OpenOrdersItem {
  itemLoading: boolean
}
const emit = defineEmits<{
  (e: 'onUpdate'): void
}>()

const props = defineProps<{
  componentsKey?: string
  gangSize: number | string
  loading: boolean
  list: OpenOrdersItem[]
}>()

const { t } = useI18n()
const userStore = useUserStore()
const newList = ref<NItem[]>([])

watch(
  () => props.list,
  () => {
    const list = props.list as NItem[]
    newList.value = list?.map((item) => {
      item.itemLoading = false
      return item
    })
  },
)

function cancel(item: NItem) {
  item.itemLoading = true
  cancelOrderApi({ id: item.id, type: item.type }).then((res) => {
    if (res.code === 200) {
      emit('onUpdate')
      userStore.requestUserBalance()
    } else {
      showToast(t(res.msg))
    }
  })
}
</script>

<template>
  <div class="weituo-box">
    <template v-if="newList.length > 0">
      <div v-for="item in newList" class="item" :key="item.id + item.type">
        <div class="top flex-box-sb">
          <div class="flex-box-nm">
            <img :src="getIconImage(item.currency)" alt="" />
            <div class="title">
              {{ getCoinNameBySymbol(item.currency) }}
            </div>
          </div>
          <van-button
            :loading="item.itemLoading"
            :disabled="item.itemLoading"
            class="btn"
            size="small"
            icon-position="right"
            loading-type="spinner"
            @click="cancel(item)"
          >
            {{ $t('h5.yongxu_chedan') }}
          </van-button>
        </div>

        <div class="r2 flex-box-nm">
          <div class="label red">{{ $t('h5.coin.limit_price') }}</div>
          <div v-if="item.direction === -1" class="label red">
            {{ $t('h5.contract.index.decline') }}
          </div>
          <div v-else class="label green">{{ $t('h5.contract.index.rise') }}</div>

          <div v-if="item.positionType === 2" class="label black">
            {{ $t('h5.yongxu_quancang') }}
          </div>
          <div v-else class="label black">{{ $t('h5.yongxu_zhucang') }}</div>

          <div class="label black">{{ props.gangSize }}x</div>
          <div class="time">{{ item.createTime }}</div>
        </div>

        <div class="r3">
          <div>
            <div class="label">
              {{ $t('h5.yongxu_weituoshulaing') }}({{ getCoinNameBySymbol(item.currency) }})
            </div>
            <div class="value">{{ usFormat(item.number || 0) }}</div>
          </div>
          <div class="i2">
            <div class="label">
              {{ $t('h5.yongxu_chengjiaoshulaing') }}({{ getCoinNameBySymbol(item.currency) }})
            </div>
            <div class="value">{{ 0 }}</div>
          </div>
          <div class="i3">
            <div class="label">{{ $t('h5.yongxu_weituojiage') }}</div>
            <div class="value">{{ usFormat(item.entrustPrice || 0) }}</div>
          </div>
        </div>
      </div>
    </template>
    <Empty v-else class="empty" />
  </div>
</template>

<style lang="less" scoped>
.weituo-box {
  @green: #00c572;
  @red: #f04a5a;
  @pd: 15px;

  position: relative;
  color: var(--cb-fColor3);
  // background-color: var(--cb-bgc3);
  min-height: calc(100dvh - 500px);
  padding-bottom: 50px;
  box-sizing: border-box;
  .red {
    color: @red;
  }
  .green {
    color: @green;
  }
  .black {
    color: var(--cb-fColor);
  }
  .item {
    padding: 8px 15px 2px;
    border-bottom: 1px solid var(--cb-borderColor);
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
        border: 1px solid var(--cb-borderColor);
        background-color: var(--cb-bgc2);
        color: var(--cb-fColor);
        border-radius: 5px;
      }
    }
    .r2 {
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
        color: var(--cb-fColor3);
      }
      .value {
        color: var(--cb-fColor2);
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
  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .block {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
