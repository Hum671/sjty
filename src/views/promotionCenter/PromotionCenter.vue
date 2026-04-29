<script setup lang="ts">
import { showToast } from 'vant'
import QrCodeVue from 'qrcode.vue'
import { getPromotionInfo, getPromotionRule } from '@/api/promotionCenter'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import type { IPromotionRes } from '@/api/promotionCenter/model/promotionCenterModel'

const { t } = useI18n()
const linkRef = ref()
const isShowRule = ref(false)
const showQrCode = ref(false)
const promotionInfo = ref<IPromotionRes>()
const htmlValue = ref('')

const invitationLink = computed(() => {
  if (!promotionInfo.value) {
    return '-'
  }

  return `${location.origin}/register?pid=${promotionInfo.value.pid}&aid=${promotionInfo.value.aid}`
})

onMounted(() => {
  getPromotionInfo().then((res) => {
    if (res.code === SUCCESS_CODE) {
      promotionInfo.value = res.data
    }
  })
  getPromotionRule().then((res) => {
    if (res.code === SUCCESS_CODE) {
      htmlValue.value = res.data
    }
  })
})

function handleCopyShareLink() {
  try {
    navigator.clipboard.writeText(invitationLink.value)
    showToast(t('h5.share.Copy_successful'))
  } catch (error) {
    showToast(t('h5.share.Copy_failed'))
  }
}

function handleCopyCode() {
  try {
    navigator.clipboard.writeText(promotionInfo.value?.pid).then(() => {
      showToast(t('h5.share.Copy_successful'))
    })
  } catch (error) {
    showToast(t('h5.share.Copy_failed'))
  }
}
</script>

<template>
  <div class="promotion-center">
    <Navbar2
      :title="$t('h5.promotionCenter.Promotion_Center')"
      :is-show-right="false"
      back-path="/home"
      class="navbar"
    />
    <van-icon class="nav" name="info" @click="isShowRule = true" />
    <van-popup v-model:show="isShowRule" position="bottom" round :style="{ height: '90%' }">
      <div class="pop">
        <div class="p-title flex-box-sb">
          {{ $t('h5.promotionCenter.Rules') }}
          <van-icon name="cross" @click="isShowRule = false" />
        </div>
        <div class="p-content" v-xss="htmlValue"></div>
      </div>
    </van-popup>

    <div class="content">
      <section class="section">
        <div class="title">{{ $t('h5.promotionCenter.my_invit_code') }}</div>
        <div class="inp flex-box-sb">
          <div class="value">{{ promotionInfo?.pid }}</div>
          <div class="btn" @click="handleCopyCode">{{ $t('h5.promotionCenter.copy') }}</div>
        </div>
      </section>
      <section class="section">
        <div class="title">{{ $t('h5.promotionCenter.Promotion_link') }}</div>
        <div class="inp flex-box-sb">
          <div class="value text-over-ellip">{{ invitationLink }}</div>
          <div ref="linkRef" class="btn" @click="handleCopyShareLink">
            {{ $t('h5.promotionCenter.copy') }}
          </div>
        </div>
      </section>

      <div class="creatbtn flex-box-ce btn1" @click="showQrCode = true">
        <img src="@/assets/images/icon-qrcoder.svg" alt="" />
        <div class="btn-text">{{ $t('h5.promotionCenter.create_qr_code') }}</div>
      </div>

      <section class="section">
        <div class="title">{{ $t('h5.promotionCenter.my_invit_title') }}</div>
        <div class="row">
          <div class="item">
            <div class="val">{{ promotionInfo?.totalCount || '--' }}</div>
            <div class="label">{{ $t('h5.promotionCenter.total_num') }}</div>
          </div>
          <div class="item">
            <div class="val">{{ promotionInfo?.commission || '--' }}</div>
            <div class="label">{{ $t('h5.promotionCenter.Commission_amount') }}</div>
          </div>
        </div>
        <div class="line"></div>
        <div class="row">
          <div class="item">
            <div class="val">{{ promotionInfo?.level1Count || '--' }}</div>
            <div class="label">{{ $t('h5.promotionCenter.dai_1') }}</div>
          </div>
          <div class="item">
            <div class="val">{{ promotionInfo?.level2Count || '--' }}</div>
            <div class="label">{{ $t('h5.promotionCenter.dai_2') }}</div>
          </div>
          <div class="item">
            <div class="val">{{ promotionInfo?.level3Count || '--' }}</div>
            <div class="label">{{ $t('h5.promotionCenter.dai_3') }}</div>
          </div>
        </div>
      </section>

      <van-dialog
        v-model:show="showQrCode"
        :showConfirmButton="false"
        :closeOnClickOverlay="true"
        width="90vw"
      >
        <div class="d-box">
          <div class="top">
            <h3>
              {{ $t('h5.promotionCenter.want_have') }}
              <span>{{ $t('h5.promotionCenter.crypt') }}</span>
            </h3>
            <p>{{ $t('h5.promotionCenter.crypt_p') }}</p>
            <i
              class="van-badge__wrapper van-icon van-icon-cross close"
              @click="showQrCode = false"
            ></i>
          </div>
          <div class="cont">
            <div class="qr-code">
              <QrCodeVue :value="invitationLink" style="width: 100%; height: 100%" />
            </div>
            <img class="img1" src="@/assets/images/share-code-bg1.svg" />
            <img class="img2" src="@/assets/images/share-code-bg2.svg" />
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<style lang="less" scoped>
@head-h: 90px;
.nav {
  position: fixed;
  top: 14px;
  right: 14px;
  font-size: 24px;
  z-index: 11;
  color: #1989fa;
}
.pop {
  .p-title {
    position: sticky;
    top: 0;
    font-size: 18px;
    padding: 12px;
    border-bottom: 1px solid var(--cb-borderColor2);
    background-color: var(--cb-bgc);
  }
  .p-content {
    padding: 10px 12px;
  }
}

