import HomeView from '@/views/home/HomeView.vue'
import WithdrawIndex from '@/views/Assets/withdraw/index.vue'
import RechargeCell from '@/views/Assets/RechargeCell.vue'
import RechargeIndex from '@/views/Assets/recharge/index.vue'
import Coin from '@/views/coin/index.vue'
import CoinRecords from '@/views/coin/records.vue'
import Help from '@/views/userInfo/Help.vue'
import Share from '@/views/userInfo/Share.vue'
import MyOptionEdit from '@/views/markets/MyOptionEdit.vue'
import TradeSearch from '@/views/TradeSearch.vue'
import FinancialView from '@/views/financial/FinancialView.vue'
import FinancialDetail from '@/views/financial/FinancialDetail.vue'
import TradeDetail from '@/views/financial/TradeDetail.vue'
import FinancialAgreement from '@/views/financial/FinancialAgreement.vue'
import Service from '@/views/service/Service.vue'
import TransactionRecord from '@/views/Assets/TransactionRecord.vue'
import Transfer from '@/views/Assets/transfer/index.vue'
import BannerDetail from '@/views/news/BannerDetail.vue'
import PromotionCenter from '@/views/promotionCenter/PromotionCenter.vue'
import UserSetting from '@/views/userInfo/UserSetting.vue'
import NtfCardList from '@/views/nft/NtfCardList.vue'

import { RouteRecordRaw } from 'vue-router'

export const unserRouter: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/withdraw/index',
    name: 'WithdrawIndex',
    component: WithdrawIndex,
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/recharge-cell',
    name: 'RechargeCell',
    component: RechargeCell,
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/recharge/index',
    name: 'RechargeIndex',
    component: RechargeIndex,
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/coin',
    name: 'Coin',
    component: Coin,
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/coin/records',
    name: 'CoinRecords',
    component: CoinRecords,
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/help',
    name: 'Help',
    component: Help,
  },
  {
    path: '/share',
    name: 'Share',
    component: Share,
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/trade-edit',
    name: 'MyOptionEdit',
    component: MyOptionEdit,
  },
  {
    path: '/trade-search',
    name: 'TradeSearch',
    component: TradeSearch,
  },
  {
    path: '/financial',
    name: 'Financial',
    component: FinancialView,
  },
  {
    path: '/financial-detail',
    name: 'FinancialDetail',
    component: FinancialDetail,
  },
  {
    path: '/trade-detail',
    name: 'TradeDetail',
    component: TradeDetail,
  },
  {
    path: '/financial-agreement',
    name: 'FinancialAgreement',
    component: FinancialAgreement,
  },
  {
    path: '/service',
    name: 'Service',
    component: Service,
  },
  {
    path: '/transaction-record',
    name: 'TransactionRecord',
    component: TransactionRecord,
  },
  {
    path: '/transfer',
    name: 'Transfer',
    component: Transfer,
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/bannerDetail',
    name: 'BannerDetail',
    component: BannerDetail,
  },
  {
    path: '/promotionCenter',
    name: 'PromotionCenter',
    component: PromotionCenter,
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/userSetting',
    name: 'UserSetting',
    component: UserSetting,
  },
  {
    path: '/ntfCardList',
    name: 'NtfCardList',
    component: NtfCardList,
  },
]
