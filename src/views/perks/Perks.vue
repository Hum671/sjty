<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getPerksDetail } from '@/api/home'

const detailInfo = ref('')

getPerksDetail().then((res) => {
  if (res.code === SUCCESS_CODE) {
    detailInfo.value = res.data
  }
})
</script>

<template>
  <div>
    <Navbar2 :is-show-right="false" :title="$t('h5.gridmenu.Perks')" />
    <div v-xss="detailInfo" class="content"></div>
  </div>
</template>

<style lang="less" scoped>
.content {
  padding: 15px;
}
</style>
