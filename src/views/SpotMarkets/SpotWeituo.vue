<script setup lang="ts">
import { coinCancel } from '@/api/order'
import { formatToLocaleTime, getIconImage, usFormat } from '@/utils/utils'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const emit = defineEmits<{ (e: 'onUpdate'): void }>()

const props = defineProps<{
  activeKey?: string
  isUpdata?: boolean
  componentKey?: string
  loading: boolean
  list?: any[]
}>()

const { t } = useI18n()
const userStore = useUserStore()
const newList = ref<any[]>([])

watch(
  () => props.list,
  () => {
    const list = props.list
    newList.value = list?.map((item) => {
      item.itemLoading = false
      return item
    })
  },
  {
    immediate: true,
  },
)

function cancelOrder(item) {
  item.itemLoading = true
  coinCancel(item.id).then((res) => {
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
  <div class="records light">
    <template v-if="newList.length > 0">
      <div class="list">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="top flex-box-sb">
            <div class="flex-box-nm">
              <img :src="getIconImage(item.coinName.toLocaleLowerCase())" alt="" />
              <div class="title">
                {{ item.coinName }}
              </div>
            </div>
            <van-button
              :loading="item.itemLoading"
              :disabled="item.itemLoading"
              class="btn"
              size="small"
              icon-position="right"
              loading-type="spinner"
              @click="cancelOrder(item)"
            >
              {{ $t('h5.yongxu_chedan') }}
            </van-button>
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
                {{ usFormat(item.number || 0) }}
              </div>
            </div>
            <div class="i2">
              <div class="label">{{ $t('h5.yongxu_weituojiage') }}(USDT)</div>
              <div class="value">
                {{ usFormat(item.price) }}
              </div>
            </div>
            <div class="i3">
              <div class="label">{{ $t('h5.yongxu_chengjiaoshulaing') }}</div>
              <div class="value">-</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="newList.length > 0" class="nomore">
        {{ $t('h5.common.no_more') }}
      </div>
    </template>

    <Empty v-if="newList.length === 0" class="empty" />

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
          border: 1px solid var(--cb-borderColor);
          background-color: var(--cb-bgc2);
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
  .nomore {
    text-align: center;
    font-size: 14px;
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
