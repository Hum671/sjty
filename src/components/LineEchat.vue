<script setup lang="ts">
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])
const props = defineProps<{
  lineColor: string
}>()
const chartRef = ref()
const myChart = ref()
const option = ref({
  grid: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    containLabel: false, // ⚠ 不保留文字空间
  },
  xAxis: {
    type: 'category',
    show: false,
    scale: true,
    boundaryGap: false,
  },
  yAxis: {
    show: false,
    scale: true,
    type: 'log',
  },
  series: [
    {
      data: generateRandomData(15, 100, 1500),
      showSymbol: false,
      lineStyle: {
        color: '#55a965',
        width: 2,
      },
      type: 'line',
      smooth: true,
    },
  ],
  animation: true,
  animationDuration: 300,
  animationEasing: 'linear',
})

watch(
  () => props.lineColor,
  () => {
    const greenLine = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: 'rgba(0,197,114,0)' }, // 左透明
        { offset: 0.2, color: 'rgba(0,197,114,1)' }, // 左清晰
        { offset: 0.8, color: 'rgba(0,197,114,1)' }, // 右清晰
        { offset: 1, color: 'rgba(0,197,114,0)' }, // 右透明
      ],
    }
    const redLine = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: [
        { offset: 0, color: 'rgba(255,72,52,0)' }, // 左透明
        { offset: 0.2, color: 'rgba(255,72,52,1)' }, // 左清晰
        { offset: 0.8, color: 'rgba(255,72,52,1)' }, // 右清晰
        { offset: 1, color: 'rgba(255,72,52,0)' }, // 右透明
      ],
    }
    option.value.series[0].lineStyle.color = props.lineColor === 'green' ? greenLine : redLine
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  myChart.value = echarts.init(chartRef.value)
})

watchEffect(() => {
  if (myChart.value && option.value) {
    myChart.value.setOption(option.value)
  }
})

function generateRandomData(length: number, min: number, max: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}
</script>

<template>
  <div class="el" ref="chartRef"></div>
</template>

<style lang="less" scoped>
.el {
  height: 58px;
  width: 58px;
}
</style>
