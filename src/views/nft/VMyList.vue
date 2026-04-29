<template>
  <div class="list-wrapper">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :target="scrollContainerRef">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="$t('h5.common.no_more')"
        class="list-container"
        @load="onLoad"
      >
        <template v-for="(item, index) in currentPageList" :key="item.id">
          <slot :item="item" :index="index" />
        </template>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: 'onRefresh'): void
}>()
const props = withDefaults(
  defineProps<{
    list: []
    pageSize?: number
  }>(),
  {
    pageSize: 10,
  },
)
const scrollContainerRef = ref()
const internalList = ref([]) // 全量列表（父组件提供或初始）
const currentPageList = ref([])
const loading = ref(true)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(0)

watch(
  () => props.list,
  () => {
    internalList.value = props.list
    page.value = 0
    loading.value = false
    finished.value = false
    onLoad()
  },
  {
    immediate: true,
  },
)

// 加载下一页
async function onLoad() {
  loading.value = true
  page.value++

  currentPageList.value = internalList.value.slice(0, page.value * props.pageSize)
  // 判断是否到最后一页
  if (currentPageList.value.length >= props.list.length) {
    finished.value = true
  }

  setTimeout(() => {
    loading.value = false
  })
}

// 下拉刷新
function onRefresh() {
  emits('onRefresh')
  refreshing.value = true
  finished.value = false
  page.value = 0
  currentPageList.value = []
  onLoad().then(() => (refreshing.value = false))
}
</script>

<style lang="less" scoped>
.list-wrapper {
  // height: 400px; /* 由父頁面强行deep修改 */
  overflow-y: auto;
  .list-container {
    position: relative;
    padding-bottom: 100px !important;
    box-sizing: border-box;
    :deep(.van-list__finished-text) {
      position: absolute;
      left: 50%;
      bottom: 55px;
      transform: translateX(-50%);
    }
    :deep(.van-list__loading) {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
