<script setup lang="ts">
import { getAdvancedAuthenticationInfo, advancedAuthentication, uploadImage } from '@/api/userInfo'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { showToast } from 'vant'

const { t } = useI18n()
const route = useRoute()
const hInfo = ref()
const fileList1 = ref([])
const fileList2 = ref([])
const fileList3 = ref([])
const picIds = ref<number[]>([])
const isUploading = ref(false)
const isHiddenBtn = computed(() => [1, 2].includes(Number(route.query.status)))
const isDisableSubmit = computed(
  () => !fileList1.value.length || !fileList2.value.length || !fileList3.value.length,
)
const status = {
  1: t('h5.real.status1'),
  2: t('h5.real.status2'),
}

onMounted(() => {
  getAdvancedAuthenticationInfo().then((res) => {
    if (res.code === SUCCESS_CODE && res.data) {
      hInfo.value = res.data
      if (hInfo.value.front && Number(route.query.status) !== 3) {
        nextTick(() => {
          setTimeout(() => {
            fileList1.value[0] = {
              url: `${hInfo.value.host}/${hInfo.value.front}`,
            }
            fileList2.value[0] = {
              url: `${hInfo.value.host}/${hInfo.value.back}`,
            }
            fileList3.value[0] = {
              url: `${hInfo.value.host}/${hInfo.value.holding}`,
            }
          }, 500)
        })
      }
    }
  })
})

function afterRead(file, type: number) {
  file.status = 'uploading'
  uploadImage(file)
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        picIds.value[type] = res.data.id
        file.status = ''
      } else {
        file.status = 'failed'
        showToast(res.msg)
        if (type === 0) {
          fileList1.value = []
        }
        if (type === 1) {
          fileList2.value = []
        }
        if (type === 2) {
          fileList3.value = []
        }
      }
    })
    .catch(() => {
      file.status = 'failed'
      if (type === 0) {
        fileList1.value = []
      }
      if (type === 1) {
        fileList2.value = []
      }
      if (type === 2) {
        fileList3.value = []
      }
    })
}

function handleBackClick() {
  history.back()
}

function handleConfirmClick() {
  if ([1, 2].includes(Number(route.query.status))) {
    showToast(status[Number(route.query.status)])
    return
  }

  isUploading.value = true
  advancedAuthentication({
    assets: null,
    occupation: null,
    incomeSource: null,
    front: picIds.value[0],
    back: picIds.value[1],
    holding: picIds.value[2],
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
  <div class="h-box">
    <Navbar2 :title="route.query.title" :is-show-right="false" back-path="/real" />
    <div class="pis">
      <div class="pc">
        <div class="tip">{{ $t('h5.real.Upload_front_certificate') }}</div>
        <div class="p1 flex-box-sa">
          <van-uploader
            v-model="fileList1"
            :deletable="!isHiddenBtn"
            :after-read="(file) => afterRead(file, 0)"
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
            max-count="1"
          >
            <span class="add-icon u-icon__icon uicon-plus u-iconfont"></span>
          </van-uploader>
        </div>
      </div>
      <div class="pc">
        <div class="tip">{{ $t('h5.real.Hold_your_ID_and_take_a_photo') }}</div>
        <div class="p1 flex-box-sa">
          <van-uploader
            v-model="fileList3"
            :deletable="!isHiddenBtn"
            :after-read="(file) => afterRead(file, 2)"
            max-count="1"
          >
            <span class="add-icon u-icon__icon uicon-plus u-iconfont"></span>
          </van-uploader>
        </div>
      </div>
      <van-button
        v-if="!isHiddenBtn"
        :disabled="isDisableSubmit"
        :loading="isUploading"
        class="btn"
        type="primary"
        size="large"
        block
        @click="handleConfirmClick"
      >
        {{ $t('h5.real.Confirm_and_submit') }}
      </van-button>
    </div>
    <!-- <div class="pis">
      <div class="item">
        <div class="label">{{ $t('h5.real.hVer.occupation') }}</div>
        <div class="inp">
          <input
            v-model.trim="occupation"
            type="text"
            :disabled="isHiddenBtn"
            :placeholder="$t('h5.real.Please_enter')"
          />
        </div>
      </div>
      <div class="item">
        <div class="label">{{ $t('h5.real.hVer.income_source') }}</div>
        <div class="inp">
          <input
            v-model.trim="incomeSource"
            type="text"
            :disabled="isHiddenBtn"
            :placeholder="$t('h5.real.Please_enter')"
          />
        </div>
      </div>
      <div class="pc">
        <div class="tip">{{ $t('h5.real.hVer.proof_of_funds') }}</div>
        <div class="p1 flex-box-sa">
          <van-uploader
            v-model="fileList1"
            :deletable="!isHiddenBtn"
            :after-read="(file) => afterRead(file)"
            @delete="onDelet"
            max-count="1"
          >
            <span class="add-icon u-icon__icon uicon-plus u-iconfont"></span>
          </van-uploader>
        </div>
      </div>
      <van-button
        v-if="!isHiddenBtn"
        :disabled="isDisableSubmit"
        :loading="isUploading"
        class="btn"
        size="large"
        block
        @click="handleConfirmClick"
      >
        {{ $t('h5.real.Confirm_and_submit') }}
      </van-button>
    </div> -->
  </div>
</template>

<style lang="less" scoped>
@item-background-color: var(--cb-bgc);
.h-box {
  --van-divider-margin: 10px;
  background-color: var(--cb-bgc5);
  position: relative;
  height: 100%;
  box-sizing: border-box;
  overflow: scroll;
  padding-bottom: 50px;
  .notice {
    margin-bottom: 20px;
    color: red;
  }
  .btn {
    margin-top: 60px;
    background-color: var(--cb-btnBgc);
    color: var(--cb-fColor);
    border: none;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 22px;
    color: #fff;
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
  .pis {
    color: var(--cb-fColor);
    text-align: center;
    padding: 18px;
    .item {
      margin-bottom: 20px;
      .label {
        text-align: left;
      }
      .inp {
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: var(--cb-btnBgc3);
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
  .preview-cover {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 4px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
