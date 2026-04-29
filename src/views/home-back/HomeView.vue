<script setup lang="ts" name="keepAliveHome">
import { useCpnCtrlStore } from '@/stores/cpnCtrl'

const router = useRouter()
const { isShowLeftMenus } = storeToRefs(useCpnCtrlStore())
const searchValue = ref()

function handleMenuClick() {
  isShowLeftMenus.value = !isShowLeftMenus.value
}

function handleServiceClick() {
  router.push('/service')
}

function handleBtn1Click() {
  router.push('/pledge')
}

function handleBtn2Click() {
  router.push('/whiteBook')
}
</script>

<template>
  <div>
    <Navbar v-model="searchValue" @left-click="handleMenuClick" @right-click="handleServiceClick" />

    <NoticeBar />

    <Banners />

    <div class="btns flex-box-sb">
      <div class="btn1 flex-box-sb" @click="handleBtn1Click">
        {{ $t('h5.pledge.top_title2') }}
        <ArrowRightIcon />
      </div>
      <div class="btn2 flex-box-sb" @click="handleBtn2Click">
        {{ $t('h5.userInfo.White_Paper') }}
        <ArrowRightIcon />
      </div>
    </div>

    <div class="container">
      <MarketTable top="53px" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.btns {
  margin: 15px;
  gap: 10px;
  .btn1,
  .btn2 {
    flex: 1;
    border-radius: 5px;
    background-color: #f6f7fb;
    padding: 12px 15px;
  }
}
.container {
  padding-bottom: env(safe-area-inset-bottom);
}
:deep(.van-notice-bar__content) {
  font-size: 14px;
}
</style>
