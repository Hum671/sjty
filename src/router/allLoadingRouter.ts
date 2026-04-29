import { createRouter, createWebHashHistory } from 'vue-router'
import interceptor from './interceptor'

import NewHomeView from '@/views/newHome/NewHomeView.vue'
import Login from '@/views/login/Login.vue'
import Register from '@/views/register/Register.vue'
import UserInfo from '@/views/userInfo/UserInfo.vue'
import Real from '@/views/userInfo/Real.vue'
import Setting from '@/views/userInfo/Setting.vue'
import Password from '@/views/userInfo/Password.vue'
import LoginPassword from '@/views/userInfo/LoginPassword.vue'
import FundPassword from '@/views/userInfo/FundPassword.vue'
import Security from '@/views/userInfo/Security.vue'
import About from '@/views/userInfo/About.vue'
import PrimaryCertification from '@/views/userInfo/PrimaryCertification.vue'
import HCertification from '@/views/userInfo/HCertification.vue'
import UserSetting from '@/views/userInfo/UserSetting.vue'
import MarketsView from '@/views/markets/MarketsView.vue'
import IFramePage from '@/views/IFramePage.vue'
import WhiteBook from '@/views/regulatoryCertificateBook/WhiteBook.vue'
import PurchaseGold from '@/views/pledge/purchaseGold.vue'
import AssetsView from '@/views/Assets/AssetsView.vue'
import RechargeNew from '@/views/Assets/RechargeNew.vue'
import RechargeIndexNew from '@/views/Assets/recharge/indexNew.vue'
import RechargeRecords from '@/views/Assets/recharge/records.vue'
import WithdrawCell from '@/views/Assets/WithdrawCell.vue'
import BindCard from '@/views/Assets/BindCard.vue'
import WithdrawView from '@/views/Assets/withdraw/WithdrawView.vue'
import WithdrawBank from '@/views/Assets/withdraw/Bank.vue'
import WithdrawRecords from '@/views/Assets/withdraw/records.vue'
import Swap from '@/views/Assets/Swap.vue'
import News from '@/views/news/News.vue'
import Article from '@/views/news/Article.vue'
import Contract from '@/views/contract/KMarket.vue'
import ContractRecords from '@/views/contract/records.vue'
import Pledge from '@/views/pledge/Pledge.vue'
import PledgeRecord from '@/views/pledge/PledgeRecord.vue'
import KMarket from '@/views/contract/KMarket.vue'
import Perks from '@/views/perks/Perks.vue'
import NftView from '@/views/nft/NftView.vue'
import NftDraw from '@/views/nft/NftDraw.vue'
import NtfCardList from '@/views/nft/NtfCardList.vue'
import NtfBondage from '@/views/nft/NtfBondage.vue'
import NtfRecord from '@/views/nft/NtfRecord.vue'

import NotFound from '@/views/notFound/NotFound.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DefaultHome',
      component: NewHomeView,
    },
    {
      path: '/home',
      name: 'Home',
      component: NewHomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      component: UserInfo,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/real',
      name: 'Real',
      component: Real,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
    },
    {
      path: '/password',
      name: 'Password',
      component: Password,
    },
    {
      path: '/loginPassword',
      name: 'LoginPassword',
      component: LoginPassword,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/fundPassword',
      name: 'FundPassword',
      component: FundPassword,
    },
    {
      path: '/security',
      name: 'Security',
      component: Security,
      meta: {
        isNeedLogin: true,
      },
    },

    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/primary-certification',
      name: 'PrimaryCertification',
      component: PrimaryCertification,
    },
    {
      path: '/h-certification',
      name: 'HCertification',
      component: HCertification,
    },
    {
      path: '/userSetting',
      name: 'UserSetting',
      component: UserSetting,
    },
    {
      path: '/markets',
      name: 'MarketsView',
      component: MarketsView,
    },

    {
      path: '/iframePage',
      name: 'IFramePage',
      component: IFramePage,
    },
    {
      path: '/whiteBook',
      name: 'WhiteBook',
      component: WhiteBook,
    },
    {
      path: '/purchaseGold',
      name: 'PurchaseGold',
      component: PurchaseGold,
      meta: {
        isNeedLogin: true,
      },
    },

    {
      path: '/user-financial',
      name: 'AssetsView',
      component: AssetsView,
      meta: {
        isNeedLogin: true,
      },
    },

    {
      path: '/recharge-cell',
      name: 'RechargeCell',
      component: RechargeNew,
      meta: {
        isNeedLogin: true,
      },
    },

    {
      path: '/recharge/index',
      name: 'RechargeIndex',
      component: RechargeIndexNew,
      meta: {
        isNeedLogin: true,
      },
    },

    {
      path: '/recharge/records',
      name: 'RechargeRecords',
      component: RechargeRecords,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/withdraw-cell',
      name: 'WithdrawCell',
      component: WithdrawCell,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/bindCard',
      name: 'BindCard',
      component: BindCard,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/withdraw/index',
      name: 'WithdrawView',
      component: WithdrawView,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/withdraw/bank',
      name: 'WithdrawBank',
      component: WithdrawBank,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/withdraw/records',
      name: 'WithdrawRecords',
      component: WithdrawRecords,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/swap',
      name: 'Swap',
      component: Swap,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/news',
      name: 'News',
      component: News,
    },
    {
      path: '/article',
      name: 'Article',
      component: Article,
    },
    {
      path: '/contract',
      name: 'Contract',
      component: Contract,
    },
    {
      path: '/pledge',
      name: 'Pledge',
      component: Pledge,
    },
    {
      path: '/pledge/pledgeRecord',
      name: 'PledgeRecord',
      component: PledgeRecord,
      meta: {
        isNeedLogin: true,
      },
    },

    {
      path: '/contract/records',
      name: 'ContractRecords',
      component: ContractRecords,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/kMarket',
      name: 'KMarket',
      component: KMarket,
    },
    {
      path: '/perks',
      name: 'Perks',
      component: Perks,
    },
    {
      path: '/nftDraw',
      name: 'NftDraw',
      component: NftDraw,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/nft',
      name: 'NftView',
      component: NftView,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/ntfCardList',
      name: 'NtfCardList',
      component: NtfCardList,
    },
    {
      path: '/ntfBondage',
      name: 'NtfBondage',
      component: NtfBondage,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/ntfRecord',
      name: 'NtfRecord',
      component: NtfRecord,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

interceptor(router)

export default router
