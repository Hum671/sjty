<script setup lang="ts">
import { showToast } from 'vant'

const { t } = useI18n()
const isShowEditName = ref(false)
const newNickname = ref('')
const imageUrl = ref()
const fileInputRef = ref()
const avatorFile = ref<File>()

function handleCancelClick() {
  newNickname.value = ''
  isShowEditName.value = false
}

function handleConfirmClick() {
  if (newNickname.value.length === 0) {
    showToast(t('h5.userSetting.Please_enter_nickname'))
    return
  }

  // to do
  isShowEditName.value = false
}

function openFileDialog() {
  fileInputRef.value.click()
}

function handleFileChange() {
  const formData = new FormData()
  avatorFile.value = fileInputRef.value.files[0]
  formData.append('avatar', avatorFile.value)
}
</script>

<template>
  <div class="user-set-box">
    <Navbar2 :title="$t('h5.userSetting.Personal_information')" :is-show-right="false" />
    <div class="content">
      <van-cell :title="$t('h5.userSetting.Avatar')" is-link @click="openFileDialog">
        <template #value>
          <div>
            <img v-if="imageUrl" :src="imageUrl" class="cell-icon" alt="Preview" />
            <input
              type="file"
              ref="fileInputRef"
              style="display: none"
              @change="handleFileChange"
            />
          </div>
        </template>
      </van-cell>
      <van-divider />
      <van-cell
        is-link
        :title="$t('h5.userSetting.Nickname')"
        :value="newNickname || $t('h5.userSetting.Please_set_a_nickname')"
        @click="isShowEditName = true"
      />
      <van-divider />
    </div>
    <van-popup
      v-model:show="isShowEditName"
      round
      position="bottom"
      :style="{ height: '30%' }"
      @click-overlay="isShowEditName = false"
    >
      <div class="name-box">
        <div class="flex-box-sb">
          <div class="title">{{ $t('h5.userSetting.Nickname') }}</div>
          <div class="cancel" @click="handleCancelClick">
            {{ $t('h5.real.Cancel') }}
          </div>
        </div>
        <input
          v-model.trim="newNickname"
          type="text"
          :placeholder="$t('h5.userSetting.Please_enter_nickname')"
        />
        <van-button color="#2ab69c" block @click="handleConfirmClick">
          {{ $t('h5.userSetting.confirm') }}
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.user-set-box {
  box-sizing: border-box;
  --van-divider-margin: 0;
  .content {
    padding: 16px;
  }
  :deep(.van-cell, ) {
    height: 50px;
    align-items: center;
    padding: 10px 0;
  }
  :deep(.van-cell:after) {
    border-bottom: none;
  }
  :deep(.van-hairline--bottom:after) {
    border-bottom: none;
  }
  :deep(.van-cell__value) {
    font-size: 14px;
  }
  img {
    width: 34px;
    border-radius: 50%;
  }
  .name-box {
    padding: 18px;
    font-size: 16px;
    .flex-box-sb {
      margin-bottom: 20px;
      .cancel {
        color: #a1a1a1;
      }
    }
    input {
      box-sizing: border-box;
      border-radius: 8px;
      background-color: #f6f7fb;
      height: 55px;
      line-height: 55px;
      width: 100%;
      padding: 0 16px;
      margin-bottom: 30px;
    }
  }
}
</style>
