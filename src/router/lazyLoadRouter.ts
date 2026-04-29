import type { RouteRecordRaw } from 'vue-router'

export const lazyLoadRouter: RouteRecordRaw[] = [
  {
    path: '/userInfo',
    name: 'UserInfo',
    component: () => import(/* webpackChunkName: "userInfo" */ '@/views/userInfo/UserInfo.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/real',
    name: 'Real',
    component: () => import(/* webpackChunkName: "real" */ '@/views/userInfo/Real.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import(/* webpackChunkName: "setting" */ '@/views/userInfo/Setting.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/promotionCenter',
    name: 'PromotionCenter',
    component: () =>
      import(
        /* webpackChunkName: "promotionCenter" */ '@/views/promotionCenter/PromotionCenter.vue'
      ),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/password',
    name: 'Password',
    component: () => import(/* webpackChunkName: "password" */ '@/views/userInfo/Password.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/loginPassword',
    name: 'LoginPassword',
    component: () =>
      import(/* webpackChunkName: "loginPassword" */ '@/views/userInfo/LoginPassword.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/fundPassword',
    name: 'FundPassword',
    component: () =>
      import(/* webpackChunkName: "fundPassword" */ '@/views/userInfo/FundPassword.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/security',
    name: 'Security',
    component: () => import(/* webpackChunkName: "security" */ '@/views/userInfo/Security.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/views/userInfo/About.vue'),
  },
  {
    path: '/primary-certification',
    name: 'PrimaryCertification',
    component: () =>
      import(
        /* webpackChunkName: "primary-certification" */ '@/views/userInfo/PrimaryCertification.vue'
      ),
  },
  {
    path: '/h-certification',
    name: 'HCertification',
    component: () =>
      import(/* webpackChunkName: "h-certification" */ '@/views/userInfo/HCertification.vue'),
  },

  {
    path: '/iframePage',
    name: 'IFramePage',
    component: () => import(/* webpackChunkName: "iframePage" */ '@/views/IFramePage.vue'),
  },
  {
    path: '/whiteBook',
    name: 'WhiteBook',
    component: () =>
      import(/* webpackChunkName: "whiteBook" */ '@/views/regulatoryCertificateBook/WhiteBook.vue'),
  },
  {
    path: '/recharge-cell',
    name: 'RechargeCell',
    component: () =>
      import(/* webpackChunkName: "rechargeCell" */ '@/views/Assets/RechargeCell.vue'),
    // component: () =>
    //   import(/* webpackChunkName: "rechargeCell" */ '@/views/Assets/RechargeNew.vue'),
    meta: {
      isNeedLogin: true,
    },
  },

  {
    path: '/recharge/records',
    name: 'RechargeRecords',
    component: () =>
      import(/* webpackChunkName: "rechargeRecords" */ '@/views/Assets/recharge/records.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/withdraw-cell',
    name: 'WithdrawCell',
    component: () =>
      import(/* webpackChunkName: "withdrawCell" */ '@/views/Assets/WithdrawCell.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/bindCard',
    name: 'BindCard',
    component: () => import(/* webpackChunkName: "bindCard" */ '@/views/Assets/BindCard.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/withdraw/index',
    name: 'WithdrawView',
    component: () =>
      import(/* webpackChunkName: "withdrawView" */ '@/views/Assets/withdraw/WithdrawView.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/withdraw/bank',
    name: 'WithdrawBank',
    component: () =>
      import(/* webpackChunkName: "withdrawBank" */ '@/views/Assets/withdraw/Bank.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/withdraw/records',
    name: 'WithdrawRecords',
    component: () =>
      import(/* webpackChunkName: "withdrawRecords" */ '@/views/Assets/withdraw/records.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/swap',
    name: 'Swap',
    component: () => import(/* webpackChunkName: "swap" */ '@/views/Assets/Swap.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/allrecord',
    name: 'RecordView',
    component: () => import(/* webpackChunkName: "recordView" */ '@/views/record/RecordView.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/news',
    name: 'News',
    component: () => import(/* webpackChunkName: "news" */ '@/views/news/News.vue'),
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import(/* webpackChunkName: "article" */ '@/views/news/Article.vue'),
  },
  {
    path: '/contract',
    name: 'Contract',
    component: () => import(/* webpackChunkName: "contract" */ '@/views/contract/KMarket.vue'),
  },
  {
    path: '/transfer',
    name: 'Transfer',
    component: () => import(/* webpackChunkName: "transfer" */ '@/views/Assets/transfer/index.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/perMarketRecord',
    name: 'PerMarketRecord',
    component: () =>
      import(/* webpackChunkName: "perMarketRecord" */ '@/views/perMarkets/PerMarketRecord.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  // {
  // 	path: '/kMarket',
  // 	name: 'KMarket',
  // 	component: () => import(/* webpackChunkName: "kMarket" */ '@/views/contract/KMarket.vue'),
  // },
  {
    path: '/contract/records',
    name: 'ContractRecords',
    component: () =>
      import(/* webpackChunkName: "contractRecords" */ '@/views/contract/records.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/contractRecordIndex',
    name: 'ContractRecordView',
    component: () =>
      import(
        /* webpackChunkName: "contractRecordIndex" */ '@/views/contract/ContractRecordView.vue'
      ),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/pledge/AiDesc',
    name: 'AiDesc',
    component: () => import(/* webpackChunkName: "aiDesc" */ '@/views/pledge/AiDesc.vue'),
  },
  {
    path: '/perks',
    name: 'Perks',
    component: () => import(/* webpackChunkName: "perks" */ '@/views/perks/Perks.vue'),
  },
  {
    path: '/pledge/pledgeRecord',
    name: 'PledgeRecord',
    component: () =>
      import(/* webpackChunkName: "pledgeRecord" */ '@/views/pledge/PledgeRecord.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/nftDraw',
    name: 'NftDraw',
    component: () => import(/* webpackChunkName: "nftDraw" */ '@/views/nft/NftDraw.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/ntfBondage',
    name: 'NtfBondage',
    component: () => import(/* webpackChunkName: "ntfBondage" */ '@/views/nft/NtfBondage.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
  {
    path: '/ntfRecord',
    name: 'NtfRecord',
    component: () => import(/* webpackChunkName: "ntfRecord" */ '@/views/nft/NtfRecord.vue'),
    meta: {
      isNeedLogin: true,
    },
  },
]
