<script setup lang="ts">
import { localCache } from '@/utils/cache'
import BannerDetailMap from './bannerLang'
import useLangHook from '@/hooks/useLangHooks'

const { lang } = useLangHook()
const route = useRoute()
const data = ref()

watchEffect(() => {
  data.value = JSON.parse(route.query.data)
})
</script>

<template>
  <div class="article-box">
    <Navbar2 :is-show-right="false" :title="$t('h5.common.back')" />
    <div class="content">
      <img :src="data.img" alt="" />
      <div v-xss="BannerDetailMap[data.text][lang]"></div>
    </div>
  </div>
</template>

<style lang="less">
.article-box {
  img {
    width: 100%;
  }
}
</style>
<style lang="less" scoped>
.content {
  padding: 15px;
  font-size: 16px;
  line-height: 28px;
  img {
    margin-bottom: 20px;
  }
}
</style>
