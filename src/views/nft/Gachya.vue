<script setup lang="ts">
import { showToast } from 'vant'
import { startApi } from '@/api/ntf/index'
import { IStartItem } from '@/api/ntf/model/ntfModel'
import { useNtfStore } from '@/stores/ntf'

const props = defineProps<{
  num: number
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const { t } = useI18n()
const resultList = ref<IStartItem[]>([])
const ntfStore = useNtfStore()
const { idMapImagePath, borderImgMapLevelId } = storeToRefs(ntfStore)
const startLoading = ref(false)

onMounted(() => {
  start(props.num)
})

function start(num: number) {
  clear()
  startLoading.value = true
  startApi(num)
    .then((res) => {
      if (res.code === 200) {
        getPath(res.data)
      } else {
        showToast(t(res.msg))
        emit('onClose')
      }
    })
    .catch((err) => {
      showToast(t(err))
      emit('onClose')
    })
    .finally(() => {
      setTimeout(() => {
        startLoading.value = false
      }, 2000)
    })
}

function getPath(list: number[]) {
  const starList = list.map((imgId) => {
    const item = idMapImagePath.value.get(imgId)
    if (item) {
      return item
    }
  })
  resultList.value = starList
}

function clear() {
  resultList.value = []
}

defineExpose<{
  start: (num: number) => void
}>({
  start,
})
</script>
<template>
  <div class="item-gachya">
    <section v-if="startLoading" class="rotate-startLoading">
      <div class="item">
        <div class="item-inner">
          <div class="item-inner-back"></div>
          <div class="item-inner-forward">
            <img src="~@/assets/images/card_unkown.png" class="cardImg" alt="" />
          </div>
        </div>
      </div>
    </section>
    <section v-else-if="resultList.length === 1">
      <div class="drawoneCard">
        <CardImgPre
          :imgSrc="resultList[0].path"
          :name="$t(`nft_name_${resultList[0].id}`)"
          :level="resultList[0].level"
        >
          <div class="bo">
            <img :src="borderImgMapLevelId[resultList[0].level]" alt="" class="border-png" />
            <div class="title">{{ $t(`nft_name_${resultList[0].id}`) }}</div>
          </div>
          <van-image :src="resultList[0].path" alt="item.remark" class="cardImg">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </CardImgPre>
      </div>
      <van-button class="btn-submit" @click="emit('onClose')">
        {{ $t('h5.common.confirm') }}
      </van-button>
    </section>
    <section v-else class="drawtenCard">
      <div
        v-for="(item, index) in resultList"
        class="item"
        :style="`--delay_show:${0.1 * index}s;`"
        :key="item.id + Math.random()"
      >
        <div class="item-inner" :style="`--delay_rotate:${1 * (index + 1)}s;`">
          <img src="~@/assets/images/cardback.jpg" alt="" class="item-inner-back" />
          <div class="item-inner-forward">
            <CardImgPre :imgSrc="item.path" :name="$t(`nft_name_${item.id}`)" :level="item.level">
              <div class="img-box">
                <img :src="borderImgMapLevelId[item.level]" alt="" class="border-png" />
                <van-image :src="item.path" alt="cardImg" class="cardImg">
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
        </div>
      </div>
      <van-button class="btn-submit" @click="emit('onClose')">
        {{ $t('h5.common.confirm') }}
      </van-button>
    </section>

    <!-- <van-button v-if="startLoading" class="btn-submit cancel" @click="emit('onClose')">
			{{ $t('h5.common.cancel') }}
		</van-button> -->
  </div>
</template>
<style lang="less" scoped>
@cardWidth: 200px;
@cardTop: 50%;
@cardLeft: 50%;
@bannerCardH: 230px;
@danCardW: 230px;

@cardBoxH: 100px; // 卡牌高度
@borderCardH: 400px;
.item-gachya {
  height: 100dvh;
  height: -webkit-fill-available;
  height: calc(var(--vh, 1vh) * 100);
  box-sizing: border-box;
  .rotate-startLoading {
    position: absolute;
    left: 50%;
    top: 42%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    width: 248px;
    height: 348px;

    .item {
      width: 248px;
      height: 348px;
      box-sizing: border-box;
      &-inner {
        display: flex;
        justify-content: center;
        height: 100%;
        position: relative;
        perspective: 1000px;
        transform-style: preserve-3d;
        animation: show_rotate_360 1s linear infinite;
        &-forward {
          box-sizing: border-box;
          transform: rotateY(180deg);
          border: 0.5px solid #d4d4d4;
          border-radius: 8px;
          overflow: hidden;
          .cardImg {
            width: 248px;
            height: 348px;
          }
        }

        &-back {
          position: absolute;
          width: 248px;
          height: 348px;
          transform: translateZ(1px);
          background-image: url('@/assets/images/cardback.jpg');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          border-radius: 8px;
          overflow: hidden;
        }
      }
    }
  }

  .drawoneCard {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 82vh;
    box-sizing: border-box;
    .bo {
      position: relative;
      width: 300px;
      height: @borderCardH;
      .border-png {
        position: absolute;
        z-index: 3;
        width: 300px;
        height: @borderCardH;
      }
      .title {
        position: absolute;
        z-index: 2;
        bottom: 27px;
        left: 50%;
        transform: translateX(-50%);
        width: 250px;
        padding: 6px 0;
        text-align: center;
        color: #ffd166;
        box-sizing: border-box;
        background-color: rgba(27, 38, 44, 0.6);
        font-size: 14x;
      }
    }

    .cardImg {
      position: absolute;
      z-index: 1;
      width: 248px;
      height: 348px;
    }

    .btn-submit {
      bottom: 0;
    }
  }

  .drawtenCard {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    place-items: center;
    gap: 5px;
    box-sizing: border-box;
    height: 82vh;
    padding-top: 16px;
    .item {
      position: relative;
      border-radius: 6px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      animation: show 0.4s ease var(--delay_show) forwards;
      opacity: 0;
      .item-inner {
        position: relative;
        height: 100%;
        width: 100%;
        perspective: 1000px;
        transform-style: preserve-3d;
        animation: show_rotate 0.4s ease var(--delay_rotate) forwards;
        .item-inner-forward {
          height: 100%;
          width: 100%;
          transform: rotateY(180deg);
          text-align: center;
          box-sizing: border-box;
          .img-box {
            position: relative;
            height: 100%;
            width: 100%;
            .border-png {
              position: absolute;
              left: 0px;
              top: -2px;
              z-index: 3;
              height: 104%;
              width: 100%;
              box-sizing: border-box;
              margin: 0;
            }
            .cardImg {
              position: absolute;
              z-index: 2;
              width: 84%;
              height: 89%;
              top: 6%;
              left: 8%;
              margin: 0;
            }
            .desc {
              position: absolute;
              z-index: 2;
              bottom: 5%;
              left: 50%;
              transform: translateX(-50%);
              width: 89%;
              padding: 5px 0;
              box-sizing: border-box;
              text-align: center;
              color: #ffd166;
              background-color: rgba(27, 38, 44, 0.6);
              font-size: 6px;
            }
          }
        }

        .item-inner-back {
          position: absolute;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          transform: translateZ(1px);
          margin: 0;
        }
      }
    }
  }

  .btn-submit {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10%;
    padding: 0 15px;
    min-width: 150px;
    background-color: var(--cb-btnBgc);
    color: var(--cb-fColor);
    border-color: var(--cb-btnBgc);
    box-shadow:
      0 4px 10px rgba(131, 91, 241, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.15);
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }
  .cancel {
    background-color: #d03231;
    box-shadow: none;
    border-color: transparent;
  }
}

.startLoading {
  background-color: rgba(131, 91, 241, 0.5);
  :deep(.container) {
    width: 60px;
    height: 60px;
  }
}

// 卡片出现动画
@keyframes show {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

// 卡片翻转动画
@keyframes show_rotate {
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(180deg);
  }
}
@keyframes show_rotate_360 {
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
}

// 抽卡统计界面切换动画
.show-enter-from,
.show-leave-to {
  opacity: 0;
  transform: scale(0.3);
}

.show-enter-to,
.show-leave-from {
  opacity: 1;
  transform: scale(1);
}

.show-enter-active,
.show-leave-active {
  transition: all 0.2s ease-in-out;
}

// 详细界面背景动画
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}
</style>
