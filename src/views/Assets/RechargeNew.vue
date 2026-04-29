<script setup lang="ts">
import { showToast } from 'vant'
import QrCodeVue from 'qrcode.vue'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getUdunRechargeList, getUdunRechargeAddress } from '@/api/user'
import useCurrencyHook from '@/hooks/useCurrencyHook'
import { getIconImage } from '@/utils/utils'
import { useConfigStore } from '@/stores/config'
import BTCIcon from '@/assets/icons/BTC.png'
import ETHIcon from '@/assets/icons/ETH.png'
import USDTIcon from '@/assets/icons/USDT.png'
import USDCIcon from '@/assets/icons/USDC.png'
import DOGEIcon from '@/assets/icons/DOGE.png'

const { t } = useI18n()
const router = useRouter()
const { assetCurrencyList } = useCurrencyHook()
const configStore = useConfigStore()
const { globalSettingInfo, assetConfig } = storeToRefs(configStore)
const rechargeAddress = ref('')
const registerList = ref<typeof assetCurrencyList>([])
const loading = ref(true)
const codeLoading = ref(false)
const currentRechargeItem = ref()
const isRechargeType = ref<'None' | 'Normal' | 'Udun'>('None') // None-未初始化 Normal-普通充值 Udun-UDun充值
const unit = ref('')
const copyTextRef = ref()
let standard = ''
const minRechargeNumber = ref('')
const coinKeyMapImg = {
  'USDT-ERC': USDTIcon,
  'USDT-TRC': USDTIcon,
  'USDC-ERC20': USDCIcon,
  USDC: USDCIcon,
  DOGE: DOGEIcon,
  TRCUSDT: USDTIcon,
  USDT: USDTIcon,
  BTC: BTCIcon,
  ETH: ETHIcon,
}

watchEffect(() => {
  if (currentRechargeItem.value) {
    const units = currentRechargeItem.value?.key.split('-')
    unit.value = units?.[0] ?? ''
    standard = units?.[1] ?? ''
  }

  if (assetConfig.value && unit.value) {
    const unitRepalce = unit.value.replace('20', '')
    const find = assetConfig.value?.find((item) => item.key === `MIN_RECHARGE_${unitRepalce}`)
    minRechargeNumber.value = find?.value ?? ''
  }

  // USDC的KEY使用ETH的
  if (currentRechargeItem.value?.key === 'USDC' || currentRechargeItem.value?.key === 'USDC-ERC') {
    const find = assetConfig.value?.find((item) => item.key === `RECHARGE_ADDRESS_ETH`)
    rechargeAddress.value = find?.value ?? ''
    loading.value = false
    return
  }

  if (assetConfig.value && isRechargeType.value === 'Normal') {
    const find = assetConfig.value?.find(
      (item) => item.key === `RECHARGE_ADDRESS_${currentRechargeItem.value?.key ?? ''}`,
    )
    rechargeAddress.value = find?.value ?? ''
    loading.value = false
  }
})

watch(
  globalSettingInfo,
  () => {
    // 请求全局配置的接口已在App组件中调用，不用单独调用（每次刷新都会调用）
    if (globalSettingInfo.value) {
      handleRechargeList()
    }
  },
  {
    immediate: true,
  },
)

// 请求到列表数据之后，会给currentRechargeItem初始化，会触发这个监听
watch(
  currentRechargeItem,
  () => {
    const rechargeItem = currentRechargeItem.value
    if (rechargeItem?.type && rechargeItem.type !== '') {
      isRechargeType.value = 'Udun'
      handleRechargeAddress(rechargeItem.type, rechargeItem.key)
    } else {
      isRechargeType.value = 'Normal'
      // 此函数已做缓存处理
      configStore.requestAssetsConfig()
    }
  },
  {
    immediate: true,
  },
)

function handleRechargeList() {
  if (globalSettingInfo.value?.isUdunRecharge && globalSettingInfo.value.isUdunRecharge === '1') {
    handleUDunRecharge()
  } else {
    registerList.value = assetCurrencyList
    currentRechargeItem.value = assetCurrencyList[0]
  }
}

function handleUDunRecharge() {
  getUdunRechargeList().then((res) => {
    if (res.code === SUCCESS_CODE) {
      registerList.value = res.data.map((item) => ({
        key: item.name,
        icon: item.logo,
        type: item.mainCoinType,
        iconKey: item.symbol,
      }))
      currentRechargeItem.value = registerList.value[0]
    }
  })
}

function handleRechargeAddress(type, key) {
  const keys = key.split('-')
  standard = keys?.[1] ?? ''

  const data = {
    mainCoinType: type,
    type: keys[0],
    standard,
  }
  codeLoading.value = true
  getUdunRechargeAddress(data)
    .then((res) => {
      rechargeAddress.value = res.data.address
    })
    .catch(() => {
      rechargeAddress.value = ''
    })
    .finally(() => {
      loading.value = false
      codeLoading.value = false
    })
}

