<script setup lang="ts">
import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getUdunRechargeList } from '@/api/user'
import useCurrencyHook from '@/hooks/useCurrencyHook'
import router from '@/router'
import { useConfigStore } from '@/stores/config'

const { assetCurrencyList } = useCurrencyHook()
const configStore = storeToRefs(useConfigStore())

const registerList = ref<typeof assetCurrencyList>([])
const loading = ref(true)

watch(configStore.globalSettingInfo, () => {
  handleRechargeList()
})

onMounted(() => {
  handleRechargeList()
})

function handleRechargeList() {
  if (
    configStore.globalSettingInfo.value?.isUdunRecharge &&
    configStore.globalSettingInfo.value.isUdunRecharge === '1'
  ) {
    handleUDunRecharge()
  } else {
    registerList.value = assetCurrencyList
    loading.value = false
  }
}

function handleUDunRecharge() {
  getUdunRechargeList()
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        registerList.value = res.data.map((item) => ({
          key: item.name,
          icon: item.logo,
          type: item.mainCoinType,
        }))
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function handleRecharge(query) {
  router.push({
    path: '/recharge/index',
    query,
  })
}
</script>

<template>
  <div class="recharge-box light">
    <Navbar2 :title="$t('h5.recharge.title')" :is-show-right="false" />
    <van-skeleton v-if="loading" class="skeleton" title :row="3" />
    <div v-else class="content">
      <div class="title">{{ $t('h5.recharge.currency_type') }}</div>
      <div class="s-box">
        <div
          v-for="item in registerList"
          :key="item.key"
          class="cell-item flex-box-sb"
          @click="handleRecharge(item)"
        >
          <div class="left flex-box-nm">
            <img :src="item.icon" />
            <div class="label">
              {{ item.key }}
            </div>
          </div>
          <van-icon name="arrow" size="18" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.skeleton {
  padding: 20px 16px;
}
.content {
  padding: 20px 16px 0 16px;
  .s-box {
    height: calc(100dvh - 100px);
    height: calc(-webkit-fill-available - 100px);
    height: calc(var(--vh, 1vh) * 100 - 100px);
    overflow: scroll;
  }
  .title {
    color: #999999;
  }
  .cell-item {
    margin-top: 20px;
    background-color: #1a1a1a;
    padding: 12px 16px;
    border: 1px solid var(--cb-borderColor2);
    .left {
      img {
        width: 30px;
        height: 30px;
        margin-right: 14px;
      }
    }
  }
}
.label {
  font-size: 16px;
}
.light {
  .nav-bar {
    background-color: #ffffff !important;
  }
  .content {
    .item {
      background-color: #e3e3e3 !important;
    }
  }
  .cell-item {
    margin-top: 20px;
    background-color: var(--cb-contantBgc);
    border-radius: 5px;
  }
}
</style>
