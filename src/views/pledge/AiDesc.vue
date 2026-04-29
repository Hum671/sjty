<script setup lang="ts">
import facebook from '@/assets/images/facebook.png'
import twitter from '@/assets/images/twitter.png'
import instagram from '@/assets/images/instagram.png'
import linkedin from '@/assets/images/linkedin.png'
import youtube from '@/assets/images/youtube.png'

const route = useRoute()
const links = [
  {
    image: facebook,
    path: 'https://www.facebook.com/',
  },
  {
    image: twitter,
    path: 'https://www.twitter.com/',
  },
  {
    image: instagram,
    path: 'https://www.instagram.com/',
  },
  {
    image: linkedin,
    path: 'https://www.linkedin.com/',
  },
  {
    image: youtube,
    path: 'https://www.youtube.com/',
  },
]
</script>

<template>
  <div class="aidesc">
    <Navbar2
      class="navbar"
      :title="$t(route.query.title)"
      :is-show-right="false"
      back-path="/pledge"
    />
    <div class="content">
      <h1>{{ $t('h5.purchaseGold.AiDesc.t1') }}</h1>
      <h2>{{ $t('h5.purchaseGold.AiDesc.t2') }}</h2>
      <DescCard v-for="item of 6" :value="item" :key="item" />
      <div class="bq">© 2023 Derivmark. {{ $t('h5.common.banquan') }}</div>
      <div class="line"></div>
      <div class="link-box flex-box-sa">
        <div>
          <a v-for="item in links" :key="item.path" :href="item.path" target="_blank" class="item">
            <img :src="item.image" alt="" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.aidesc {
  padding-top: 20px;
  :deep(.navbar) {
    .left {
      justify-content: flex-start;
    }
    .text {
      overflow-x: scroll;
      white-space: nowrap;
    }
  }
  .content {
    padding: 0 16px 40px 16px;
    h1,
    h2 {
      text-align: center;
      font-weight: normal;
      margin-bottom: 30px;
    }
    h1 {
      color: var(--cb-fColor2);
      margin-bottom: 20px;
    }
    .line {
      border-top: 0.1px solid rgba(48, 48, 48, 0.3);
      margin: 20px 0;
    }
    .bq {
      margin-top: 40px;
      text-align: center;
    }
    .link-box {
      .item {
        margin: 0 8px;
        img {
          width: 40px;
        }
      }
    }
  }
}
</style>
