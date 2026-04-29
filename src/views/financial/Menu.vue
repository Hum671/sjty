<script setup lang="ts">
const router = useRouter()
const i18n = useI18n()
const menus = [
  {
    icon: '',
    label: i18n.t('value-added-income'),
    url: '',
  },
  {
    icon: '',
    label: i18n.t('members_only'),
    url: '',
  },
  {
    icon: '',
    label: i18n.t('normal_product'),
    url: '',
  },
  {
    icon: '',
    label: i18n.t('my_investment'),
    url: '',
  },
]

function handleItemCLick(url: string) {
  router.push(url)
}
</script>

<template>
  <div class="menu-box">
    <div class="list">
      <div v-for="item of menus" class="item" :key="item.label" @click="handleItemCLick(item.url)">
        <img :src="item.icon" />
        <div class="text">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.menu-box {
  padding: 0 16px;
  .list {
    display: flex;
    justify-content: space-between;
    text-align: center;
    padding: 22px 16px;
    background-color: #edf3fb;
    border-radius: 8px;
    .item {
      width: 20%;
      img {
        width: 40px;
        height: 40px;
        background-color: #fff;
        border-radius: 50%;
        margin-bottom: 12px;
      }
      .text {
        font-size: 12px;
      }
    }
  }
}
</style>
