<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { userInfo } = storeToRefs(userStore)

onMounted(() => {
  userStore.requestUserInfo()
})

function handleItemClick(path: string, title: string) {
  router.push({
    path,
    query: {
      title,
    },
  })
}
</script>

<template>
  <div class="setting-box">
    <Navbar2 :title="route.query.title" :is-show-right="false" class="navbar" back-path="/home" />

    <van-cell
      is-link
      :title="
        userInfo?.password
          ? $t('h5.security.Change_login_password')
          : $t('h5.security.set_login_password')
      "
      @click="handleItemClick('/loginPassword', $t('h5.security.Change_login_password'))"
    />

    <van-cell
      is-link
      :title="
        userInfo?.moneyPassword
          ? $t('h5.security.change_fund_password')
          : $t('h5.security.set_fund_password')
      "
      @click="handleItemClick('/fundPassword', $t('h5.security.change_fund_password'))"
    />

    <van-cell
      v-if="userInfo?.email"
      :title="$t('h5.security.Username')"
      :value="userInfo.email"
    ></van-cell>
  </div>
</template>

<style lang="less" scoped>
.setting-box {
  --van-cell-font-size: 14px;
  --van-cell-value-color: var(--cb-fColor2);
  .navbar {
    margin-bottom: 10px;
  }
}
</style>
