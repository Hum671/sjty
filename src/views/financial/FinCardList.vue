<script setup lang="ts">
import { useFinacialStore } from '@/stores/finacial'

const router = useRouter()
const { finacialData } = storeToRefs(useFinacialStore())

function handleToVoteClick(item: any) {
  router.push({
    path: '/financial-detail',
    query: {
      detail: JSON.stringify(item),
    },
  })
}
</script>

<template>
  <div class="box">
    <div v-for="item of finacialData" :key="item.id" class="item light">
      <div class="title">{{ item.title }}</div>
      <div class="center">
        <img :src="item.icon" />
        <div class="right">
          <div class="r-top">
            <div class="rate">{{ item.avgRate }}%</div>
            <van-button color="#0052ff" class="btn" @click="handleToVoteClick(item)">
              {{ $t('welcome_to_vote') }}
            </van-button>
          </div>
          <div class="desc">
            <span>{{ item.limitMin }}{{ $t('starting_amount') }}</span>
            <span class="split">|</span>
            <span>{{ $t('limit_cast') }}{{ item.limitMax }}</span>
            <span class="split">|</span>
            <span>{{ $t('lock_up') }}{{ item.days }}{{ $t('day') }}</span>
          </div>
        </div>
      </div>
      <div class="process">
        <div class="label">{{ $t('project_progress') }}:</div>
        <van-progress
          stroke-width="7"
          :percentage="50"
          :show-pivot="false"
          color="#2ebd85"
          class="pro"
          track-color="#ffffff"
        />
        <div class="rate">{{ item.process }}%</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.box {
  padding: 0 16px;
  .item {
    background-color: #181818;
    margin: 14px 0;
    padding: 10px 15px 18px;
    border-radius: 4px;
    .title {
      line-height: 34px;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .light {
    background-color: #edf3fb;
  }
  .center {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    img {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      margin-right: 10px;
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 52px;
      .r-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
        .rate {
          font-size: 20px;
        }
        :deep(.van-button--normal) {
          padding: 4px 10px;
        }
        :deep(.van-button) {
          height: 28px;
          .van-button__text {
            font-size: 13px;
          }
        }
      }
      .desc {
        color: #999999;
        span {
          font-size: 11.5px;
        }
        .split {
          margin: 0 9px;
        }
      }
    }
  }
  .process {
    display: flex;
    align-items: center;
    .label {
      font-size: 12px;
      color: #999999;
      margin-right: 10px;
    }
    .pro {
      flex: 1;
    }
    .rate {
      font-size: 11px;
      margin-left: 10px;
    }
  }
}
</style>
