<script setup lang="ts">
import { showToast } from 'vant'
import QrCodeVue from 'qrcode.vue'

import useCurrencyHook from '@/hooks/useCurrencyHook'
import { useConfigStore } from '@/stores/config'
import router from '@/router'
import { selectImageFile } from '@/utils/utils'
import { getUdunRechargeAddress, recharge } from '@/api/user'
import { SUCCESS_CODE } from '@/api/model/BaseModel'

const { t } = useI18n()
const route = useRoute()
const configStore = useConfigStore()
const appName = import.meta.env.VITE_APP_NAME
const { assetCurrencyList } = useCurrencyHook()
const { assetConfig } = storeToRefs(configStore)
let standard = ''
const unit = ref('')
const minRechargeNumber = ref('')
const rechargeAddress = ref('')
const currentCurrency = ref<(typeof assetCurrencyList)[0]>()
const data = reactive({
  number: '',
  file: null,
})
const imgBase64 = ref('')
const loading = ref(false)
const isRechargeType = ref<'None' | 'Normal' | 'Udun'>('None') // None-未初始化 Normal-普通充值 Udun-UDun充值

watchEffect(() => {
  if (currentCurrency.value) {
    const units = currentCurrency.value?.key.split('-')
    unit.value = units?.[0] ?? ''
    standard = units?.[1] ?? ''
  }

  if (unit.value) {
    const unitRepalce = unit.value.replace('20', '')
    const find = assetConfig.value?.find((item) => item.key === `MIN_RECHARGE_${unitRepalce}`)
    minRechargeNumber.value = find?.value ?? ''
  }

  if (assetConfig.value && isRechargeType.value === 'Normal') {
    const find = assetConfig.value?.find(
      (item) => item.key === `RECHARGE_ADDRESS_${currentCurrency.value?.key ?? ''}`,
    )
    rechargeAddress.value = find?.value ?? ''
  }
})

onMounted(() => {
  const { query } = route

  currentCurrency.value = query as (typeof assetCurrencyList)[0]
  if (query?.type && query.type !== '') {
    isRechargeType.value = 'Udun'
    handleRechargeAddress(query.type, query.key)
  } else {
    isRechargeType.value = 'Normal'
    configStore.requestAssetsConfig()
  }
})

function handleRechargeAddress(type, key) {
  const keys = key.split('-')
  const standard = keys?.[1] ?? ''

  const data = {
    mainCoinType: type,
    type: keys[0],
    standard,
  }

  getUdunRechargeAddress(data).then((res) => {
    rechargeAddress.value = res.data.address
  })
}

function handleRecord() {
  router.push('/allrecord?type=RechargeRecord')
}

// function handleBack() {
//   router.back()
// }

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
  if (Number(data.number) <= 0 || Number(data.number) < Number(minRechargeNumber.value)) {
    showToast(`${t('h5.recharge.min_number')}: ${minRechargeNumber.value}${unit.value}`)
    return false
  }

  if (!data.file) {
    showToast(t('h5.recharge.upload_receipt'))
    return false
  }

  return true
}

