<script setup lang="ts">
import useLangHook from '@/hooks/useLangHooks'

const route = useRoute()
const version = ref('1.0.0')
const { onShowLangClick, lang } = useLangHook()
</script>

<template>
  <div class="setting-box">
    <Navbar2 :title="$t(route.query.titleLangCode)" :is-show-right="false" class="navbar" />
    <van-cell
      is-link
      :title="$t('h5.setting.lang')"
      :value="lang"
      @click="onShowLangClick"
    ></van-cell>
    <van-cell :title="$t('h5.setting.version')" :value="version"></van-cell>
  </div>
</template>

<style lang="less" scoped>
.setting-box {
  --van-cell-value-color: var(--cb-fColor2);
  --van-cell-font-size: 14px;
  .navbar {
    // margin-bottom: 10px;
  }
}
</style>
