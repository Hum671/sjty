<script setup lang="ts">
import { showToast } from 'vant'

const { t } = useI18n()
const invitationCode = ref('lk8s')
const codeRef = ref()

function handleCopyCode() {
  try {
    const text = codeRef.value.textContent
    navigator.clipboard.writeText(text)
    showToast(t('h5.share.Copy_successful'))
  } catch (error) {
    showToast(t('h5.share.Copy_failed'))
  }
}
</script>

<template>
  <div class="share-box">
    <Navbar2 :title="$t('h5.share.Invitation_details')" :is-show-right="false" />
    <div class="invit-box flex-box-sb">
      <div class="left">
        <div class="title">{{ $t('h5.share.My_invitation_code') }}</div>
        <div ref="codeRef" class="code">{{ invitationCode }}</div>
      </div>
      <div class="copy-icon" @click="handleCopyCode">
        <img src="~@/assets/icons/copy.png" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.invit-box {
  margin: 60px 16px;
  border-radius: 10px;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  .title {
    margin-bottom: 10px;
  }
  .copy-icon {
    width: 30px;
    height: 30px;
    background-color: rgba(51, 51, 51, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    img {
      width: 17px;
      height: 17px;
    }
  }
}
</style>
