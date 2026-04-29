<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getHelpDetail, getYinsiZhengce, getFalv } from '@/api/help'
import { getNoticeDetail } from '@/api/noticeBar'
import { IDetailItemMsg } from '@/api/help/model/helpModel'

type ApiNameType = 'help' | 'news'

const detailApiMap = {
  help: getHelpDetail,
  news: getNoticeDetail,
  yinsizhengce: getYinsiZhengce,
  falv: getFalv,
}

const route = useRoute()
const detailInfo = ref<IDetailItemMsg>({} as IDetailItemMsg)
const getDetailFn = detailApiMap[route.query.name as ApiNameType]

watchEffect(() => {
  getDetailFn(Number(route.query.id)).then((res) => {
    if (res.code === SUCCESS_CODE) {
      detailInfo.value = res.data[0]
    }
  })
})
</script>

<template>
  <div class="article-box">
    <Navbar2 :is-show-right="false" :title="detailInfo.title" back-path="/home" />
    <div v-xss="detailInfo.html" class="content"></div>
  </div>
</template>

<style lang="less">
.article-box {
  padding-bottom: 50px;
  img {
    width: 100%;
  }
  .falv-img-box {
    display: flex;
    img {
      width: 30px;
    }
  }
}
</style>
<style lang="less" scoped>
.content {
  padding: 15px;
}
</style>
