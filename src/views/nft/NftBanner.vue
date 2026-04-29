<script setup lang="ts">
import { useNtfStore } from '@/stores/ntf'

const ntfStore = useNtfStore()
const { shuffledList, host, borderImgMapLevelId } = storeToRefs(ntfStore)
</script>

<template>
  <section class="banner">
    <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
      <van-swipe-item v-for="item of shuffledList" :key="item.id">
        <div class="card">
          <CardImgPre
            :imgSrc="`${host}/${item.attachments.filepath}`"
            :name="$t(`nft_name_${item.id}`)"
            :level="item.level"
          >
            <div class="img-box">
              <img :src="borderImgMapLevelId[item.level]" :alt="item.remark" class="border-png" />
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
      </van-swipe-item>
    </van-swipe>
  </section>
</template>

<style lang="less" scoped>
.banner {
  box-sizing: border-box;
  .card {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    .img-box {
      position: relative;
      height: 390px;
      width: 360px;
      .border-png {
        position: absolute;
        z-index: 3;
        left: 50%;
        transform: translateX(-50%);
        height: 100%;
      }
      .cardImg {
        position: absolute;
        z-index: 2;
        width: 65%;
        height: 84%;
        top: 9%;
        left: 18%;
      }
      .desc {
        position: absolute;
        z-index: 2;
        bottom: 7%;
        left: 50%;
        transform: translateX(-50%);
        width: 65%;
        padding: 8px 0;
        text-align: center;
        color: #ffd166;
        background-color: rgba(27, 38, 44, 0.6);
        font-size: 13px;
      }
    }
  }
}
</style>
