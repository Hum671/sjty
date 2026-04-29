<script setup lang="ts">
import { showToast } from 'vant'
import router from '@/router'
import { formatInputUs, parseFormatInputUsNumber, selectImageFile } from '@/utils/utils'
import { recharge } from '@/api/user'
import { SUCCESS_CODE } from '@/api/model/BaseModel'

const { t } = useI18n()
const route = useRoute()
const unit = ref('')
const data = reactive({
  number: '',
  file: null,
})
const imgBase64 = ref('')
const loading = ref(false)
const currentRechargeItem = ref()

onMounted(() => {
  currentRechargeItem.value = JSON.parse(route.query.currentRechargeItem as string)
})

function handleRecord() {
  router.push('/allrecord?type=RechargeRecord')
}

function handleSelectImage() {
  selectImageFile().then((file) => {
    data.file = file
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      imgBase64.value = e.target?.result as string
    }
  })
}

function submitVerify() {
  if (Number(data.number) <= 0 || Number(data.number) < Number(route.query.minRechargeNumber)) {
    showToast(`${t('h5.recharge.min_number')}: ${route.query.minRechargeNumber}${route.query.unit}`)
    return false
  }

  if (!data.file) {
    // showToast(t('h5.recharge.upload_receipt'))
    // return false
  }

  return true
}

function onSubmit() {
  if (!submitVerify()) {
    return
  }

  const { query } = route
  loading.value = true
  recharge(data.file, {
    number: Number(data.number),
    type: (query.unit as string) || '',
    standard: (query.standard as string) || '',
  })
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        showToast(t('h5.recharge.success'))
        router.replace('/allrecord?type=RechargeRecord')
      } else {
        showToast(t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function onInput(e) {
  const val = e.target.value
  // 去掉千分符，保持原始值
  data.number = parseFormatInputUsNumber(val)
}
</script>

<template>
  <div class="recharge light">
    <Navbar2
      :title="`${$t('h5.recharge.title')}（${currentRechargeItem?.key}）`"
      :is-show-right="false"
      :is-show-records="true"
      back-path="/recharge/index"
      @on-record="handleRecord"
    />

    <div class="container">
      <!-- <div class="currency container-item">
				<div class="title">{{ $t('h5.recharge.currency_type') }}</div>
				<div class="item" @click="handleBack">
					<img :src="currentRechargeItem?.icon" />
					<span class="name">{{ currentRechargeItem?.key }}</span>
					<span class="iconfont icon-yanzhengma text-ddd"></span>
				</div>
			</div> -->
      <template v-if="route.query.isRechargeType === 'Normal'">
        <div class="number container-item">
          <div class="title">{{ $t('h5.recharge.number') }}</div>
          <div class="item">
            <input
              :value="formatInputUs(data.number)"
              :placeholder="`${$t('h5.recharge.placeholder_number')} ${
                route.query.minRechargeNumber
              } ${route.query.unit}`"
              @input="onInput"
            />
            <span>{{ unit }}</span>
          </div>
        </div>

        <!-- <div class="number container-item">
          <div class="title">{{ $t('h5.recharge.receipt') }}</div>
          <div class="item-receipt" @click="handleSelectImage">
            <img v-if="imgBase64" :src="imgBase64" />
            <span v-else class="u-icon__icon uicon-plus u-iconfont"></span>
          </div>
        </div> -->

        <van-button :loading="loading" class="btn-submit" size="large" @click="onSubmit">
          {{ $t('h5.recharge.confirm') }}
        </van-button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 16px 30px 16px;
  color: #919fac;
  .container-item {
    margin-top: 20px;
    .item {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: var(--cb-bgc4);
      padding: 10px 15px;
      border-radius: 3px;
      height: 28px;
      img {
        @size: 26px;
        height: @size;
        width: @size;
      }
      .name {
        color: #1e1e1e;
        flex: 1;
        font-size: 16px;
      }
      .iconfont {
        color: #1e1e1e;
      }
    }
    &.number {
      margin-top: 20px;
      input {
        height: 28px;
        width: 100%;
        color: var(--cb-fColor);
      }
    }
    .item-receipt {
      margin-top: 10px;
      height: 150px;
      width: 100%;
      background-color: var(--cb-bgc4);
      border-radius: 3px;
      overflow: hidden;
      font-size: 28px;
      align-items: center;
      justify-content: center;
      padding: 5px;
      box-sizing: border-box;
      display: flex;
      img {
        height: 100%;
      }
    }
  }

  .btn-submit {
    margin-top: 100px;
    margin-bottom: 80px;
    background-color: var(--cb-btnBgc);
    color: #fff;
  }
}
</style>
