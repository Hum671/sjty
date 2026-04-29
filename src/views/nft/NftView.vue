<script setup lang="ts" name="keepAliveNftView">
import { getMyResources } from '@/api/ntf/index'
import { useNtfStore } from '@/stores/ntf'
import type { INtfCardItem } from '@/api/ntf/model/ntfModel'

const router = useRouter()
const ntfStore = useNtfStore()
const { loading, imgPreLoadProgress, list, host, borderImgMapLevelId } = storeToRefs(ntfStore)
const myCardIDList = ref<number[]>([])
const showList = ref<INtfCardItem[]>([])
const currentTab = ref<'my' | 'all'>('my')
const ntfcardlistRef = ref('')

watch(
  () => [list.value, myCardIDList.value],
  () => {
    if (list.value.length > 0 || myCardIDList.value.length > 0) {
      onMyTabClick(currentTab.value)
    }
  },
)

onMounted(() => {
  ntfStore.preloadImages()
  getMyResourceList()
})

function getMyResourceList() {
  getMyResources().then((res) => {
    if (res.code === 200) {
      myCardIDList.value = res.data.slice(0, 2)
    }
  })
}

function filterMyList() {
  const idSet = new Set(unref(myCardIDList.value))
  showList.value = list.value.filter((item) => idSet.has(item.id))
}

function refreshList() {
  ntfStore.getResource()
  getMyResourceList()
}

function onMyTabClick(tabType: 'my' | 'all') {
  currentTab.value = tabType
  if (tabType === 'my') {
    filterMyList()
  }
  if (tabType === 'all') {
    showList.value = list.value
  }
}

function onRecordClick() {
  router.push('/ntfRecord')
}

function onGetCard() {
  router.push('/nftDraw')
}
</script>

<template>
  <div class="nft">
    <template v-if="!loading">
      <Navbar2
        class="navbar"
        :title="$t('h5.ntf.nav_title')"
        :is-show-right="false"
        :is-show-arrow-back="false"
        :isShowRecords="true"
        @onRecord="onRecordClick"
      />

      <div class="btns flex-box-sb">
        <div class="btn2" :class="{ active: currentTab === 'my' }" @click="onMyTabClick('my')">
          {{ $t('h5.ntf.my_card') }}
        </div>
        <div class="btn1" :class="{ active: currentTab === 'all' }" @click="onMyTabClick('all')">
          {{ $t('h5.ntf.all_card') }}
        </div>
      </div>

      <div ref="ntfcardlistRef" class="card-list">
        <VMyList :pageSize="10" :list="showList" @onRefresh="refreshList">
          <template #default="{ item }">
            <div :key="item.id" class="card">
              <CardImgPre
                :imgSrc="`${host}/${item.attachments.filepath}`"
                :name="$t(`nft_name_${item.id}`)"
                :level="item.level"
              >
                <div class="img-box">
                  <img :src="borderImgMapLevelId[item.level]" alt="" class="border-png" />
                  <van-image
                    :src="`${host}/${item.attachments.filepath}`"
                    :alt="item.remark"
                    class="cardImg"
                  >
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template>
                  </van-image>
                  <div class="desc">
                    <div class="title">{{ $t(`nft_name_${item.id}`) }}</div>
                  </div>
                </div>
              </CardImgPre>
            </div>
          </template>
        </VMyList>
        <van-back-top
          :teleport="ntfcardlistRef"
          :offset="400"
          right="1.5vw"
          bottom="30vh"
          class="custom"
        />
      </div>

      <van-button class="btn-submit" type="danger" @click="onGetCard">
        {{ $t('h5.ntf.get_card') }}
      </van-button>
    </template>
    <Loading v-if="loading" :loadingText="`${$t('h5.common.loading2')} ${imgPreLoadProgress}%`" />
  </div>
</template>

<style lang="less" scoped>
@cardBoxH: 250px; // 卡牌高度

.nft {
  --van-back-top-size: 50px;
  --van-back-top-background: var(--cb-bubblBgc);
  position: relative;
  height: 100%;
  background-color: var(--cb-cardBgc);
  .btns {
    margin: 15px;
    gap: 10px;
    .btn1,
    .btn2 {
      flex: 1;
      border-radius: 5px;
      background-color: var(--cb-btnBgc2);
      padding: 12px 15px;
      text-align: center;
      border: 1px solid var(--cb-borderColor);
    }
    .active {
      background-color: var(--cb-btnBgc);
      color: var(--cb-fColor);
    }
  }
  :deep(.list-wrapper) {
    height: calc(100dvh - 190px);
    height: calc(-webkit-fill-available - 190px);
    height: calc(var(--vh, 1vh) * 100 - 190px);
  }
  :deep(.list-container) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding: 10px 12px 70px;
    width: 100%;
    background-color: var(--cb-cardBgc);
    box-sizing: border-box;
    min-height: calc(100dvh - 190px);
    min-height: calc(-webkit-fill-available - 190px);
    min-height: calc(var(--vh, 1vh) * 100 - 190px);
  }
  .card-list {
    .card {
      height: @cardBoxH;
      display: flex;
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
    }
  }
  .btn-submit {
    position: absolute;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 20px);
    bottom: 8px;
  }
}
</style>
