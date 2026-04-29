<script setup lang="ts" name="keepAlivePledge">
import { getToken, usFormat } from '@/utils/utils'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getAiPledgeList, getPeldgeIncomeApi } from '@/api/pledge'

import BTCImage from '@/assets/images/btc.svg'
import ETHImage from '@/assets/images/eth.svg'
import TRCImage from '@/assets/images/trc.svg'
import ERCImage from '@/assets/images/erc.svg'
import USTDImage from '@/assets/images/usdt.png'

const router = useRouter()
const aiList = ref([])
const logoList = [BTCImage, ETHImage, TRCImage, ERCImage, USTDImage]
const loading = ref(false)
const incomeNum = ref(0)
const usdtNum = ref(0)

onMounted(() => {
  loading.value = true
  getAiPledgeList()
    .then((res) => {
      if (res?.code === SUCCESS_CODE) {
        aiList.value = res.data
      }
    })
    .finally(() => {
      loading.value = false
    })
})

onActivated(() => {
  if (getToken()) {
    // 請求余額與總收益
    getPeldgeIncomeApi().then((res) => {
      if (res.code === SUCCESS_CODE) {
        incomeNum.value = res.data?.income
        usdtNum.value = res.data?.usdt
      }
    })
  }
})

function handleRecordClick() {
  router.push('/allrecord?type=PledgeRecord')
}

function handleBuyClick(item: any) {
  if (!getToken()) {
    router.push('/login')
    return
  }
  router.push({
    path: '/purchaseGold',
    query: {
      id: item.id,
      title: item.times,
    },
  })
}

function onDescClick() {
  router.push({
    path: '/pledge/AiDesc',
    query: {
      title: 'h5.purchaseGold.desc.t1',
    },
  })
}
</script>

<template>
  <div class="pledge">
    <Navbar2
      class="navbar"
      :title="`XAU/CRY/STOCK ${$t('h5.pledge.top_title2')}`"
      :isShowRecords="true"
      :is-show-right="false"
      :is-show-arrow-back="false"
      @onRecord="handleRecordClick"
    />

    <div class="content">
      <div class="bigBox flex-box-nm">
        <img src="@/assets/coinLogo/USDT.png" alt="" class="logo" />
        <div>
          <div class="lc-unit">
            {{ $t('h5.financial.benjin') }}: <span>{{ usFormat(usdtNum || 0) }} USDT</span>
          </div>
          <div class="lc-unit">
            {{ $t('h5.financial.shouyi') }}: <span>{{ usFormat(incomeNum || 0) }} USDT</span>
          </div>
        </div>
      </div>
      <!-- <div class="bigBox flex-box-sb" @click="onDescClick">
        <div class="flex-box-nm box">
          <img class="logo" src="@/assets/images/book-logo.png" alt="" />
          <div>
            <p>{{ $t('h5.purchaseGold.desc.t1') }}</p>
            <p class="p1">{{ $t('h5.purchaseGold.desc.t2') }}</p>
          </div>
        </div>
        <van-icon name="arrow" size="18" />
      </div> -->
      <div class="ai-market">
        <div class="title">{{ $t('h5.pledge.top_title2') }}</div>
        <div class="list">
          <div v-for="(item, index) of aiList" :key="index" class="item">
            <div class="top flex-box-sb">
              <div class="left">{{ item.times }} {{ $t('h5.purchaseGold.day') }}</div>
              <van-icon name="arrow" size="18" @click="handleBuyClick(item)" />
            </div>
            <div class="jine flex-box-sb">
              <div>
                {{ $t('h5.coin.money') }}:
                <span class="val">
                  ${{ usFormat(Number(item.minBuyNumber)) }} - ${{
                    usFormat(Number(item.maxBuyNumber))
                  }}
                </span>
              </div>
              <div class="dayicome">
                {{ $t('h5.purchaseGold.dayincome') }}:
                <span class="rate">
                  {{ item.dayMinIncome / 100 }}% - {{ item.dayMaxIncome / 100 }}%
                </span>
              </div>
            </div>
            <div class="logolist">
              <img v-for="(item, index) of logoList" :src="item" alt="" :key="index" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading v-if="loading" />
  </div>
