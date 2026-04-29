<script setup lang="ts">
import { buyApi } from '@/api/ntf/index'
import { showToast } from 'vant/es'

const emit = defineEmits<{
  (e: 'onClose', isUpdata: boolean): void
}>()

const { t } = useI18n()
const loading = ref(false)
const buyCount = ref<number>(0)

function buyDrawCount() {
  if (buyCount.value <= 0) {
    showToast(`${t('h5.real.Please_enter')}${t('h5.recharge.number')}`)
    return
  }
  loading.value = true
  buyApi(buyCount.value)
    .then((res) => {
      if (res.code === 200) {
        showToast(t('h5.pledge.buy_success'))
        buyCount.value = 1
        emit('onClose', true)
      } else {
        showToast(t(res.msg))
      }
    })
    .catch((err) => {
      showToast(t(err))
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="container">
    <div class="currency container-item">
      <div class="number container-item">
        <div class="title">{{ $t('h5.ntf.draw_buy') }}</div>
        <div class="item">
          <input
            v-model.number="buyCount"
            type="number"
            min="1"
            oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value === '0') this.value = '';"
            :placeholder="`${$t('h5.real.Please_enter')}${$t('h5.recharge.number')}`"
          />
        </div>
        <div class="tips">
          {{ $t('h5.ntf.draw_one_u') }}:
          <span class="value">2</span>
          USDT
        </div>
        <div class="tips">
          {{ $t('h5.ntf.draw_all_u') }}:
          <span class="value">{{ (buyCount || 0) * 2 }}</span>
          USDT
        </div>
      </div>
    </div>
    <div class="btns">
      <van-button :loading="loading" class="btn-submit" size="large" @click="buyDrawCount">
        {{ $t('h5.common.confirm') }}
      </van-button>
      <van-button class="btn-submit2" size="large" @click="emit('onClose', false)">
        {{ $t('h5.common.cancel') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@item-background-color: #f6f7fb;
.container {
  padding: 0 16px;
  color: #919fac;
  .container-item {
    .title {
      font-size: 16px;
    }
    .item {
      margin: 16px 0 30px;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: @item-background-color;
      padding: 10px 15px;
      border-radius: 3px;
      height: 28px;
    }

    &.number {
      margin-top: 20px;
      input {
        height: 28px;
        width: 100%;
        color: #1e1e1e;
      }
      .tips {
        color: #1e1e1e;
        font-size: 13px;
        margin-top: 20px;
        .value {
          margin-left: 5px;
          color: var(--cb-fColor2);
        }
      }
    }
  }

  .btns {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 0 15px;
    width: 90%;

    .btn-submit {
      height: 45px;
      line-height: 45px;
      flex: 1;
      background-color: var(--cb-btnBgc);
      color: var(--cb-fColor);
    }
    .btn-submit2 {
      height: 45px;
      line-height: 45px;
      flex: 1;
      background-color: var(--cb-cancelBtnBgc);
      color: var(--cb-fColor);
    }
  }
}
</style>