.d-box {
  position: relative;
  .top {
    padding: 25px 20px 20px;
    height: 180px;
    background: linear-gradient(180deg, #30b64a 0%, #104f1c 57.5%);
    h3 {
      font-size: 24px;
      margin-bottom: 10px;
      span {
        color: #e4c148;
      }
    }
  }
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 6px;
    border-radius: 50%;
    background-color: var(--cb-bgc2);
    opacity: 0.8;
  }
  .cont {
    display: flex;
    justify-content: center;
    position: relative;
    background: linear-gradient(180deg, #6491e9 0%, #0e0f18 100%);
    height: 330px;
    .img1 {
      width: 88vw;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%);
    }
    .img2 {
      margin-left: 14px;
      width: 200px;
    }
    .qr-code {
      position: absolute;
      border: 2px solid #66b158;
      padding: 10px;
      background-color: #dedede;
      border-radius: 10px;
      left: 50%;
      top: -65px;
      transform: translateX(-50%);
    }
  }
}

.promotion-center {
  box-sizing: border-box;
  .content {
    padding: 18px;
    .section {
      font-size: 14px;
      margin-bottom: 30px;
      .title {
        position: relative;
        color: var(--cb-fColor);
        padding-left: 20px;
        &::after {
          content: '';
          position: absolute;
          left: 5px;
          bottom: 50%;
          transform: translateY(50%);
          width: 8px;
          height: 8px;
          background-color: var(--cb-fColor2);
        }
      }
      .inp {
        gap: 10px;
        margin-top: 15px;
        padding: 20px;
        background-color: var(--cb-bgc6);
        border-radius: 5px;
        border: 1px solid var(--cb-borderColor2);
        .btn {
          color: var(--cb-fColor2);
        }
        .value {
          flex: 1;
        }
      }
      .row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        justify-content: center;
        row-gap: 40px;
        padding: 30px 10px;
        margin-top: 20px;
        .item {
          margin: 0 auto;
          text-align: center;
          font-size: 14px;
          .val {
            color: var(--cb-fColor2);
          }
          .label {
            margin-top: 20px;
            color: var(--cb-fColor6);
          }
        }
      }
    }
    .creatbtn {
      gap: 10px;
      height: 36px;
      line-height: 36px;
      font-size: 15px;
      margin-bottom: 30px;
      color: #fff;
    }
    .line {
      width: 100%;
      border-bottom: 1px dashed var(--cb-borderColor2);
    }
  }
}
</style>
