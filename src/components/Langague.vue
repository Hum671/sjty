<script setup lang="ts">
import useLangHook from '@/hooks/useLangHooks'

const { langOptions, isShowLangList, handleLangItemClick, lang, locale } = useLangHook()
</script>

<template>
  <div class="lang-box">
    <van-popup
      v-model:show="isShowLangList"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <van-nav-bar :right-text="$t(lang)" left-arrow @click-left="isShowLangList = false" />
      <div class="langoption">
        <div
          class="item flex-box-sb"
          :class="{ active: locale === item.lang }"
          v-for="item of langOptions"
          :key="item.name"
          @click="handleLangItemClick(item)"
        >
          {{ item.name }}
          <van-icon v-if="locale === item.lang" class="checkicon" name="success" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.lang-box {
  --van-nav-bar-icon-color: var(--cb-fColor);
  --van-nav-bar-text-color: var(--cb-fColor);
  --van-nav-bar-background: var(--cb-bgc4);
  --van-popup-background: var(--cb-contantBgc);
  --van-border-width: 0;
  --van-nav-bar-arrow-size: 20px;
  --van-nav-bar-height: var(--cb-headerH);
  // background-color: var(--cb-contantBgc);
  color: var(--cb-fColor);
  .checkicon {
    color: var(--cb-fColor4);
    font-size: 24px;
  }
  .item {
    padding: 5px 20px;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    border-bottom: 1px solid var(--cb-borderColor);
  }
  .active {
    color: var(--cb-fColor4);
  }
}
</style>
