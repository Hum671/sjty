import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { getBalance, getCoinCoinBalance, getTodayPnL } from '@/api/user'
import type { BalanceItem, CoinBalanceItem } from '@/api/user/model/userModel'
import { getUserInfo as getUserInfoApi } from '@/api/userInfo'
import type { IUserInfoRes } from '@/api/userInfo/model/userInfoModel'
import { getToken } from '@/utils/utils'
import { localCache } from '@/utils/cache'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<IUserInfoRes>()
  const userBalance = ref<BalanceItem[]>([])
  const contractBalance = ref<BalanceItem[]>([])
  const financialBalance = ref<BalanceItem[]>([])
  const usdtBalance = ref<number>(0)
  const usdtContractBalance = ref<number>(0)
  const usdtFinancialBalance = ref<number>(0)
  const userCoinBalance = ref<CoinBalanceItem[]>()
  const balanceLoading = ref(false)
  const todayIncome = ref('0.00')
  const todayIncomeYield = ref('0.00')
  const userInfoLoading = ref(false)
  const userAddress = ref()

  function requestUserInfo() {
    if (!getToken()) {
      return
    }

    userInfoLoading.value = true
    getUserInfoApi()
      .then((res) => {
        if (res.code === SUCCESS_CODE) {
          const data = res.data

          // 如果返回的用户信息为测试用户，则把用户名改成Demo
          if (data?.address?.includes('test_') || data?.email?.includes('test_')) {
            data.accounttext = 'Demo'
            userAddress.value = localCache.getCache('userAddress')
          } else {
            userAddress.value = data?.address || data?.email
            data.accounttext = userAddress.value
            localCache.setCache('userAddress', userAddress.value)
          }
          userInfo.value = data
        }
      })
      .finally(() => {
        userInfoLoading.value = false
      })
  }

  function requestUserBalance() {
    if (!getToken()) {
      return
    }
    balanceLoading.value = true
    getBalance()
      .then((res) => {
        if (res.code === SUCCESS_CODE && res.data) {
          userBalance.value = res.data.fund
          contractBalance.value = res.data.contract
          financialBalance.value = res.data.financial

          // 資金賬戶usdt
          const findItem = res.data.fund?.find((item) => item.type === 'usdt')
          usdtBalance.value = Number(findItem?.number || 0)

          // 交易可用usdt
          const findItem1 = res.data.contract?.find((item) => item.type === 'usdt')
          const contractUsdt = Number(findItem1?.number || 0)
          usdtContractBalance.value = Math.floor(contractUsdt)

          // 理財賬戶
          const findItem2 = res.data.financial?.find((item) => item.type === 'usdt')
          usdtFinancialBalance.value = Number(findItem2?.number || 0)
        }
      })
      .finally(() => {
        balanceLoading.value = false
      })

    // 获取今日收益
    getTodayPnL().then((res) => {
      if (res.code === 200) {
        todayIncome.value = res.data.income
        todayIncomeYield.value = res.data.yield
      }
    })
  }

  function requestUserCoinBalance() {
    if (!getToken()) {
      return
    }

    getCoinCoinBalance().then((res) => {
      if (res.code === SUCCESS_CODE) {
        userCoinBalance.value = res.data
      }
    })
  }

  return {
    userInfo,
    userInfoLoading,
    requestUserInfo,

    balanceLoading,
    contractBalance,
    usdtBalance,
    usdtContractBalance,
    userBalance,
    requestUserBalance,
    financialBalance,
    usdtFinancialBalance,

    todayIncome,
    todayIncomeYield,

    userCoinBalance,
    requestUserCoinBalance,
  }
})
