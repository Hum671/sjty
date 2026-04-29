<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME
const router = useRouter()
</script>

<template>
  <div class="home-desc">
    <img class="videos" src="@/assets/images/h5_bg.gif" alt="" />
    <div class="content">
      <p>{{ $t('h5.home.desc_p1') }} {{ appName }}</p>
      <p>{{ $t('h5.home.desc_p2') }}</p>
      <p>{{ $t('h5.home.desc_p3', { appname: appName }) }}</p>
      <p>{{ $t('h5.home.desc_p4') }}</p>
      <p>{{ $t('h5.home.desc_p5') }}</p>
      <div class="btn btn1" @click="router.push('/recharge/index')">
        {{ $t('h5.home.desc_btn') }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-desc {
  position: relative;
  width: 100%;
  min-height: 330px;
  .videos {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    object-fit: cover;
    object-position: center center;
    z-index: 0;
  }
  .content {
    position: absolute;
    z-index: 10;
    color: var(--cb-fColor);
    padding: 10px 20px;
    width: 100%;
    box-sizing: border-box;
    p {
      &:nth-of-type(1) {
        font-size: 30px;
        line-height: 40px;
        color: #fff;
      }
      &:nth-of-type(2) {
        margin: 5px 0;
        font-size: 24px;
        line-height: 30px;
        color: #fff;
      }
      &:nth-of-type(3) {
        font-size: 14px;
        color: var(--cb-fColor4);
      }
      &:nth-of-type(4) {
        margin-top: 20px;
        font-size: 14px;
        color: var(--cb-fColor6);
      }
      &:nth-of-type(5) {
        font-size: 14px;
        color: var(--cb-fColor6);
      }
    }
    .btn {
      margin-top: 30px;
      width: 120px;
      border-radius: 50px;
      height: 25px;
      color: #fff;
    }
  }
}
</style>
