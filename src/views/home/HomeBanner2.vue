<script setup lang="ts">
import banner1 from '@/assets/bannerimg/ban1.png'
import banner2 from '@/assets/bannerimg/ban2.png'
import banner3 from '@/assets/bannerimg/ban3.png'

const banners = [
  {
    img: banner1,
    text: 'banner1',
  },
  {
    img: banner2,
    text: 'banner2',
  },
  {
    img: banner3,
    text: 'banner3',
  },
]
</script>

<template>
  <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
    <van-swipe-item v-for="(item, index) of banners" :key="index" class="banner-item">
      <img class="banner-img" :src="item.img" />
    </van-swipe-item>
  </van-swipe>
</template>

<style lang="less" scoped>
.my-swipe {
  .banner-item {
    display: flex;
    flex-direction: column;
    width: 345px;
    box-sizing: border-box;
    .banner-img {
      height: 200px;
      object-fit: cover;
      object-position: left;
    }
    .text {
      margin-top: 10px;
      line-height: 20px;
    }
  }
}
</style>
