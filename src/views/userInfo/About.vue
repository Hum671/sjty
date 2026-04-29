<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { IAboutItem } from '@/api/about/model/aboutModel'
import { getAbout } from '@/api/about'

const route = useRoute()
const about = ref<IAboutItem>()
const loading = ref(false)

onMounted(() => {
  loading.value = true
  getAbout()
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        about.value = res.data
      }
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<template>
  <div class="about-box">
    <Navbar2 :title="route.query.title" :is-show-right="false" class="navbar" back-path="/home" />
    <div v-xss="about?.html" class="content"></div>
    <Loading v-if="loading" />
  </div>
</template>

<style lang="less" scoped>
.about-box {
  --van-cell-font-size: 14px;
  .content {
    padding: 15px;
  }
}
</style>
