<script setup lang="ts" name="keepAliveNtfBondage">
import { getNtfGroup, exchangeApi } from '@/api/ntf/index'
import { useNtfStore } from '@/stores/ntf'

import type { INtfCardGroupItem, INtfCardItem } from '@/api/ntf/model/ntfModel'
import { showToast } from 'vant'

const { t } = useI18n()
const { borderImgMapLevelId } = storeToRefs(useNtfStore())
const active = ref('1')
const host = ref('http://47.130.117.64:8989')
const list = ref<INtfCardGroupItem[]>([])
const cardList = ref<INtfCardGroupItem[]>([])
const ntfBondagelistRef = ref('')
const loading = ref(false)
const exchangeLoading = ref(false)
const finished = ref(false)
const haveCardList = ref<number[]>([])

onMounted(() => {
  loading.value = true
})

onActivated(() => {
  getList()
})

function getList() {
  getNtfGroup()
    .then((res) => {
      if (res.code === 200) {
        host.value = res.data.host
        list.value = res.data.list
        cardList.value = res.data.list
        haveCardList.value = getIdFromAssets(res.data.assets)
      }
    })
    .finally(() => {
      finished.value = true
      loading.value = false
    })
}

function getIdFromAssets(assetsList: Array<{ resourceId: number }>) {
  const idList: number[] = []
  assetsList?.forEach((item) => idList.push(item.resourceId))
  return idList
}

function getCardCount(cardId: number, list: number[]) {
  try {
    let count = 0
    list.map((item) => {
      if (item === cardId) {
        count++
      }
    })
    return count
  } catch {
    return 0
  }
}

function onExchange(groupId: number) {
  exchangeLoading.value = true
  exchangeApi(groupId)
    .then((res) => {
      if (res.code === 200) {
        showToast(t('h5.swap.success'))
        getList()
      } else {
        showToast(t(res.msg))
      }
    })
    .catch((err) => {
      showToast(t(err))
    })
    .finally(() => {
      exchangeLoading.value = false
    })
}

function isCanExhancge(resourcesList: INtfCardItem[]) {
  return !resourcesList.every((item) => haveCardList.value.includes(item.id))
}
</script>

<template>
  <div class="ntfBondagelist" ref="ntfBondagelistRef">
    <Navbar2 :title="$t('h5.ntf.duihuanjiangli')" :is-show-right="false" />
    <van-collapse v-model="active" accordion>
      <van-collapse-item
        v-for="item in list"
        :title="$t(item.langKey)"
        :key="item.id"
        :name="item.id"
      >
        <div class="btn">
          <div>
            {{ $t('h5.ntf.group_value') }}:
            <span>{{ Number(item.value || 0) }}</span>
            USDT
          </div>
          <van-button
            :disabled="isCanExhancge(item.resources)"
            :loading="exchangeLoading"
            class="btn-submit"
            @click="onExchange(item.id)"
          >
            {{ $t('h5.gridmenu.Transfer') }}
          </van-button>
        </div>
        <div v-if="item.resources" class="grid">
          <div v-for="iten of item.resources" :key="iten.id" class="item">
            <div v-if="!haveCardList.includes(Number(iten.id))" class="cover"></div>
            <CardImgPre
              :imgSrc="`${host}/${iten.attachments.filepath}`"
              :name="$t(`nft_name_${iten.id}`)"
              :level="iten.level"
            >
              <div class="img-box">
                <img :src="borderImgMapLevelId[iten.level]" alt="" class="border-png" />
                <van-image
                  :src="`${host}/${iten.attachments.filepath}`"
                  :alt="iten.remark"
                  class="cardImg"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>
            </CardImgPre>

            <div class="info">
              <div class="name">
                {{ $t(`nft_name_${iten.id}`) }}
              </div>
              <span class="count">x{{ getCardCount(iten.id, haveCardList) }}</span>
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <Loading v-if="loading" />
    <van-back-top
      :teleport="ntfBondagelistRef"
      :offset="400"
      right="1.5vw"
      bottom="30vh"
      class="custom"
    />
  </div>
</template>

<style lang="less" scoped>
@cardBoxH: 240px; // 卡牌高度

.ntfBondagelist {
  --van-back-top-size: 50px;
  --van-tab-active-text-color: var(--cb-fColor2);
  --van-back-top-background: var(--cb-bubblBgc);
  :deep(.van-tabs--line .van-tabs__wrap) {
    height: 50px;
    padding-top: 0px;
    background-color: white;
  }
  :deep(.van-tab__text) {
    font-size: 17px;
  }
  :deep(.van-tabs) {
    height: 100%;
  }
  :deep(.van-tabs__nav--line) {
    padding-right: 40px;
  }
  .btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    font-size: 13px;
    color: #000;
    span {
      color: var(--cb-fColor2);
      margin: 0 2px;
    }
    .btn-submit {
      min-width: 100px;
      padding: 0 20px;
      background-color: var(--cb-btnBgc);
      color: var(--cb-fColor);
      box-sizing: border-box;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    width: 100%;
    box-sizing: border-box;
    .item {
      height: @cardBoxH;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      .img-box {
        position: relative;
        height: 100%;
        width: 100%;
        .border-png {
          position: absolute;
          z-index: 3;
          width: 100%;
          height: 100%;
        }
        .cardImg {
          position: absolute;
          z-index: 2;
          width: 81%;
          height: 83%;
          top: 10%;
          left: 10%;
        }
        .desc {
          position: absolute;
          z-index: 2;
          bottom: 7%;
          left: 50%;
          transform: translateX(-50%);
          width: 81%;
          padding: 5px 0;
          text-align: center;
          color: #ffd166;
          background-color: rgba(27, 38, 44, 0.6);
          font-size: 11px;
        }
      }
      .info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        color: #000;
        font-size: 12px;
        text-align: center;
        .count {
          color: var(--cb-fColor2);
        }
      }
    }
  }
}
</style>
