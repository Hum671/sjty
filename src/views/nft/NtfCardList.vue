<script setup lang="ts" name="keepAliveNtfTabbar">
import { useNtfStore } from '@/stores/ntf'
import type { INtfCardItem } from '@/api/ntf/model/ntfModel'

const ntfStore = useNtfStore()
const { list, host, borderImgMapLevelId } = storeToRefs(ntfStore)
const cardList = ref<INtfCardItem[]>([]) // 過濾後的數據
const level = ref('0')
const searchValue = ref('')
const vanlistRef = ref('')
const ntfcardlistRef = ref('')
const tabs = [
  {
    name: 'h5.ntf.card_all',
    key: '0',
  },
  {
    name: 'h5.ntf.card_white',
    key: '1',
  },
  {
    name: 'h5.ntf.card_blue',
    key: '2',
  },
  {
    name: 'h5.ntf.card_gold',
    key: '3',
  },
  {
    name: 'h5.ntf.card_green',
    key: '4',
  },
  {
    name: 'h5.ntf.card_purple',
    key: '5',
  },
]

watchEffect(() => {
  cardList.value = list.value
})

watch(
  () => [searchValue.value, level.value],
  () => {
    filterList()
  },
)
watch(level, () => {
  const els = vanlistRef.value
  els?.forEach((item) => {
    item.scrollTop = 0
  })
})

onMounted(() => {
  ntfStore.getResource()
})

function filterList() {
  if (searchValue.value && Number(level.value) > 0) {
    cardList.value = list.value.filter((item) => {
      const levelFilter = Number(level.value) > 0 && item.level === Number(level.value)
      const searchFilter = item.remark.includes(searchValue.value)
      if (levelFilter && searchFilter) {
        return item
      }
    })
  } else if (searchValue.value) {
    cardList.value = list.value.filter((item) => {
      if (item.remark.includes(searchValue.value)) {
        return item
      }
    })
  } else if (Number(level.value) > 0) {
    cardList.value = list.value.filter((item) => {
      if (Number(level.value) > 0 && item.level === Number(level.value)) {
        return item
      }
    })
  } else {
    cardList.value = list.value
  }
}

function refreshList() {
  ntfStore.getResource()
}
</script>

<template>
  <div class="ntfcardlist" ref="ntfcardlistRef">
    <Navbar2 :title="$t('h5.ntf.nav_tab1')" :is-show-right="false" />

    <van-tabs v-model:active="level" animated shrink lazy-render scrollspy color="#7691e2">
      <van-tab
        v-for="item in tabs"
        :title="$t(item.name)"
        :key="item.key"
        :name="$t(item.key)"
        class="tab"
      >
        <div ref="vanlistRef" class="card-list">
          <VMyList :pageSize="10" :list="cardList" @onRefresh="refreshList">
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
                  </div>
                </CardImgPre>
                <div class="desc">
                  <div class="title">{{ $t(`nft_name_${item.id}`) }}</div>
                </div>
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
      </van-tab>
    </van-tabs>
    <!-- <Loading v-if="loading" /> -->
  </div>
</template>

<style lang="less" scoped>
@cardWidth: 100%;
.ntfcardlist {
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
  :deep(.list-wrapper) {
    height: calc(100dvh - 118px);
    height: calc(-webkit-fill-available - 118px);
    height: calc(var(--vh, 1vh) * 100 - 118px);
  }
  :deep(.list-container) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    padding: 0 12px;
    margin-top: 10px;
    height: calc(100dvh - 118px);
    height: calc(-webkit-fill-available - 118px);
    height: calc(var(--vh, 1vh) * 100 - 118px);
  }
  .card-list {
    .card {
      margin: 0 auto;
      margin-bottom: 13px;
      border: 1px solid var(--cb-borderColor);
      border-radius: 5px;
      padding: 5px 10px;
      background-color: var(--cb-cardBgc2);
      width: 80%;
      min-height: 225px;
      &:last-child {
        margin-bottom: 50px;
      }

      .img-box {
        position: relative;
        text-align: center;
        .border-png {
          position: relative;
          z-index: 3;
          width: @cardWidth;
        }
        .cardImg {
          position: absolute;
          top: 9%;
          left: 10%;
          width: 81%;
          height: 84%;
        }
      }
      .desc {
        margin: 5px auto 0;
        text-align: center;
        width: @cardWidth;
        color: #000;
      }
    }
  }

  .no-chang-search-icon {
    position: fixed;
    z-index: 9999;
    top: 12px;
    right: 0;
    font-size: 22px;
    width: 36px;
    height: 38px;
    background-color: #ffffff;
    padding-left: 10px;
  }
}
</style>
