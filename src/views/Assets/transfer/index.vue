<script setup lang="ts">
import { ActionSheetAction, showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { transfer } from '@/api/transfer'

import { SUCCESS_CODE } from '@/api/model/BaseModel'
import { formatInputUs, getIconImage, usFormat, parseFormatInputUsNumber } from '@/utils/utils'

const { t } = useI18n()
const userStore = useUserStore()
const { userBalance, contractBalance, financialBalance } = storeToRefs(userStore)

const assetList = ref([])
const number = ref<number | string>(0)
const showSheet = ref(false)
const showFromAssetTypes = ref(false)
const showToAssetTypes = ref(false)
const loading = ref(false)
const actions = ref<ActionSheetAction[]>([])
const fromType = ref<'zichan' | 'jiaoyi' | 'licai'>('zichan')
const fromTypeName = ref('h5.transfer.count_t')
const toType = ref<'zichan' | 'jiaoyi' | 'licai'>('jiaoyi')
const toTypeName = ref('h5.user_info.assets.contract_account')
const assetFromTypes = ref([
  {
    name: t('h5.transfer.count_t'),
    code: 'zichan',
    callback: handleSelectFromAssetType,
  },
  {
    name: t('h5.user_info.assets.contract_account'),
    code: 'jiaoyi',
    callback: handleSelectFromAssetType,
  },
  {
    name: t('h5.financial.title'),
    code: 'licai',
    callback: handleSelectFromAssetType,
  },
])
const assetToTypes = ref([
  {
    name: t('h5.transfer.count_t'),
    code: 'zichan',
    callback: handleSelectToAssetType,
  },
  {
    name: t('h5.user_info.assets.contract_account'),
    code: 'jiaoyi',
    callback: handleSelectToAssetType,
  },
  {
    name: t('h5.financial.title'),
    code: 'licai',
    callback: handleSelectToAssetType,
  },
])
const coin = ref('USDT')
const selectType = ref(1) // 1-钱包转交易 2-交易转钱包
const typeMapNum = new Map([
  // 映射交易类型
  ['zichanjiaoyi', 1], // 资产到交易
  ['zichanlicai', 3], //资产到理财

  ['jiaoyilicai', 4], //交易到理财
  ['jiaoyizichan', 2], //交易到资产

  ['licaizichan', 5], //理财到资产
  ['licaijiaoyi', 6], //理财到交易
])

watch(number, () => {
  const split = String(number.value).split('.')
  if ((split[1] && split[1].length > 8) || Number(number.value) > Number(balance.value)) {
    number.value = balance.value
  }
})

watch(userBalance, (val) => {
  if (!val) {
    return
  }
  assetList.value = val
})

// 1-资产到合约 2-合约到资产
const balance = computed(() => {
  if (fromType.value === 'zichan' && userBalance.value.length > 0) {
    const find = userBalance.value.find((item) => item.type === coin.value.toLocaleLowerCase())
    if (find) {
      return find.number
    }
  }

  if (fromType.value === 'jiaoyi' && contractBalance.value.length > 0) {
    const find = contractBalance.value.find((item) => item.type === coin.value.toLocaleLowerCase())
    if (find) {
      return find.number
    }
  }

  if (fromType.value === 'licai' && financialBalance.value.length > 0) {
    const find = financialBalance.value.find((item) => item.type === coin.value.toLocaleLowerCase())
    if (find) {
      return find.number
    }
  }

  return 0
})

onMounted(() => {
  userStore.requestUserBalance()
})

function onAll() {
  number.value = Number(balance.value)
}

function changeCurrency() {
  const list: ActionSheetAction[] = []

  assetList.value.forEach((item) => {
    list.push({
      name: item.type.toUpperCase(),
      icon: getIconImage(item.type.toUpperCase()),
      callback: handleSelect,
    })
  })

  actions.value = list
  showSheet.value = true
}

function handleSelect(action) {
  coin.value = action.name
  number.value = 0
}

function handleSelectFromAssetType(action) {
  // 保存当前信息
  const currentInfo = {
    code: fromType.value,
    name: fromTypeName.value,
  }

  // 赋予最新选中值
  fromType.value = action.code
  fromTypeName.value = action.name

  if (fromType.value === toType.value) {
    // 最新值和转换的值相同时，交换
    toType.value = currentInfo.code
    toTypeName.value = currentInfo.name
  }

  // 重置数量
  number.value = 0
}

function handleSelectToAssetType(action) {
  // 保存当前信息
  const currentInfo = {
    code: toType.value,
    name: toTypeName.value,
  }

  // 赋予最新选中值
  toType.value = action.code
  toTypeName.value = action.name

  if (toType.value === fromType.value) {
    // 最新值和转换的值相同时，交换
    fromType.value = currentInfo.code
    fromTypeName.value = currentInfo.name
  }

  // 重置数量
  number.value = 0
}

function submitVerify() {
  if (number.value === 0) {
    showToast(t('h5.transfer.value_null_warn'))
    return false
  }

  if (balance.value < Number(number.value)) {
    showToast(t('h5.withdraw.balance_insufficient'))
    return false
  }
  return true
}

function handleSubmit() {
  if (!submitVerify()) {
    return
  }

  loading.value = true
  transfer({
    type: typeMapNum.get(`${fromType.value}${toType.value}`),
    coinType: coin.value.toLocaleLowerCase(),
    number: number.value as number,
  })
    .then((res) => {
      if (res.code === SUCCESS_CODE) {
        showToast(t('h5.transfer.change_succes'))
        number.value = 0
        userStore.requestUserBalance()
      } else {
        showToast(t(res.msg))
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function handleBulr() {
  if (number.value === '') {
    number.value = 0
  }
}

function handleFocus() {
  if (Number(number.value) <= 0) {
    number.value = ''
  }
}

function onInput(e) {
  const val = e.target.value
  // 去掉千分符，保持原始值
  number.value = parseFormatInputUsNumber(val)
}
</script>

<template>
  <div class="light">
    <Navbar2
      :title="$t('h5.user_info.assets.transfer')"
      :is-show-right="false"
      back-path="/user-financial"
    />

    <div class="conte">
      <div class="item flex-box-sb">
        <div class="label">{{ $t('h5.user_info.assets.from') }}</div>
        <div class="input-box" @click="showFromAssetTypes = true">
          <div class="value">
            {{ $t(fromTypeName) }}
            <span class="u-icon__icon uicon-arrow-down u-iconfont"></span>
          </div>
        </div>
      </div>

      <div class="line">
        <img src="@/assets/images/transfer-logo.svg" alt="" />
      </div>

      <div class="item flex-box-sb">
        <div class="label">{{ $t('h5.user_info.assets.to') }}</div>
        <div class="input-box" @click="showToAssetTypes = true">
          <div class="value">
            <div class="value">
              {{ $t(toTypeName) }}
              <span class="u-icon__icon uicon-arrow-down u-iconfont"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="input-info">
        <div class="info-left">{{ $t('h5.user_info.assets.select_coin') }}</div>
      </div>
      <div class="item coinbox flex-box-sb">
        <div class="input-box flex-box-sb" @click="changeCurrency">
          <div class="value">
            <img :src="getIconImage(coin)" alt="" />
            <span>
              {{ coin }}
            </span>
          </div>
          <span class="u-icon__icon uicon-arrow-down u-iconfont"></span>
        </div>
      </div>

      <div class="input-info">
        <div class="info-left">{{ $t('h5.user_info.assets.transfer_number') }}({{ coin }})</div>
      </div>
      <div class="input-container">
        <input
          :value="formatInputUs(number)"
          @focus="handleFocus"
          @blur="handleBulr"
          @input="onInput"
        />
        <div class="unit" @click="onAll">{{ $t('h5.common.all') }}</div>
      </div>

      <div class="available">
        <span>{{ $t('h5.swap.available') }}:</span>
        <span class="balance">{{ `${usFormat(balance)} ${coin}` }}</span>
      </div>
    </div>

    <van-button :loading="loading" class="btn-submit" size="large" @click="handleSubmit">
      {{ $t('h5.user_info.assets.transfer') }}
    </van-button>

    <van-action-sheet
      v-model:show="showSheet"
      :actions="actions"
      :cancel-text="$t('h5.common.cancel')"
      close-on-click-action
      safe-area-inset-bottom
      :description="$t('h5.swap.promat')"
    />

    <van-action-sheet
      v-model:show="showFromAssetTypes"
      :actions="assetFromTypes.filter((item) => item.code !== fromType)"
      :cancel-text="$t('h5.common.cancel')"
      close-on-click-action
    />
    <van-action-sheet
      v-model:show="showToAssetTypes"
      :actions="assetToTypes.filter((item) => item.code !== toType)"
      :cancel-text="$t('h5.common.cancel')"
      close-on-click-action
    />
  </div>
</template>

<style lang="less" scoped>
.light {
  --van-active-color: transparent;

  :deep(.van-icon__image) {
    border-radius: 50%;
  }
  .conte {
    padding: 15px;
    .item {
      box-sizing: border-box;
      padding: 16px 20px;
      width: 100%;
      background-color: var(--cb-bgc4);
      border-radius: 5px;
      border: 1px solid var(--cb-borderColor2);
      .label {
        color: var(--cb-fColor6);
      }
    }
    .line {
      margin: 40px 0;
      position: relative;
      border-bottom: 1px dashed var(--cb-borderColor2);
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .coinbox {
      height: 50px;
      .input-box {
        width: 100%;
      }
    }
    .input-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 0 10px;
      .info-left {
        color: #919fac;
      }
      .info-right {
        color: var(--cb-fColor2);
      }
    }
    .input-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--cb-bgc4);
      border-radius: 5px;
      border: 1px solid var(--cb-borderColor2);
      box-sizing: border-box;
      input {
        width: 250px;
        font-size: 16px;
        color: var(--cb-fColor);
        padding: 15px 20px;
        box-sizing: border-box;
      }
      .unit {
        flex: 1;
        padding-right: 20px;
        font-size: 14px;
        text-align: right;
        color: var(--cb-fColor2);
      }
    }
    .input-box {
      display: flex;
      align-items: center;
      gap: 3px;
      input {
        flex: 1;
      }
      .big {
        border-right: 1px solid red;
        padding: 0 10px;
        color: var(--cb-fColor2);
      }
      .currency {
        display: flex;
        align-items: flex-end;
        gap: 5px;
        margin-left: 10px;
      }
      .value {
        display: flex;
        align-items: center;
        gap: 15px;
        span {
          font-size: 15px;
        }
      }
      img {
        @size: 30px;
        width: @size;
        height: @size;
        border-radius: 50%;
      }
    }
    .available {
      display: flex;
      align-items: center;
      padding: 30px 0;
      color: #919fac;
      .balance {
        margin-left: 5px;
        color: var(--cb-fColor2);
      }
    }
    input {
      appearance: none; /* 移除默认样式 */
      border: none; /* 移除边框 */
      outline: none; /* 移除轮廓 */
      background: none; /* 移除背景 */
    }

    input::placeholder {
      color: var(--cb-fColor5);
    }
  }
  .btn-submit {
    margin-top: 20px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;
    width: calc(100vw - 30px);
    border: none;
    background-color: var(--cb-btnBgc);
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 22px;
    color: #fff;
  }
}
</style>
