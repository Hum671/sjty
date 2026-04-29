<script setup lang="ts" name="keepAliveHelp">
import { getHelpList } from '@/api/help'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import type { IHelpItem } from '@/api/help/model/helpModel'

const route = useRoute()
const router = useRouter()
const helpList = ref<IHelpItem[]>([])

onMounted(() => {
  getHelpList().then((res) => {
    if (res.code === SUCCESS_CODE) {
      helpList.value = res.data
    }
  })
})

function handleItemClick(id: number) {
  router.push({
    path: '/article',
    query: {
      id,
      name: 'help',
    },
  })
}
</script>
1

<template>
  <div class="help-box">
    <Navbar2 :title="route.query.title" :is-show-right="false" class="navbar" />
    <van-cell
      v-for="(item, index) of helpList"
      :key="index"
      is-link
      :title="item.title"
      @click="handleItemClick(item.id)"
    />
  </div>
</template>

<style lang="less" scoped>
.help-box {
  --van-cell-font-size: 14px;
  .navbar {
    margin-bottom: 10px;
  }
}
</style>
