<script setup lang="ts">
import QrCodeVue from 'qrcode.vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const { globalSettingInfo } = storeToRefs(configStore)
const url = 'https://download.cexjpx.com/'

function onDownloadClick() {
  window.open(globalSettingInfo.value?.downloadApp, '_blank')
}
</script>

<template>
  <div v-if="globalSettingInfo?.downloadApp" class="download-box flex-box-ce">
    <div class="box flex-box-ce">
      <div class="qrcode">
        <QrCodeVue :value="globalSettingInfo.downloadApp" :size="180" />
      </div>
      <div class="btn btn1" @click="onDownloadClick">{{ $t('h5.userInfo.APP_download') }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.download-box {
  flex-direction: column;
  .box {
    margin: 40px 0 10px;
    flex-direction: column;

    .btn {
      font-size: 16px;
      height: 28px;
      line-height: 28px;
      min-width: 200px;
      border-radius: 40px;
      margin: 20px auto 0;
    }
    .qrcode {
      border: 1px solid var(--cb-borderColor2);
      border: 2px solid #66b158;
      padding: 10px;
      background-color: #dedede;
      border-radius: 10px;
    }
  }
}
</style>
