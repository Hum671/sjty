<script setup lang="ts">
import Nav1 from '@/assets/tabbar/nav-1.png'
import Nav1Active from '@/assets/tabbar/nav-1-active.png'
import Nav2 from '@/assets/tabbar/nav-2.png'
import Nav2Active from '@/assets/tabbar/nav-2-active.png'
import Nav3 from '@/assets/tabbar/nav-3.png'
import Nav3Active from '@/assets/tabbar/nav-3-active.png'
// import Nav4 from '@/assets/tabbar/nav-4.png'
// import Nav4Active from '@/assets/tabbar/nav-4-active.png'
import Nav5 from '@/assets/tabbar/nav-5.png'
import Nav5Active from '@/assets/tabbar/nav-5-active.png'
import Nav6 from '@/assets/tabbar/nav-6.png'
import Nav6Active from '@/assets/tabbar/nav-6-active.png'
import { localCache } from '@/utils/cache'
import CONST from '@/const/index'
import { useThemeHook } from '@/hooks/useThemeHook'

const router = useRouter()
const route = useRoute()
const { theme } = useThemeHook()
const tabbarRef = ref()
const showTrade = ref(false)
const active = ref(0)
const baseTab = [
  {
    label: 'h5.tabbar.home',
    url: '/home',
    name: 'Home',
    icon: {
      default: Nav1,
      active: Nav1Active,
    },
  },
  {
    label: 'h5.tabbar.market2',
    url: '/markets',
    name: 'MarketsView',
    icon: {
      default: Nav5,
      active: Nav5Active,
    },
  },
  {
    label: 'h5.tabbar.trade',
    // url: '/trade',
    url: '/newContract?type=KMarket',
    name: 'Trade',
    icon: {
      default: Nav2,
      active: Nav2Active,
    },
  },
  {
    label: 'h5.pledge.top_title2',
    // label: 'h5.pledge.top_title2',
    url: '/pledge',
    name: 'Pledge',
    icon: {
      default: Nav3,
      active: Nav3Active,
    },
  },
  // {
  // 	label: 'h5.tabbar.contract',
  // 	url: '/contract',
  // 	name: 'Contract',
  // 	icon: {
  // 		default: Nav2,
  // 		active: Nav2Active,
  // 	},
  // },

  // {
  // 	label: 'NFT',
  // 	url: '/nft',
  // 	name: 'NftView',
  // 	icon: {
  // 		default: Nav3,
  // 		active: Nav3Active,
  // 	},
  // },
  {
    label: 'h5.tabbar.asset',
    url: '/user-financial',
    name: 'AssetsView',
    icon: {
      default: Nav6,
      active: Nav6Active,
    },
  },
]
const tabs = ref(baseTab)

watch(active, (newVal, oldVal) => {
  if (active.value === 2) {
    localCache.setCache(CONST.CONTRACT_TAB_KEY, 'KMarket')
    // active.value = oldVal
    // showTrade.value = true
    router.push(tabs.value[active.value].url)
    return
  }
  if (active.value > -1) {
    router.push(tabs.value[active.value].url)
  }
})

watch(
  route,
  (val) => {
    if (val.name === 'DefaultHome') {
      active.value = 0
      return
    }
    const index = tabs.value.findIndex((item) => item.name === val.name)
    active.value = index
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  const index = tabs.value.findIndex((item) => item.name === route.name)
  if (active.value !== index && index !== -1) {
    active.value = index
  }
})

// function onMiaoClick() {
//   showTrade.value = false
//   router.push({
//     path: '/newContract',
//     query: {
//       type: 'KMarket',
//     },
//   })
// }
// function onYongClick() {
//   showTrade.value = false
//   router.push({
//     path: '/newContract',
//     query: {
//       type: 'PerMarketsView',
//     },
//   })
// }
// function onSpotClick() {
//   showTrade.value = false
//   router.push({
//     path: '/newContract',
//     query: {
//       type: 'SPerMarketsView',
//     },
//   })
// }
</script>

<template>
  <div class="tabbar-box" ref="tabbarRef">
    <van-tabbar
      v-model="active"
      class="box"
      active-color="#8292dc"
      :inactive-color="theme === 'light' ? '#272727' : '#fff'"
      safe-area-inset-bottom
    >
      <van-tabbar-item v-for="(item, index) of tabs" :key="index">
        <!-- <template v-if="item.url === '/trade'" #icon>
          <img class="tab-icon" :src="item.icon.default" />
        </template> -->
        <template #icon="props">
          <img class="tab-icon" :src="props.active ? item.icon.active : item.icon.default" />
        </template>
        <span class="label" :class="active === index ? 'active' : ''">
          {{ $t(item.label) }}
        </span>
      </van-tabbar-item>
    </van-tabbar>
    <!-- <van-popup
      v-model:show="showTrade"
      :teleport="tabbarRef"
      position="bottom"
      @close="showTrade = false"
    >
      <div class="box-contant">
        <div class="item flex-box-nm" @click="onMiaoClick">
          <img src="@/assets/images/heyue2.png" alt="" />
          {{ $t('h5.gridmenu.Perpetual_Contracts') }}
        </div>
        <div class="item flex-box-nm" @click="onYongClick">
          <img src="@/assets/images/heyue1.png" alt="" />
          {{ $t('h5.yongxu_top_title') }}
        </div>
        <div class="item flex-box-nm" @click="onSpotClick">
          <img src="@/assets/images/heyue1.png" alt="" />
          {{ $t('h5.contract.market.spot.spotname') }}
        </div>
        <div class="close flex-box-ce">
          <van-icon name="cross" class="icon" size="26" @click="showTrade = false" />
        </div>
      </div>
    </van-popup> -->
  </div>
</template>

<style lang="less" scoped>
.tabbar-box {
  --van-popup-background: transparent;
  .box-contant {
    @bh: 160px;
    position: relative;
    height: @bh;
    width: 100%;
    padding-top: 18px;
    box-sizing: border-box;
    margin-bottom: 70px;
    border-radius: 10px;
    background: url(@/assets/images/trade_bg.png);
    background-size: cover;
    background-position: 0 @bh;
    color: var(--cb-fColor);
    .item {
      padding: 10px 18px;
      img {
        margin-right: 8px;
      }
    }
    .close {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      background-color: #14151c;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      .icon {
        color: var(--cb-fColor6);
      }
    }
  }
  .label {
    color: var(--cb-fColor3);
  }
  .active {
    color: #8292dc !important;
  }
}
.box {
  --van-border-color: transparent;
  --van-tabbar-item-active-background: transparent;
  text-align: center;
  height: 60px;
  box-shadow: 0 -8px 8px 0 var(--cb-bgc3);
  background-color: var(--cb-bgc3);

  span {
    font-size: 11px;
    line-height: normal;
  }
  :deep(.van-tabbar-item) {
    .tab-icon {
      height: 22px;
    }
  }
  .van-tabbar-item:nth-child(3) {
    position: relative;
    height: 60px;

    :deep(.van-tabbar-item__icon) {
      position: absolute;
      left: 50%;
      top: -20px;
      transform: translateX(-50%);
      background-color: var(--cb-bgc3);
      padding: 10px;
      border-radius: 50%;
    }
    :deep(.van-tabbar-item__text) {
      margin-top: 24px;
    }
    .tab-icon {
      height: 26px;
    }
  }
}
</style>
