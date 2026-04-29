<script setup lang="ts">
import { getNoticeList } from '@/api/noticeBar'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import type { INoticeItem } from '@/api/noticeBar/model/noticeBarModel'

const noticeList = ref<INoticeItem[]>([])
const router = useRouter()

onMounted(() => {
  getNoticeList().then((res) => {
    if (res.code === SUCCESS_CODE) {
      noticeList.value = res.data
    }
  })
})

function handleItemClick(item: any) {
  router.push({
    path: '/article',
    query: {
      id: item.id,
      name: 'news',
    },
  })
}
</script>

<template>
  <div class="new-box">
    <Navbar2 :title="$t('h5.news.news')" :is-show-right="false" />
    <van-cell
      v-for="(item, index) of noticeList"
      :key="index"
      is-link
      @click="handleItemClick(item)"
    >
      <template #title>
        <div class="text">
          {{ item.title }}
        </div>
      </template>
    </van-cell>
  </div>
</template>

<style lang="less" scoped>
.text {
  width: 320px;
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}
</style>
