<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: any
    backPath?: string
    isShowArrowBack?: boolean
    isShowRight?: boolean
    isShowRecords?: boolean
  }>(),
  {
    isShowArrowBack: true,
    isShowRight: true,
    isShowRecords: false,
  },
)

const emit = defineEmits<{
  (e: 'onRecord'): void
  (e: 'onNotice'): void
}>()

const router = useRouter()

function handleLeftClick() {
  if (props.isShowArrowBack) {
    if (props.backPath) {
      router.replace(props.backPath)
    } else {
      router.back()
    }
  }
}

function handleServiceClick() {
  router.push('/service')
}

function handleRecord() {
  emit('onRecord')
}
</script>

<template>
  <div class="h">
    <div class="nav-bar flex-box-sb">
      <div class="left flex-box-sb" @click="handleLeftClick">
        <ArrowBack v-if="isShowArrowBack" class="icon" />
        <img v-else class="logo" src="~@/assets/images/logo.jpg" />
        <div class="text">{{ title }}</div>
      </div>
      <ServiceIcon v-if="isShowRight" color="#666666" @click="handleServiceClick" />
      <div v-if="isShowRecords" class="record" @click="handleRecord">
        <span class="u-icon__icon uicon-order u-iconfont"></span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@nav-bar-h: 50px;
.h {
  height: @nav-bar-h;
}
.record {
  font-size: 20px;
  .u-iconfont {
    color: var(--cb-fColor2);
  }
}
.notice {
  width: 20px;
}
.nav-bar {
  box-sizing: border-box;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 5;
  height: @nav-bar-h;
  line-height: @nav-bar-h;
  padding: 0 16px;
  background-color: var(--cb-bgc4);
  box-shadow: 0 -3px 5px rgb(32, 31, 31);
  color: var(--cb-fColor);
  .left {
    .icon {
      width: 20px;
      margin-right: 10px;
    }
    .logo {
      width: 30px;
      margin-right: 10px;
    }
    .text {
      font-size: 16px;
    }
  }
}
</style>
