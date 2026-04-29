import { createRouter, createWebHashHistory } from 'vue-router'
import interceptor from './interceptor'

// import NewHomeView from '@/views/newHome/NewHomeView.vue'
import HomeView from '@/views/home/HomeView.vue'
import Login from '@/views/login/Login.vue'
import Register from '@/views/register/Register.vue'

import Pledge from '@/views/pledge/Pledge.vue'
import MarketsView from '@/views/markets/MarketsView.vue'
import ContractView from '@/views/contract/ContractView.vue'
import PerMarketsView from '@/views/perMarkets/PerMarketsView.vue'
// import NftView from '@/views/nft/NftView.vue'
import AssetsView from '@/views/Assets/AssetsView.vue'
import NotFound from '@/views/notFound/NotFound.vue'
import RechargeIndex from '@/views/Assets/RechargeNew.vue'
import RechargeIndex2 from '@/views/Assets/recharge/indexNew.vue'
import purchaseGold from '@/views/pledge/purchaseGold.vue'

// import { lazyLoadRouter } from './lazyLoadRouter'
import UserInfo from '@/views/userInfo/UserInfo.vue'
import Real from '@/views/userInfo/Real.vue'
import Setting from '@/views/userInfo/Setting.vue'
import PromotionCenter from '@/views/promotionCenter/PromotionCenter.vue'
import Password from '@/views/userInfo/Password.vue'
import LoginPassword from '@/views/userInfo/LoginPassword.vue'
import FundPassword from '@/views/userInfo/FundPassword.vue'
import Security from '@/views/userInfo/Security.vue'
import About from '@/views/userInfo/About.vue'
import PrimaryCertification from '@/views/userInfo/PrimaryCertification.vue'
import HCertification from '@/views/userInfo/HCertification.vue'
import IFramePage from '@/views/IFramePage.vue'
import WhiteBook from '@/views/whiteBook/WhiteBook.vue'
import RechargeCell from '@/views/Assets/RechargeCell.vue'
import RechargeRecords from '@/views/Assets/recharge/records.vue'
import WithdrawCell from '@/views/Assets/WithdrawCell.vue'
import BindCard from '@/views/Assets/BindCard.vue'
import WithdrawView from '@/views/Assets/withdraw/WithdrawView.vue'
import Bank from '@/views/Assets/withdraw/Bank.vue'
import WithdrawRecords from '@/views/Assets/withdraw/records.vue'
import Swap from '@/views/Assets/Swap.vue'
import RecordView from '@/views/record/RecordView.vue'
import News from '@/views/news/News.vue'
import Article from '@/views/news/Article.vue'
import KMarket from '@/views/contract/KMarket.vue'
import Transfer from '@/views/Assets/transfer/index.vue'
import PerMarketRecord from '@/views/perMarkets/PerMarketRecord.vue'
import ContractRecords from '@/views/contract/records.vue'
import ContractRecordView from '@/views/contract/ContractRecordView.vue'
import AiDesc from '@/views/pledge/AiDesc.vue'
import Loan from '@/views/loan/Loan.vue'
import LoanRecord from '@/views/loan/LoanRecord.vue'
import LoanPayment from '@/views/loan/LoanPayment.vue'
// import Perks from '@/views/perks/Perks.vue'
import PledgeRecord from '@/views/pledge/PledgeRecord.vue'
import RegulatoryCertificateBook from '@/views/regulatoryCertificate/RegulatoryCertificateBook.vue'
import LegalNoticeBook from '@/views/legalNotice/LegalNoticeBook.vue'
// import OfficialEndorsementBook from '@/views/officialEndorsement/OfficialEndorsementBook.vue'
// import NftDraw from '@/views/nft/NftDraw.vue'
// import NtfBondage from '@/views/nft/NtfBondage.vue'
// import NtfRecord from '@/views/nft/NtfRecord.vue'
// import Test from '@/views/contract/Test.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DefaultHome',
      component: HomeView,
    },
    // {
    //   path: '/test',
    //   name: 'Test',
    //   component: Test,
    // },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
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
      path: '/pledge',
      name: 'Pledge',
      component: Pledge,
    },
    {
      path: '/markets',
      name: 'MarketsView',
      component: MarketsView,
    },
    {
      path: '/perMarkets',
      name: 'PerMarketsView',
      component: PerMarketsView,
    },
    {
      path: '/newContract',
      name: 'ContractView',
      component: ContractView,
    },
    // {
    //   path: '/nft',
    //   name: 'NftView',
    //   component: NftView,
    //   meta: {
    //     isNeedLogin: true,
    //   },
    // },
    {
      path: '/user-financial',
      name: 'AssetsView',
      component: AssetsView,
      meta: {
        isNeedLogin: true,
      },
    },
    // {
    //   path: '/recharge/index',
    //   name: 'RechargeIndex',
    //   component: RechargeIndex,
    //   meta: {
    //     isNeedLogin: true,
    //   },
    // },

    {
      path: '/recharge/index',
      name: 'RechargeIndex',
      component: RechargeIndex,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/recharge/index2',
      name: 'RechargeIndex2',
      component: RechargeIndex2,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/purchaseGold',
      name: 'PurchaseGold',
      component: purchaseGold,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound,
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
      meta: {
        isNeedLogin: true,
      },
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
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/security',
      name: 'Security',
      component: Security,
    },
    // {
    //   path: '/about',
    //   name: 'About',
    //   component: About,
    // },
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
      path: '/recharge-cell',
      name: 'RechargeCell',
      component: RechargeCell,
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
      component: Bank,
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
      path: '/allrecord',
      name: 'RecordView',
      component: RecordView,
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
      component: KMarket,
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
      path: '/perMarketRecord',
      name: 'PerMarketRecord',
      component: PerMarketRecord,
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
      path: '/contractRecordIndex',
      name: 'ContractRecordView',
      component: ContractRecordView,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/pledge/AiDesc',
      name: 'AiDesc',
      component: AiDesc,
    },
    {
      path: '/loan',
      name: 'Loan',
      component: Loan,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/loan/record',
      name: 'LoanRecord',
      component: LoanRecord,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/loan/loanPayment',
      name: 'LoanPayment',
      component: LoanPayment,
      meta: {
        isNeedLogin: true,
      },
    },
    // {
    //   path: '/perks',
    //   name: 'Perks',
    //   component: Perks,
    // },
    {
      path: '/pledge/pledgeRecord',
      name: 'PledgeRecord',
      component: PledgeRecord,
      meta: {
        isNeedLogin: true,
      },
    },
    {
      path: '/about',
      name: 'regulatoryCertificateBook',
      component: RegulatoryCertificateBook,
    },
    {
      path: '/legal',
      name: 'legalNoticeBook',
      component: LegalNoticeBook,
    },
    // {
    //   path: '/officialEndorsementBook',
    //   name: 'officialEndorsementBook',
    //   component: OfficialEndorsementBook,
    // },
    // {
    //   path: '/nftDraw',
    //   name: 'NftDraw',
    //   component: NftDraw,
    //   meta: {
    //     isNeedLogin: true,
    //   },
    // },
    // {
    //   path: '/ntfBondage',
    //   name: 'NtfBondage',
    //   component: NtfBondage,
    //   meta: {
    //     isNeedLogin: true,
    //   },
    // },
    // {
    //   path: '/ntfRecord',
    //   name: 'NtfRecord',
    //   component: NtfRecord,
    //   meta: {
    //     isNeedLogin: true,
    //   },
    // },
  ],
})

interceptor(router)

export default router
