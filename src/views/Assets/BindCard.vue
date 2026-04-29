<script setup lang="ts">
import router from '@/router'
import { showToast } from 'vant'
import { getBindInfo, bindCard } from '@/api/user'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { BindCardParams } from '@/api/user/model/userModel'

const { t } = useI18n()
const loading = ref(false)
const bindData = ref<{
  usdtErc: ''
  usdtTrc: ''
  ethErc: ''
  usdc: ''
  btc: ''
}>({
  usdtErc: '',
  usdtTrc: '',
  ethErc: '',
  usdc: '',
  btc: '',
})
const isDisableUsdtTrc = ref(false)
const isDisableUsdtErc = ref(false)
const isDisableEthErc = ref(false)
const isDisableUSDC = ref(false)
const isDisableBtc = ref(false)

onMounted(() => {
  getBindInfo().then((res) => {
    if (res.code === SUCCESS_CODE && res.data) {
      bindData.value = res.data

      isDisableUsdtTrc.value = Boolean(res.data.usdtTrc)
      isDisableUsdtErc.value = Boolean(res.data.usdtErc)
      isDisableEthErc.value = Boolean(res.data.ethErc)
      isDisableUSDC.value = Boolean(res.data.usdc)
      isDisableBtc.value = Boolean(res.data.btc)
    }
  })
})

function handleSubmit() {
  const data: BindCardParams = {
    usdt_erc: bindData.value.usdtErc || '',
    usdt_trc: bindData.value.usdtTrc || '',
    eth_erc: bindData.value.ethErc || '',
    usdc: bindData.value.usdc || '',
    btc: bindData.value.btc || '',
  }
  loading.value = true
  bindCard(data)
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        showToast(t('h5.bindcard.success'))
        router.back()
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="light">
    <Navbar2 :title="$t('h5.bindcard.title')" :is-show-right="false" />

    <div class="container">
      <div class="number container-item">
        <div class="title">USDT-TRC</div>
        <div class="item">
          <input v-model="bindData.usdtTrc" :disabled="isDisableUsdtTrc && false" type="text" />
        </div>
      </div>

      <div class="number container-item">
        <div class="title">USDT-ERC</div>
        <div class="item">
          <input v-model="bindData.usdtErc" :disabled="isDisableUsdtErc && false" type="text" />
        </div>
      </div>

      <div class="number container-item">
        <div class="title">ETH</div>
        <div class="item">
          <input v-model="bindData.ethErc" :disabled="isDisableEthErc && false" type="text" />
        </div>
      </div>

      <div class="number container-item">
        <div class="title">USDC</div>
        <div class="item">
          <input v-model="bindData.usdc" :disabled="isDisableUSDC && false" type="text" />
        </div>
      </div>

      <div class="number container-item">
        <div class="title">BTC</div>
        <div class="item">
          <input v-model="bindData.btc" :disabled="isDisableBtc && false" type="text" />
        </div>
      </div>

      <van-button :loading="loading" class="btn-submit" size="large" @click="handleSubmit">
        {{ $t('h5.bindcard.btnValue') }}
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 20px 16px;
  color: var(--cb-fColor);
  .container-item {
    .item {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: var(--cb-bgc4);
      border: 1px solid var(--cb-borderColor2);
      padding: 10px 15px;
      border-radius: 3px;
      height: 28px;
      img {
        @size: 26px;
        height: @size;
        width: @size;
      }
      .name {
        flex: 1;
        font-size: 16px;
        color: var(--cb-fColor5);
      }
      input {
        flex: 1;
      }
      .suffix,
      .iconfont {
        color: var(--cb-fColor6);
      }
    }
    .content {
      .text {
        margin-top: 10px;
        .fee {
          margin-left: 5px;
          color: var(--cb-fColor6);
        }
      }
    }
    &.number {
      margin-top: 20px;
      input {
        height: 28px;
        width: 100%;
        color: var(--cb-fColor6);
      }
    }
  }

  .btn-submit {
    margin-top: 60px;
    background-color: var(--cb-btnBgc);
    color: #fff;
    border: none;
  }
}
</style>
