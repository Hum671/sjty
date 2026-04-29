<script setup lang="ts">
import { useFinacialStore } from '@/stores/finacial'

const router = useRouter()
const { searchValue } = storeToRefs(useFinacialStore())
const isSearChing = ref(false)

function handleSearchFocus() {
  isSearChing.value = true
}

function handleServiceClick() {
  router.push('/service')
}

function handleCancel() {
  isSearChing.value = false
  searchValue.value = ''
}
</script>

<template>
  <div class="fina-box light">
    <div class="nav-bar">
      <van-search
        v-model="searchValue"
        class="search"
        shape="round"
        background="transparent"
        @focus="handleSearchFocus"
        @blur="handleCancel"
        :placeholder="$t('pls_enter_sr_kw')"
      />
      <ServiceIcon
        v-if="!isSearChing"
        color="#666666"
        class="service"
        @click="handleServiceClick"
      />
      <div v-else class="cancle" @click="handleCancel">
        {{ $t('cancle') }}
      </div>
    </div>
    <Menu v-if="!isSearChing" />
    <FinCardList />
  </div>
</template>

<style lang="less" scoped>
.fina-box {
  .nav-bar {
    position: sticky;
    top: 0;
    z-index: 33;
    display: flex;
    align-items: center;
    padding: 20px 8px;
    box-shadow: 0 -3px 5px rgb(32, 31, 31);
    background-color: #000000;
    .van-search {
      padding: 0 10px;
    }
    .service {
      margin: 0 10px 0 3px;
    }
    .search {
      flex: 1;
      &:placeholder {
        color: #999999;
      }
    }
    .cancle {
      margin: 0 10px 0 0;
      font-size: 15px;
      color: #1989fa;
    }
  }
}
.light {
  .nav-bar {
    margin-bottom: 20px;
    background-color: #fff;
  }
}
</style>
