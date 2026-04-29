<script setup lang="ts">
const emit = defineEmits<{
  (e: 'onChange', sliderNumber: number): void
}>()

const min = 0
const max = 100

const props = defineProps({
  nodeCount: {
    type: Number,
    default: 5,
  },
  defaultDot: {
    type: Number,
    default: 0,
  },
})

const sliderValue = ref(min)

const step = computed(() => {
  return (max - min) / (props.nodeCount - 1)
})
const dots = computed(() => {
  const nodes = []
  const interval = (max - min) / (props.nodeCount - 1)

  for (let i = 0; i < props.nodeCount; i++) {
    const nodeValue = Math.round(min + interval * i)
    nodes.push(nodeValue)
  }
  return nodes
})
const sliderStyle = computed(() => {
  const percent = ((sliderValue.value - min) / (max - min)) * 100
  return {
    background: `linear-gradient(to right, #1989fa ${percent}%, #fff ${percent}%)`,
  }
})

onMounted(() => {
  nextTick(() => {
    if (props.defaultDot) {
      sliderValue.value = props.defaultDot
    }
  })
})

function onSliderChange() {
  sliderValue.value = Math.round(sliderValue.value / step.value) * step.value
}

function onDotClick(dotValue: number) {
  sliderValue.value = dotValue
  emit('onChange', sliderValue.value)
}

function getDotWrapperStyle(dotValue: number) {
  const position = dotValue === max ? 100 : ((dotValue - min) / (max - min)) * 100
  return {
    left: `${position}%`,
  }
}

function reset() {
  sliderValue.value = props.defaultDot
}

defineExpose<{
  reset: (num: number) => void
}>({
  reset,
})
</script>

<template>
  <div class="slider-container">
    <div class="slider-track">
      <div
        v-for="(dot, index) in dots"
        :key="index"
        class="slider-dot-wrapper"
        :class="{ active: dot === sliderValue, past: dot < sliderValue }"
        :style="getDotWrapperStyle(dot)"
        @click="onDotClick(dot)"
      >
        <div class="slider-dot"></div>
        <div class="value">{{ dot }}%</div>
      </div>
    </div>
    <input
      type="range"
      v-model="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      @input="onSliderChange"
      class="slider"
      :style="sliderStyle"
    />
  </div>
</template>

<style lang="less" scoped>
.slider-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 15px auto;
  text-align: center;
  box-sizing: border-box;
}

.slider-track {
  position: relative;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  width: 100%;
  display: flex;
  align-items: center;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: transparent;
  border: none;
  z-index: 2;
  appearance: none;
  transition: background 0.2s ease;
  border-radius: 3px;
}

.slider::-webkit-slider-thumb {
  display: none;
}

.slider-dot-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 3;
  box-sizing: border-box;
  &:nth-child(1) {
    .value {
      margin-left: 4px;
    }
  }
  &:nth-child(5) {
    .value {
      padding-right: 15px;
    }
  }
  .value {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
  }
}

.slider-dot {
  position: relative;
  width: 5px;
  height: 5px;
  background-color: #b8d8f2;
  border-radius: 50%;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease,
    border-color 0.3s ease;
  border: 2px solid transparent;
}

.slider-dot-wrapper:hover .slider-dot {
  background-color: #1989fa;
  border-color: #1989fa;
}

.slider-dot-wrapper.active {
  transform: translateX(-50%) scale(1.1);
}
.slider-dot-wrapper.active .slider-dot {
  background-color: #1989fa;
  border-color: #1989fa;
}

.slider-dot-wrapper.past .slider-dot {
  background-color: #1989fa;
  border-color: #1989fa;
}

.value-display {
  margin-top: 15px;
  font-size: 18px;
  color: #333;
}
</style>
