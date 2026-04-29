<script setup lang="ts">
import { useNtfStore } from '@/stores/ntf'

defineProps({
  imgSrc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  level: {
    type: Number,
    default: 1,
  },
})

const { borderImgMapLevelId } = storeToRefs(useNtfStore())
const show = ref(false)

function handleClick(e) {
  // 只在点击具体的 slot 内容时触发
  if (e.target !== e.currentTarget) {
    show.value = true
  }
}
</script>

<template>
  <div class="box">
    <div class="slotbox" @click="handleClick">
      <slot></slot>
    </div>

    <van-popup
      v-model:show="show"
      :style="{ borderRadius: '5px', '--van-popup-background': 'transparent' }"
      closeable
      teleport="body"
    >
      <div class="img-container">
        <div class="img-box" @click="show = false">
          <img :src="borderImgMapLevelId[level]" alt="" class="border-png" />
          <van-image :src="imgSrc" :alt="name" class="cardImg">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <div class="desc">
            <div class="title">{{ name }}</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
}
.slotbox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-name {
  font-weight: 600;
  font-size: 16px;
  padding: 12px;
  text-align: center;
  user-select: none;
  background-color: var(--cb-cardBgc);
}
.img-container {
  position: relative;
  z-index: 999999;
  height: 140vw;
  width: 90vw;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  overflow: hidden; /* 超出部分隱藏 */
  .img-box {
    position: relative;
    height: 100%;
    width: 100%;
    .border-png {
      position: absolute;
      z-index: 30;
      width: 100%;
      height: 100%;
    }
    .cardImg {
      position: absolute;
      z-index: 2;
      width: 81%;
      height: 84%;
      top: 9%;
      left: 10%;
    }
    .desc {
      position: absolute;
      z-index: 2;
      bottom: 7%;
      left: 50%;
      transform: translateX(-50%);
      width: 81%;
      padding: 6px 0;
      text-align: center;
      color: #ffd166;
      background-color: rgba(27, 38, 44, 0.6);
      font-size: 16px;
    }
  }
}

.img-container img {
  max-width: 100%;
}
</style>
