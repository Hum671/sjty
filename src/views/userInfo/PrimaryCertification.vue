<script setup lang="ts">
import {} from '@/api/userInfo'
import { getBasicAuthenticationInfo, basicAuthentication } from '@/api/userInfo'
// import { getBasicAuthenticationInfo, basicAuthentication, uploadImage } from '@/api/userInfo'
import { showToast } from 'vant'
import { SUCCESS_CODE } from '@/api/model/BaseModel'

const { t } = useI18n()
const route = useRoute()
const name = ref()
const ID = ref()
// const birthday = ref()
const baseInfo = ref()
// const fileList1 = ref([])
// const fileList2 = ref([])
// const frontId = ref()
// const backendId = ref()
const isUploading = ref(false)
const isHiddenBtn = computed(() => [1, 2].includes(Number(route.query.status)))
const isDisableSubmit = computed(() => {
  return !name.value || !ID.value
  // return !frontId.value || !backendId.value || !name.value || !ID.value || !birthday.value
})
const status = {
  1: t('h5.real.status1'),
  2: t('h5.real.status2'),
}

onMounted(() => {
  getBasicAuthenticationInfo().then((res) => {
    if (res.code === SUCCESS_CODE && res.data) {
      baseInfo.value = res.data
      // const host = baseInfo.value.host
      ID.value = baseInfo.value.identification
      name.value = baseInfo.value.name

      // nextTick(() => {
      //   if (baseInfo.value.front) {
      //     frontId.value = baseInfo.value.frontId
      //     fileList1.value = [
      //       {
      //         url: `${host}/${baseInfo.value.front}`,
      //       },
      //     ]
      //   }
      //   if (baseInfo.value.backend) {
      //     backendId.value = baseInfo.value.backendId
      //     fileList2.value = [
      //       {
      //         url: `${host}/${baseInfo.value.backend}`,
      //       },
      //     ]
      //   }
      // })
      // if (baseInfo.value.birthday) {
      //   birthday.value = baseInfo.value.birthday
      // }
    }
  })
})

// function afterRead(file, type: number) {
//   file.status = 'uploading'
//   uploadImage(file).then((res) => {
//     if (res.code === SUCCESS_CODE) {
//       if (type === 0) {
//         frontId.value = res.data.id
//       }
//       if (type === 1) {
//         backendId.value = res.data.id
//       }
//       file.status = ''
//     } else {
//       showToast(res.msg)
//       if (type === 0) {
//         frontId.value = null
//       }
//       if (type === 1) {
//         backendId.value = null
//       }
//       file.status = 'failed'
//     }
//   })
// }

// function onDelet(type: number) {
//   if (type === 0) {
//     frontId.value = null
//   }
//   if (type === 1) {
//     backendId.value = null
//   }
// }

function handleBackClick() {
  history.back()
}

function handleConfirmClick() {
  if ([1, 2].includes(Number(route.query.status))) {
    showToast(status[Number(route.query.status)])
    return
  }
  isUploading.value = true
  basicAuthentication({
    name: name.value,
    identification: ID.value,
    // birthday: birthday.value,
    // front: frontId.value,
    // backend: backendId.value,
  })
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        showToast(t('h5.real.up_success'))
        handleBackClick()
      } else {
        showToast(res.msg)
      }
    })
    .finally(() => {
      isUploading.value = false
    })
}
</script>

<template>
  <div class="p-box">
    <Navbar2 :title="route.query.title" :is-show-right="false" back-path="/real" />
    <div class="content">
      <div class="notice">{{ $t('h5.real.notice') }}</div>
      <div class="item">
        <div class="label">{{ $t('h5.real.name') }}</div>
        <div class="inp">
          <input
            v-model.trim="name"
            type="text"
            :disabled="isHiddenBtn"
            :placeholder="$t('h5.real.Please_enter')"
          />
        </div>
      </div>
      <div class="item">
        <div class="label">{{ $t('h5.real.ID_number') }}</div>
        <div class="inp">
          <input
            v-model.trim="ID"
            type="text"
            :disabled="isHiddenBtn"
            :placeholder="$t('h5.real.Please_enter')"
          />
        </div>
      </div>

      <!-- <div class="item">
        <div class="label">{{ $t('h5.real.birthday') }}</div>
        <div class="inp">
          <input
            v-model.trim="birthday"
            type="text"
            :disabled="isHiddenBtn"
            :placeholder="$t('h5.real.Please_enter')"
          />
        </div>
      </div> -->

      <!-- <div class="pc">
        <div class="tip">{{ $t('h5.real.Upload_front_certificate') }}</div>
        <div class="p1 flex-box-sa">
          <van-uploader
            v-model="fileList1"
            :deletable="!isHiddenBtn"
            :after-read="(file) => afterRead(file, 0)"
            @delete="onDelet(0)"
            max-count="1"
          >
            <span class="add-icon u-icon__icon uicon-plus u-iconfont"></span>
          </van-uploader>
        </div>
      </div>
      <div class="pc">
        <div class="tip">{{ $t('h5.real.Upload_back_certificate') }}</div>
        <div class="p1 flex-box-sa">
          <van-uploader
            v-model="fileList2"
            :deletable="!isHiddenBtn"
            :after-read="(file) => afterRead(file, 1)"
            @delete="onDelet(1)"
            max-count="1"
          >
            <span class="add-icon u-icon__icon uicon-plus u-iconfont"></span>
          </van-uploader>
        </div>
      </div> -->

      <van-button
        v-if="!isHiddenBtn"
        :disabled="isDisableSubmit"
        :loading="isUploading"
        size="large"
        class="btn-submit"
        block
        @click="handleConfirmClick"
      >
        {{ $t('h5.real.Confirm_and_submit') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@item-background-color: var(--cb-bgc);
.p-box {
  --van-cell-font-size: 14px;
  position: relative;
  height: 100%;
  .content {
    padding: 30px 16px 20px;
    color: var(--cb-fColor);
    .notice {
      color: red;
      margin-bottom: 40px;
    }
    .item {
      margin-bottom: 20px;
      .inp {
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: @item-background-color;
        padding: 10px 15px;
        border-radius: 3px;
        height: 28px;
        border: 1px solid var(--cb-borderColor2);
        input {
          flex: 1;
          color: var(--cb-fColor);
        }
        .iconfont {
          color: #888;
          font-size: 20px;
        }
      }
    }
    :deep(.van-uploader__preview) {
      margin: 0;
    }
    :deep(.van-uploader__preview-image) {
      width: 100%;
      height: 150px;
    }
    :deep(.van-uploader__upload) {
      border: 1px dotted #98a7b1;
      width: 100px;
      height: 100px;
      margin: 0;
    }
    .pc {
      margin-bottom: 20px;
      .p1 {
        font-size: 28px;
        height: 140px;
        padding: 5px;
        background-color: @item-background-color;
        border: 1px solid var(--cb-borderColor2);
      }
      .tip {
        margin-bottom: 12px;
        text-align: left;
      }
    }
  }
  .btn-submit {
    margin-top: 30px;
    color: #fff;
    background-color: var(--cb-btnBgc);
    border: none;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 22px;
  }
}
</style>