function onSubmit() {
  if (!submitVerify()) {
    return
  }

  loading.value = true
  recharge(data.file, {
    number: Number(data.number),
    type: unit.value,
    standard,
  })
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        showToast(t('h5.recharge.success'))
        // router.replace('/recharge/records')
        // 重置数据
        data.number = ''
        data.file = null
        imgBase64.value = ''
      } else {
        showToast(t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function handleCopy() {
  navigator.clipboard.writeText(rechargeAddress.value).then(() => {
    showToast(t('h5.share.Copy_successful'))
  })
}
</script>

<template>
  <div class="recharge light">
    <Navbar2
      :title="$t('h5.recharge.title')"
      :is-show-right="false"
      :is-show-records="true"
      @on-record="handleRecord"
    />

    <van-skeleton v-if="!currentCurrency" class="c-skeleton" title :row="3" />

    <div v-if="currentCurrency" class="container">
      <div class="top-content">
        <div class="qrcode">
          <QrCodeVue v-if="rechargeAddress" :value="rechargeAddress" :size="180" />
          <van-loading v-else class="qrloading" color="#7691e2" type="spinner" vertical />
        </div>
        <div class="tip1">{{ $t('h5.assets.cunruqianbao') }}</div>
        <div class="tip2">{{ $t('h5.assets.tips_address') }}</div>
      </div>
      <!-- <div class="currency container-item">
        <div class="title">{{ $t('h5.recharge.currency_type') }}</div>
        <div class="item" @click="handleBack">
          <img :src="currentCurrency.icon" />
          <span class="name">{{ currentCurrency.key }}</span>
          <span class="iconfont icon-yanzhengma text-ddd"></span>
        </div>
      </div> -->

      <div class="addr-label">{{ $t('h5.assets.wellet_addr') }}</div>
      <div class="address-box">
        <div class="address">
          <div class="link">{{ rechargeAddress }}</div>
          <span class="iconfont icon-fuzhi" @click="handleCopy"></span>
        </div>
      </div>

      <template v-if="isRechargeType === 'Normal'">
        <div class="number container-item">
          <div class="title">{{ $t('h5.recharge.number') }}</div>
          <div class="item">
            <input
              v-model="data.number"
              :placeholder="`${$t('h5.recharge.placeholder_number')}${minRechargeNumber}`"
            />
            <span>{{ unit }}</span>
          </div>
        </div>

        <div class="number container-item">
          <div class="title">{{ $t('h5.recharge.receipt') }}</div>
          <div class="item-receipt" @click="handleSelectImage">
            <img v-if="imgBase64" :src="imgBase64" />
            <span v-else class="u-icon__icon uicon-plus u-iconfont"></span>
          </div>
        </div>

        <van-button :loading="loading" class="btn-submit" size="large" @click="onSubmit">
          {{ $t('h5.recharge.confirm') }}
        </van-button>

        <div class="desc">
          <section>
            <div class="title">{{ $t('h5.assets.wellet_cun_warn_t1') }}</div>
            <p>
              {{
                $t('h5.assets.wellet_cun_warn_t1_p1', {
                  appname: appName,
                  suportlink: 'TRC20,ETH,BTC',
                })
              }}
            </p>
            <p>
              {{
                $t('h5.assets.wellet_cun_warn_t1_p2', {
                  appname: appName,
                })
              }}
            </p>
            <p>
              {{
                $t('h5.assets.wellet_cun_warn_t1_p3', {
                  appname: appName,
                })
              }}
            </p>
            <p>
              {{
                $t('h5.assets.wellet_cun_warn_t1_p4', {
                  appname: appName,
                })
              }}
            </p>
            <p>
              {{
                $t('h5.assets.wellet_cun_warn_t1_p5', {
                  min: '100/USD',
                })
              }}
            </p>
            <p>
              {{ $t('h5.assets.wellet_cun_warn_t1_p6') }}
            </p>
            <p>
              {{ $t('h5.assets.wellet_cun_warn_t1_p7', { appname: appName }) }}
            </p>
            <p>
              {{ $t('h5.assets.wellet_cun_warn_t1_p8', { appname: appName }) }}
            </p>
            <p>
              {{ $t('h5.assets.wellet_cun_warn_t1_p8', { appname: appName }) }}
            </p>
          </section>
          <section>
            <div class="title">{{ $t('h5.assets.wellet_cun_warn_t2') }}</div>
            <p>
              {{ $t('h5.assets.wellet_cun_warn_t2_p1', { appname: appName }) }}
            </p>
            <p>
              {{ $t('h5.assets.wellet_cun_warn_t2_p2') }}
            </p>
            <p>
              {{ $t('h5.assets.wellet_cun_warn_t2_p3') }}
            </p>
            <p>
              {{ $t('h5.assets.wellet_cun_warn_t2_p4') }}
            </p>
          </section>
          <section>
            <div class="title">{{ $t('h5.assets.wellet_cun_warn_t3') }}</div>
            <p>{{ $t('h5.assets.wellet_cun_warn_t3_p1') }}</p>
          </section>
          <section>
            <div class="title">{{ $t('h5.assets.wellet_cun_warn_t4') }}</div>
            <p>{{ $t('h5.assets.wellet_cun_warn_t4_p1', { appname: appName }) }}</p>
          </section>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 20px 16px;
  color: var(--cb-fColor);
  .top-content {
    text-align: center;
    font-size: 15px;
    .qrcode {
      position: relative;
      @size: 180px;
      height: @size;
      width: @size;
      padding: 10px;
      border-radius: 8px;
      margin: 0 auto 20px;
      background-color: white;
      .qrloading {
        position: absolute;
        z-index: 5;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events: all;
        user-select: none;
        cursor: default;
      }
    }
    .tip1 {
      color: var(--cb-fColor2);
      margin: 15px 0;
    }
    .tip2 {
      color: var(--cb-fColor6);
    }
  }
  .addr-label {
    margin-top: 30px;
  }
  .container-item {
    .item {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: var(--cb-bgc4);
      padding: 10px 15px;
      border-radius: 3px;
      border: 1px solid var(--cb-borderColor2);

      img {
        @size: 26px;
        height: @size;
        width: @size;
      }
      .name {
        color: var(--cb-fColor6);
        flex: 1;
        font-size: 16px;
      }
      .iconfont {
        color: var(--cb-fColor2);
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
      border: 1px solid var(--cb-borderColor2);
      img {
        height: 100%;
      }
    }
  }

  .address-box {
    margin-top: 20px;
    background-color: var(--cb-bgc4);
    border-radius: 3px;
    padding: 14px 15px;
    border: 1px solid var(--cb-borderColor2);
    .address {
      font-size: 16px;
      word-break: break-word;
      position: relative;
      line-height: 20px;
      color: var(--cb-fColor);
      .link {
        font-size: 12px;
        max-width: 92%;
      }
      .iconfont {
        font-size: 20px;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        color: var(--cb-fColor2);
      }
    }
  }
  .desc {
    color: var(--cb-fColor7);
    font-size: 13px;
    padding: 12px 5px 0px;
    line-height: 20px;
    section {
      margin: 20px 0;
    }
    p::before {
      content: '• ';
      color: var(--cb-fColor7);
      font-size: 24px;
    }
  }
  .btn-submit {
    margin: 30px 0 0;
    background-color: var(--cb-btnBgc);
    color: var(--cb-fColor);
    border: none;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 22px;
  }
}
</style>
