<script setup lang="ts" name="keepAliveNftDraw">
import { getDrawCount, getMyResources } from '@/api/ntf/index'
import { useNtfStore } from '@/stores/ntf'
import type { IDrawCountRes } from '@/api/ntf/model/ntfModel'
import { showToast } from 'vant/es'

const { t } = useI18n()
const router = useRouter()
const ntfStore = useNtfStore()
const { loading, imgPreLoadProgress } = storeToRefs(ntfStore)
const drawInfo = ref<IDrawCountRes>()
const myCardList = ref<number[]>([])
const showGachya = ref(false)
const showBuyDraw = ref(false)
const startLoading = ref(false)
const gachyaNum = ref(1)
const gachyaRef = ref()

onMounted(() => {
  ntfStore.preloadImages()
  getMyResourceList()
})

onActivated(() => {
  getDrawCounnt()
})

function start(num: number) {
  if (!gachyaNum.value) {
    showToast(t('api.nft.draw.limit.reached'))
    return
  }
  gachyaNum.value = num
  showGachya.value = true
  // 第一次調用 Gachya組件未初始化，無法在此處調用，可以在Gachya生命周期中調用第一次start
  gachyaRef.value?.start(num)
}

function getDrawCounnt() {
  getDrawCount().then((res) => {
    if (res.code === 200) {
      drawInfo.value = res.data
      gachyaNum.value = res.data.count
    }
  })
}

function getMyResourceList() {
  getMyResources().then((res) => {
    if (res.code === 200) {
      myCardList.value = res.data
    }
  })
}

function onGachyaClose() {
  showGachya.value = false
  getDrawCounnt()
}

function onBuyDrawClose(isUpdata: boolean) {
  showBuyDraw.value = false
  if (isUpdata) {
    getDrawCounnt()
  }
}

function onExchangeClick() {
  router.push('/ntfBondage')
}

function onRecordClick() {
  router.push('/ntfRecord')
}
</script>

<template>
  <div class="nft">
    <Navbar2
      class="navbar"
      :title="$t('h5.ntf.nav_title')"
      :is-show-right="false"
      :isShowRecords="true"
      @onRecord="onRecordClick"
    />

    <template v-if="!loading">
      <div class="topbtns flex-box-sb">
        <div class="btn2" @click="showBuyDraw = true">
          {{ $t('h5.ntf.draw_buy') }}
        </div>
        <div class="btn1" @click="onExchangeClick">
          {{ $t('h5.ntf.duihuanjiangli') }}
        </div>
      </div>

      <NftBanner class="banner" />

      <div class="btm">
        <div class="info">
          <div>
            {{ $t('h5.ntf.draw_count') }}:
            <span>{{ drawInfo?.count || '0' }}</span>
          </div>
          <div>
            {{ $t('h5.ntf.usdt_balance') }}:
            <span>{{ Number(drawInfo?.usdt || '0') }}</span>
            USTD
          </div>
        </div>
        <div class="btns">
          <van-button class="btn-submit btn1" :disabled="startLoading" @click="start(1)">
            {{ $t('h5.ntf.start_1') }}
          </van-button>
          <van-button class="btn-submit btn2" :disabled="startLoading" @click="start(10)">
            {{ $t('h5.ntf.start_10') }}
          </van-button>
        </div>
      </div>

      <van-popup
        v-model:show="showGachya"
        :style="{
          borderRadius: '5px',
          width: '100%',
        }"
      >
        <Gachya :num="gachyaNum" ref="gachyaRef" @on-close="onGachyaClose" />
      </van-popup>

      <van-popup
        v-model:show="showBuyDraw"
        :style="{
          borderRadius: '5px',
          width: '94%',
          height: '43%',
          '--van-popup-background': '#fff',
        }"
      >
        <BuyDraw @on-close="onBuyDrawClose" />
      </van-popup>
    </template>
    <Loading v-if="loading" :loadingText="`${$t('h5.common.loading2')} ${imgPreLoadProgress}%`" />
  </div>
</template>

<style lang="less" scoped>
@cardWidth: 200px;
@cardTop: 50%;
@cardLeft: 50%;
@cardBoxH: 300px;
@bannerCardH: 230px;
@danCardW: 230px;
.nft {
  --van-popup-background: transparent;
  position: relative;
  height: 100%;
  .topbtns {
    padding: 15px;
    gap: 10px;
    border-bottom: 1px solid var(--cb-borderColor);
    .btn1,
    .btn2 {
      flex: 1;
      border-radius: 5px;
      background-color: var(--cb-btnBgc2);
      border: 1px solid var(--cb-borderColor);
      padding: 12px 5px;
      text-align: center;
    }
  }
  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100dvh - 276px);
    height: calc(-webkit-fill-available - 276px);
    height: calc(var(--vh, 1vh) * 100 - 276px);
  }

  .btm {
    position: absolute;
    bottom: 0px;
    padding: 14px 15px 26px;
    box-sizing: border-box;
    width: 100%;
    background-color: var(--cb-cardBgc);
    border-top: 1px solid var(--cb-borderColor);
    .info {
      color: #000;
      margin-bottom: 10px;
      line-height: 26px;
      font-weight: 500;
      span {
        margin-left: 4px;
        font-size: 15px;
        color: var(--cb-fColor2);
      }
    }
    .btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin: 0;
      .btn-submit {
        flex: 1;
        background-color: var(--cb-btnBgc);
        color: var(--cb-fColor);
      }
      .btn1 {
        background-color: #4da3ff;
      }
      .btn2 {
        background-color: #ffa93a;
      }
    }
  }
}
</style>
