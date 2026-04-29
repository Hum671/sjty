<script setup lang="ts">
import { getNoticeList } from '@/api/noticeBar'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import type { INoticeItem } from '@/api/noticeBar/model/noticeBarModel'
import useLangHook from '@/hooks/useLangHooks'

const noticeList = ref<INoticeItem[]>([])
const router = useRouter()
const route = useRoute()
const { lang } = useLangHook()

watch(
  () => [lang.value, route.path],
  () => {
    if (route.path === '/home') {
      getNoticeList().then((res) => {
        if (res.code === SUCCESS_CODE) {
          noticeList.value = res.data
        }
      })
    }
  },
  {
    immediate: true,
  },
)

// function handleItemClick() {
//   router.push('/news')
// }
</script>

<template>
  <div class="merquee-box">
    <van-notice-bar left-icon="volume" :scrollable="false">
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :touchable="false"
        :wrapable="false"
        :show-indicators="false"
      >
        <van-swipe-item v-for="item of noticeList" :key="item.id">
          {{ item.title }}
        </van-swipe-item>
      </van-swipe>
      <!-- <template #right-icon>
        <van-icon class="right-icon" name="wap-nav" @click="handleItemClick" />
      </template> -->
    </van-notice-bar>
  </div>
</template>

<style lang="less" scoped>
.merquee-box {
  --van-notice-bar-background: var(--cb-bgc4);
  --van-notice-bar-text-color: var(--cb-fColor);
  background-color: var(--cb-bgc);
  border: 1px solid var(--cb-borderColor);
  .notice-swipe {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
  .right-icon {
    font-size: 20px;
  }
  :deep(.van-swipe-item) {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  :deep(.van-notice-bar__left-icon) {
    font-size: 19px;
  }
}
</style>
