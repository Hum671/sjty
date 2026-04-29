<script setup lang="ts">
const router = useRouter()
const list = [
  {
    icon: 'icon-twitter.svg',
    url: '/',
  },
  {
    icon: 'icon-telegram.svg',
    url: '/',
  },
  {
    icon: 'icon-instagram.svg',
    url: '/',
  },
  {
    icon: 'icon-facebook.svg',
    url: '/',
  },
  {
    icon: 'icon-youtube.svg',
    url: '/',
  },
  {
    icon: 'icon-medium.svg',
    url: '/',
  },
  {
    icon: 'icon-tiktok.svg',
    url: '/',
  },
  {
    icon: 'icon-coinmarketcap.png',
    url: '/',
  },
  {
    icon: 'icon-coingecko.svg',
    url: '/',
  },
  {
    icon: 'icon-discord.svg',
    url: '/',
  },
]
function requireIcon(iconName: string) {
  try {
    return new URL(`/src/assets/svg/${iconName}`, import.meta.url).href
  } catch (error) {
    console.warn(error)
  }
}

function handleItemClick(item) {
  router.push(item.url)
}
</script>

<template>
  <div class="join-wrap">
    <div class="icons">
      <img
        v-for="(item, index) of list"
        class="pointer"
        :key="index"
        :src="requireIcon(item.icon)"
        alt=""
        @click="handleItemClick(item)"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.join-wrap {
  padding: 70px 0 10px;
  .t1 {
    font-size: 14px;
    margin-bottom: 14px;
  }
  .t2 {
    font-size: 12px;
    margin-bottom: 14px;
  }
  .icons {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    img {
      width: 40px;
    }
  }
}
</style>
