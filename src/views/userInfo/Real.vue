<script setup lang="ts">
import { getBasicAuthenticationInfo, getAdvancedAuthenticationInfo } from '@/api/userInfo'
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { showToast } from 'vant'
import { IAuthenticationInfoRes } from '@/api/userInfo/model/userInfoModel'

const router = useRouter()
const { t } = useI18n()
const status = {
  0: '-',
  1: t('h5.real.status1'),
  2: t('h5.real.status2'),
  3: t('h5.real.status3'),
  4: t('h5.real.No_certified'),
}

const primaryCertainlyStatus = ref()
const HCertainlyStatus = ref(0)
const baseInfo = ref<IAuthenticationInfoRes>()
const hInfo = ref()

watchEffect(() => {
  getBasicAuthenticationInfo().then((res) => {
    if (res.code === SUCCESS_CODE && res.data) {
      primaryCertainlyStatus.value = res.data.status || 4
      baseInfo.value = res.data
    }
  })
  getAdvancedAuthenticationInfo().then((res) => {
    if (res.code === SUCCESS_CODE && res.data) {
      // 4-未认证
      HCertainlyStatus.value = res.data.status || 4
      hInfo.value = res.data
    }
  })
})

function handleItem1Click(title: string) {
  if (!Boolean(baseInfo.value)) {
    showToast(t('h5.common.loading'))
    return
  }
  router.push({
    path: 'primary-certification',
    query: {
      title,
      status: primaryCertainlyStatus.value,
    },
  })
}

function handleItem2Click(title: string) {
  if (!Boolean(hInfo.value)) {
    showToast(t('h5.common.loading'))
    return
  }
  // 1-认证中 2-认证成功 3-认证失败
  if (primaryCertainlyStatus.value !== 2) {
    showToast(t('h5.real.h-verify-warn'))
    return
  }
  router.push({
    path: 'h-certification',
    query: {
      title,
      status: HCertainlyStatus.value,
    },
  })
}

function getStatusColor(primaryCertainlyStatus) {
  switch (primaryCertainlyStatus) {
    case 1:
    case 4:
      return 'gray'
    case 2:
      return 'green'
    case 3:
      return 'red'
    default:
  }
}
</script>

<template>
  <div class="real-box">
    <Navbar2
      :is-show-right="false"
      class="navbar"
      :title="$t('h5.userInfo.ID_Verfication')"
      back-path="/home"
    />
    <van-cell is-link @click="handleItem1Click($t('h5.real.primary-verify'))">
      <template #title>
        <div class="custom-title">
          <VerificationIcon class="cell-icon" />
          <span>
            {{ $t('h5.real.primary-verify') }}
          </span>
        </div>
      </template>
      <div :class="getStatusColor(primaryCertainlyStatus)">
        {{ status[primaryCertainlyStatus] }}
      </div>
    </van-cell>
    <van-cell is-link @click="handleItem2Click($t('h5.real.h-verify'))">
      <template #title>
        <div class="custom-title">
          <HVerificationIcon class="cell-icon" />
          <span>{{ $t('h5.real.h-verify') }}</span>
        </div>
      </template>
      <div :class="getStatusColor(HCertainlyStatus)">
        {{ status[HCertainlyStatus] }}
      </div>
    </van-cell>
  </div>
</template>

<style lang="less" scoped>
.real-box {
  --van-cell-background: var(--cb-bgc5);
  background-color: var(--cb-bgc5);
  height: 100%;
  .custom-title {
    .cell-icon {
      margin-right: 10px;
    }
    overflow: hidden;
    width: 190px;
    word-wrap: break-word;
  }
  .green {
    color: #00c572;
  }
  .red {
    color: #f04a5a;
  }
  .gray {
    color: #848598;
  }
}
</style>
