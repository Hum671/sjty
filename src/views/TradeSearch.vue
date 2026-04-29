<script setup lang="ts">
import { useCurrencyStore } from '@/stores/currency'
import { sessionCache } from '@/utils/cache'
import { getIconImage } from '@/utils/utils'
import CONST from '@/const/index'

const currencyStore = useCurrencyStore()
const router = useRouter()
const searchValue = ref('')
const { currencyList } = storeToRefs(currencyStore)

function handleLeftClick() {
  history.back()
}

function handleItemClick(data) {
  sessionCache.setCache(CONST.CONTRACTKEY, data)
  router.replace({
    path: '/contract',
  })
}
</script>

<template>
  <div class="search-box">
    <div class="nav-bar flex-box-nm">
      <div class="left flex-box-sb" @click="handleLeftClick">
        <ArrowBack class="icon" />
      </div>
      <van-search
        v-model="searchValue"
        shape="round"
        class="search"
        :placeholder="$t('h5.trade-search.Search_for_the_currency_you_are_interested_in')"
      />
    </div>
    <div class="content">
      <template v-for="item of currencyList?.list ?? []">
        <div
          v-if="searchValue === '' || item.name.includes(searchValue.toUpperCase())"
          :key="item.id"
        >
          <div class="item flex-box-nm" @click="handleItemClick(item)">
            <img :src="getIconImage(item.name)" alt="" />
            {{ item.name }}
          </div>
          <van-divider />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
@nav-bar-h: 56px;
.record {
  font-size: 18px;
}
.nav-bar {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 2;
  height: @nav-bar-h;
  line-height: @nav-bar-h;
  padding: 0 16px;
  background-color: #ffffff;
  box-shadow: 0 -3px 5px rgb(32, 31, 31);
  .icon {
    width: 18px;
  }
  .search {
    width: 337px;
  }
}
.content {
  padding: 76px 20px;
  font-size: 16px;
  .item {
    img {
      width: 30px;
      margin-right: 10px;
    }
  }
}
</style>
