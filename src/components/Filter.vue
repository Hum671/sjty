<script setup lang="ts">
defineProps<{
  isShowSort?: boolean
  filterTabs: Array<{ title: string; code: string }>
}>()

const sortCode = ref('')
const currentActiveIndex = ref(0)

function handleItemClick(item: any, index: number) {
  if (currentActiveIndex.value !== index) {
    currentActiveIndex.value = index
    sortCode.value = ''
  }

  // 赋值
  if (sortCode.value) {
    sortCode.value = sortCode.value === 'down' ? '' : 'down'
  } else {
    sortCode.value = 'up'
  }
}
</script>

<template>
  <div>
    <div class="sort-bar">
      <div
        v-for="(item, index) of filterTabs"
        :key="index"
        class="box"
        @click="handleItemClick(item, index)"
      >
        <div class="label">{{ $t(item.title) }}</div>
        <div v-if="isShowSort" class="icon">
          <div
            class="icon-up"
            :class="currentActiveIndex === index && sortCode === 'up' && 'active-up-icon'"
          ></div>
          <div
            class="icon-down"
            :class="currentActiveIndex === index && sortCode === 'down' && 'active-down-icon'"
          ></div>
        </div>
      </div>
    </div>
    <div class="list">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.sort-bar {
  display: flex;
  justify-content: space-between;
  padding: 10px 0 5px;
  .label {
    font-size: 11px;
  }
  .icon {
    margin-left: 4px;
  }
  .box {
    display: flex;
    align-items: center;
    .icon-up {
      width: 0;
      border: 4px solid transparent;
      border-bottom-color: #b3bbc1;
      margin-bottom: 2px;
    }
    .icon-down {
      width: 0;
      border: 4px solid transparent;
      border-top-color: #b3bbc1;
    }
    .active-up-icon {
      border-bottom-color: #0052ff;
    }
    .active-down-icon {
      border-top-color: #0052ff;
    }
  }
}
</style>
