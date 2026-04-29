<script setup lang="ts">
import BannerDetailMap from '@/views/news/bannerLang'
import banner1 from '@/assets/images/ban1.jpg'
import banner2 from '@/assets/images/ban2.jpg'
import banner3 from '@/assets/images/ban3.jpg'
import banner4 from '@/assets/images/ban4.jpg'
import useLangHook from '@/hooks/useLangHooks'

const router = useRouter()
const { locale } = useLangHook()
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
  {
    img: banner4,
    text: 'banner4',
  },
]

function onClick(item) {
  router.push({
    path: '/bannerDetail',
    query: {
      data: JSON.stringify(item),
    },
  })
}
</script>

<template>
  <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
    <van-swipe-item v-for="(item, index) of banners" :key="index" class="banner-item">
      <img class="banner-img" :src="item.img" />
      <div class="text">{{ BannerDetailMap[item.text][locale] }}</div>
    </van-swipe-item>
  </van-swipe>
</template>

<style lang="less" scoped>
.my-swipe {
  margin-top: 10px;
  border-bottom: 1px solid #f6f7fb;
  padding-bottom: 8px;
  .banner-item {
    display: flex;
    flex-direction: column;
    width: 345px;
    padding: 0 10px;
    box-sizing: border-box;
    .banner-img {
      height: 200px;
      object-fit: cover;
      object-position: left;
      border-radius: 6px;
    }
    .text {
      margin-top: 10px;
      line-height: 20px;
    }
  }
}
</style>
