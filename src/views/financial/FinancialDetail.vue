<script setup lang="ts">
import IntrCard from '@/components/IntrCard.vue'

const router = useRouter()
const route = useRoute()
const i18n = useI18n()
const detailItem = ref(JSON.parse(route.query.detail as string) || {})
const pdDetailList = ref<Array<{ key: any; value: any }>>([])

watchEffect(() => {
  const detailInfo = detailItem.value
  pdDetailList.value = [
    {
      key: i18n.t('project_name'),
      value: detailInfo.title,
    },
    {
      key: i18n.t('project_progress'),
      value: `${detailInfo.process}%`,
    },
    {
      key: i18n.t('total_project'),
      value: `${detailInfo.totalInvestAmount} USDT`,
    },
    {
      key: i18n.t('Balance'),
      value: `${detailInfo.remainAmount} USDT`,
    },
    {
      key: i18n.t('limit_the_number_of_votes'),
      value: detailInfo.timeLimit,
    },
    {
      key: i18n.t('average_daily_income'),
      value: `${detailInfo.avgRate}%`,
    },
  ]
})

function handleLeftClick() {
  router.back()
}

function handleServiceClick() {
  router.push('/service')
}

function handleBuyClick(detailItem: any) {
  router.push({
    path: '/trade-detail',
    query: { detail: JSON.stringify(detailItem) },
  })
}
</script>

<template>
  <div class="detail-box light">
    <Navbar2 :title="$t('details')" />
    <div class="content">
      <div class="item">
        <div class="top flex-box-nm">
          <img :src="detailItem.icon" />
          <div class="top-r">
            <div class="title">{{ detailItem.title }}</div>
            <span class="remark">{{ detailItem.remark }}</span>
          </div>
        </div>
        <div class="btm flex-box-sb">
          <div class="aver">
            <div class="value">{{ detailItem.avgRate }}%</div>
            <div class="label">{{ $t('avg_income') }}</div>
          </div>
          <div class="cycle">
            <div class="value">{{ detailItem.days }}{{ $t('day') }}</div>
            <div class="label">{{ $t('project_cycle') }}</div>
          </div>
          <div class="st-amount">
            <div class="value">{{ detailItem.limitMin }}</div>
            <div class="label">{{ $t('starting_amount') }}</div>
          </div>
        </div>
      </div>
      <IntrCard :title="$t('interpret_for_you')" :content="detailItem.prodectIntroduction" />
      <IntrCard :title="$t('product_detail')" :list="pdDetailList" />
      <IntrCard :title="$t('product_rule')">
        <div class="rule">{{ $t('rule_1') }}</div>
        <div class="rule">{{ $t('rule_2') }}</div>
        <div class="rule">{{ $t('rule_3') }}</div>
        <div class="rule">{{ $t('rule_4') }}</div>
      </IntrCard>
    </div>
    <div class="buy" @click="handleBuyClick(detailItem)">
      <div class="s">{{ $t('buy_it_now') }}</div>
      <div class="b">{{ $t('USDT_order') }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.light {
  .nav-bar {
    background-color: #ffffff !important;
  }
  .content {
    .item {
      background-color: #e3e3e3 !important;
    }
  }
  .buy {
    color: #ffffff;
  }
}
.detail-box {
  height: calc(100dvh - 65px);
  height: calc(-webkit-fill-available - 65px);
  height: calc(var(--vh, 1vh) * 100 - 65px);

  overflow: scroll;
  .nav-bar {
    position: sticky;
    top: 0;
    z-index: 2;
    padding: 16px;
    background-color: #000;
    .left {
      .icon {
        width: 20px;
        margin-right: 16px;
      }
      .text {
        font-size: 18px;
      }
    }
  }
  .content {
    padding: 0 16px;
    .item {
      background-color: #181818;
      margin-bottom: 14px;
      padding: 20px 16px 15px;
      border-radius: 6px;
      .top {
        img {
          width: 52px;
          height: 52px;
          border-radius: 12%;
          margin-right: 14px;
        }
        .top-r {
          .title {
            padding-bottom: 8px;
            font-size: 14px;
          }
          .remark {
            padding: 4px 8px;
            background-color: rgba(55, 115, 245, 0.21);
            color: #0052ff;
            font-size: 11px;
            border-radius: 3px;
          }
        }
      }
      .btm {
        margin-top: 20px;
        text-align: center;
        .value {
          font-size: 14px;
          padding-bottom: 8px;
        }
        .label {
          color: #999;
          font-size: 12px;
        }
      }
    }
    .rule {
      color: #999;
      font-size: 12px;
      margin-top: 13px;
    }
  }
  .buy {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #0052ff;
    text-align: center;
    box-sizing: border-box;
    padding: 15px;
    .s {
      font-size: 15px;
      margin-bottom: 4px;
    }
    .b {
      font-size: 12px;
    }
  }
}
</style>