</template>

<style lang="less" scoped>
.content {
  padding-bottom: env(safe-area-inset-bottom);
  // background-color: #080726;
  .lc-unit {
    line-height: 30px;
    color: var(--cb-fColor8);
    span {
      color: var(--cb-fColor);
    }
  }
  .ai-income {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100px;
    background: url(@/assets/images/ai-gold-bg.png) no-repeat;
    background-size: 50%;
    background-position-x: center;
    background-position-y: -27px;
    text-align: center;
    font-size: 20px;
    border: 1px solid var(--cb-borderColor2);
    padding: 10px;
    .count {
      margin-right: 5px;
      color: #00c572;
    }
    .desc {
      margin-top: 10px;
      font-size: 16px;
    }
  }
  .ai-income1 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: url(@/assets/images/topbgc.svg) no-repeat;
    // background: url(@/assets/images/ai-gold-bg.png) no-repeat;
    background-size: 92%;
    background-position-x: center;
    text-align: left;
    font-size: 16px;
    padding: 25px 35px;
    margin: 10px auto;
    .count {
      margin-right: 5px;
      margin: 10px 0;
      font-size: 20px;
    }
    .line {
      margin: 13px 0;
    }
    .todayincome {
      justify-content: flex-end;
      font-size: 16px;
      color: #00c572;
      img {
        width: 20px;
      }
      .label {
        font-size: 14px;
      }
      .val {
        margin-left: 8px;
        color: #000;
      }
    }
    .desc {
      margin-top: 10px;
      font-size: 16px;
    }
    .unit {
      color: #00c572;
    }
  }
  .bigBox {
    margin-top: 4px;
    padding: 14px 15px;
    // border-top: 1px solid #ebeef5;
    border-bottom: 1px solid var(--cb-borderColor2);
    font-size: 16px;
    box-sizing: border-box;
    img {
      margin-right: 12px;
      width: 40px;
    }
    .box {
      p {
        max-width: 270px;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        margin: 0;
        text-overflow: ellipsis;
      }
      .p1 {
        padding-top: 8px;
        font-size: 12px;
        color: var(--cb-fColor6);
      }
    }
  }
  .ai-market {
    padding: 24px 12px;
    .title {
      font-size: 20px;
      margin-bottom: 20px;
    }
    .item {
      border-radius: 12px;
      // box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      font-size: 14px;
      overflow: hidden;
      background-color: var(--cb-bgc3);
      border: 1px solid var(--cb-borderColor);
      .top {
        background-color: var(--cb-bgc2);
        padding: 0 12px;
        line-height: 40px;
        .left {
          display: flex;
          align-items: center;
          font-weight: 600;
          .icon {
            width: 18px;
            margin-right: 4px;
          }
          .label {
            font-size: 17px;
            font-weight: 500;
          }
        }
        .btn {
          padding: 7px 10px;
          background-color: #00c572;
          border-radius: 5px;
          color: #fff;
          font-size: 12px;
        }
      }
      .jine {
        padding: 14px 12px 15px;
        font-size: 13px;
        gap: 10px;
        .dayicome {
          white-space: normal; /* 正常换行 */
          word-break: keep-all; /* 不在单词中间断开（适合中日韩文字和英文单词） */
          overflow-wrap: break-word;
          text-align: right;
        }
        span {
          margin-left: 2px;
          display: inline-block;
          line-height: 25px;
        }
        .val {
          font-size: 14px;
          color: var(--cb-fColor2);
        }
        .rate {
          font-size: 14px;
          color: var(--cb-fColor2);
        }
      }
      .logolist {
        padding: 0 12px 10px;
        img {
          width: 24px;
          margin-right: 8px;
        }
      }
      .btm {
        margin: 14px 0 34px;
        text-align: center;
        font-size: 16px;
        .label {
          margin-top: 4px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