function handleCopy() {
  try {
    if (navigator.clipboard) {
      // 使用 navigator.clipboard API 进行复制
      navigator.clipboard
        .writeText(rechargeAddress.value)
        .then(() => {
          showToast({
            message: t('h5.share.Copy_successful'),
            duration: 2000,
          })
        })
        .catch(() => {
          showToast({
            message: t('h5.share.Copy_failed'),
            duration: 2000,
          })
        })
    } else {
      // 如果浏览器不支持 Clipboard API，使用 document.execCommand 作为回退
      // 选择文本并复制
      copyTextRef.value.select()

      // 使用 execCommand 复制
      const successful = document.execCommand('copy')

      if (successful) {
        showToast({
          message: t('h5.share.Copy_successful'),
          duration: 2000,
        })
      } else {
        showToast({
          message: t('h5.share.Copy_failed'),
          duration: 2000,
        })
      }
    }
  } catch (error) {
    showToast({
      message: t('h5.share.Copy_failed'),
      duration: 2000,
    })
  }
}

function onNext() {
  router.push({
    path: '/recharge/index2',
    query: {
      unit: unit.value,
      minRechargeNumber: minRechargeNumber.value,
      standard: standard,
      isRechargeType: isRechargeType.value,
      currentRechargeItem: JSON.stringify(currentRechargeItem.value),
    },
  })
}

function handleRecord() {
  router.push('/recharge/records')
}
</script>

<template>
  <div class="recharge-box light">
    <Navbar2 :title="$t('h5.recharge.title')" :is-show-right="false" back-path="/user-financial" />
    <van-skeleton v-if="loading" class="skeleton" title :row="3" />
    <div v-else class="content">
      <div class="title">{{ $t('h5.recharge.currency_type') }}</div>
      <van-radio-group v-model="currentRechargeItem" direction="horizontal">
        <van-radio
          v-for="item in registerList"
          :key="item.key"
          class="cell-item flex-box-sb"
          :name="item"
          label-position="left"
          checked-color="#7691e2"
        >
          <img :src="getIconImage(item.iconKey)" alt="" />
          {{ item.key }}
        </van-radio>
      </van-radio-group>

      <div class="address-box">
        <div class="qrcode">
          <QrCodeVue v-if="!codeLoading && rechargeAddress" :value="rechargeAddress" :size="180" />
          <van-loading v-else class="qrloading" color="#7691e2" type="spinner" vertical />
        </div>
        <div class="address flex-box-sb" @click="handleCopy">
          <div class="link">{{ rechargeAddress }}</div>
          <span class="iconfont icon-fuzhi"></span>
        </div>
        <textarea
          v-model="rechargeAddress"
          ref="copyTextRef"
          readonly="true"
          class="copyText"
        ></textarea>
      </div>

      <div class="desc">{{ $t('h5.recharge.desc11') }}</div>

      <van-button
        v-if="!globalSettingInfo?.isUdunRecharge || globalSettingInfo.isUdunRecharge !== '1'"
        :loading="loading"
        class="btn-submit"
        size="large"
        @click="onNext"
      >
        {{ $t('h5.common.nextStep') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@item-background-color: #f6f7fb;
.skeleton {
  padding: 20px 16px;
}
.copyText {
  position: absolute;
  left: -9999px;
  top: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
  user-select: text;
}
.content {
  position: relative;
  padding: 20px 16px 0 16px;
  --van-radio-label-color: var(--cb-fColor);
  --van-radio-border-color: var(--cb-fColor7);
  .s-box {
    height: calc(100dvh - 100px);
    height: calc(-webkit-fill-available - 100px);
    height: calc(var(--vh, 1vh) * 100 - 100px);
    overflow: scroll;
  }
  .title {
    color: var(--cb-fColor);
    margin-bottom: 15px;
  }
  .cell-item {
    background-color: var(--cb-bgc4);
    padding: 12px 16px;
    width: 38%;
    text-align: left;
    font-size: 13px;
    margin-bottom: 8px;
    color: var(--cb-fColor);
    border: 1px solid var(--cb-borderColor2);
    border-radius: 5px;
    img {
      width: 24px;
      height: 24px;
      margin-right: 6px;
      border-radius: 50%;
    }
  }
  :deep(.van-radio__label--left) {
    display: flex;
    align-items: center;
  }
  :deep(.van-radio-group) {
    --van-padding-sm: 0;
    padding-bottom: 0;
    justify-content: space-between;
  }
  .address-box {
    position: relative;
    margin-top: 10px;
    background-color: var(--cb-bgc4);
    border-radius: 3px;
    padding: 20px;
    border: 1px solid var(--cb-borderColor2);
    .qrcode {
      position: relative;
      @size: 180px;
      height: @size;
      width: @size;
      padding: 10px;
      border-radius: 8px;
      margin: 0 auto 20px;
      background-color: #fff;
      border: 1px solid var(--cb-borderColor2);
      .qrloading {
        position: absolute;
        z-index: 5;
        left: 50%;
        top: 50%;
        width: 30px;
        height: 30px;
        transform: translate(-50%, -50%);
        pointer-events: all;
        user-select: none;
        cursor: default;
      }
    }

    .address {
      margin-top: 30px;
      font-size: 14px;
      word-break: break-word;
      position: relative;
      line-height: 20px;
      color: var(--cb-fColor);
      border: 2px dashed var(--cb-borderColor);
      padding: 8px 12px;
      border-radius: 8px;
      .link {
        max-width: 240px;
      }
      .iconfont {
        font-size: 20px;
        color: var(--cb-btnBgc);
      }
    }
  }
  .desc {
    font-size: 13px;
    padding: 12px 5px 0px;
    line-height: 20px;
    color: var(--cb-fColor7);
  }
  .btn-submit {
    margin-top: 30px;
    margin-bottom: 80px;
    background-color: var(--cb-btnBgc);
    color: #fff;
  }
}
.label {
  font-size: 16px;
}
</style>
