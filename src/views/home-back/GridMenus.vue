<script setup lang="ts">
// import { useUserStore } from '@/stores/user';
// import { useConfigStore } from '@/stores/config';

// import WhitePaperPng from '@/assets/icons/doex_icon_g1.png';
import DepositPng from '@/assets/icons/doex_icon_g2.png'
// import promotionCenterPng from '@/assets/icons/doex_icon_g3.png';
// import ChatPng from '@/assets/icons/doex_icon_g4.png';
// import PerksPng from '@/assets/icons/doex_icon_g5.png';
// import PledgePng from '@/assets/icons/doex_icon_g6.png';
import AboutUsPng from '@/assets/icons/doex_icon_g7.png'
import WithdrawalPng from '@/assets/icons/doex_icon_g8.png'

const router = useRouter()
// const configStore = useConfigStore();
// const userStore = useUserStore();
// const { globalSettingInfo } = storeToRefs(configStore);
// const { userInfo } = storeToRefs(userStore);
const menuList = ref([
  {
    icon: DepositPng,
    label: 'h5.gridmenu.Deposit',
    url: '/recharge/index',
  },
  {
    icon: WithdrawalPng,
    label: 'h5.gridmenu.Withdrawal',
    url: '/withdraw-cell',
  },
  {
    icon: AboutUsPng,
    label: 'h5.gridmenu.Transfer',
    url: '/swap',
  },
  // {
  // 	icon: promotionCenterPng,
  // 	label: 'h5.gridmenu.Promotion_Center',
  // 	url: '/promotionCenter',
  // },
  // {
  // 	icon: ChatPng,
  // 	label: 'h5.gridmenu.Chat',
  // 	url: '/iframePage',
  // 	iframeUrl: '',
  // },
  // {
  // 	icon: PerksPng,
  // 	label: 'h5.gridmenu.Perks',
  // 	url: '/perks',
  // },
  // {
  // 	icon: PledgePng,
  // 	label: 'h5.pledge.top_title2',
  // 	url: '/pledge',
  // },
  // {
  // 	icon: AboutUsPng,
  // 	label: 'h5.gridmenu.About_Us',
  // 	url: '/about',
  // },
  // {
  // 	icon: WhitePaperPng,
  // 	label: 'h5.gridmenu.White_Paper',
  // 	iframeUrl: '',
  // 	url: '/whiteBook',
  // },
])

// onMounted(() => {
// 	userStore.requestUserInfo();
// });

// onActivated(() => {
// 	userStore.requestUserInfo();
// });

watchEffect(() => {
  // menuList.value[3].iframeUrl = globalSettingInfo.value?.onlineCustomer;
  // menuList.value[7].iframeUrl = globalSettingInfo.value?.baipishuUrl;
  // if (userInfo.value && menuList.value[3].iframeUrl) {
  // 	if ((menuList.value[3].iframeUrl as string).includes('?')) {
  // 		menuList.value[3].iframeUrl += `&accountid=${userInfo.value.id}&metadata={"name":"${userInfo.value.id}"}`;
  // 	} else {
  // 		menuList.value[3].iframeUrl += `?accountid=${userInfo.value.id}&metadata={"name":"${userInfo.value.id}"}`;
  // 	}
  // }
})

function handleItemClick(item: any, title: any) {
  router.push({
    path: item.url,
    query: {
      iframeUrl: item.iframeUrl,
      title,
    },
  })
}
</script>

<template>
  <div class="grid-menu-box flex-box-sb">
    <!-- <van-grid :border="false" square>
			<van-grid-item
				v-for="(item, index) in menuList"
				:key="index"
				center
				@click="handleItemClick(item, $t(item.label))">
				<img class="icon" :src="item.icon" />
				<div class="label">
					{{ $t(item.label) }}
				</div>
			</van-grid-item>
		</van-grid> -->
    <div
      v-for="(item, index) in menuList"
      :key="index"
      center
      @click="handleItemClick(item, $t(item.label))"
      class="item flex-box-nm"
    >
      <div class="iten flex-box-nm">
        <img class="icon" :src="item.icon" />
        <div class="label">
          {{ $t(item.label) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.grid-menu-box {
  margin: 15px;
  overflow: hidden;
  align-items: stretch;
  align-content: stretch;
  :deep(.van-grid-item__content) {
    justify-content: flex-start;
  }
}
.item {
  text-align: center;
  width: 110px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  .iten {
    margin: 0 auto;
  }
}
.icon {
  width: 24px;
}
.label {
  margin-left: 6px;
  font-size: 13px;
  text-align: center;
}
</style>
