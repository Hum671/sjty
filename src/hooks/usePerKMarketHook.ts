import { dispose, init, LineType, type Styles, TooltipShowRule, TooltipShowType } from 'klinecharts'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
export const options = [
  {
    name: '1m',
    key: '1m',
    size: 300,
    time: 60,
  },
  {
    name: '5m',
    key: '5m',
    size: 300,
    time: 5 * 60,
  },
  {
    name: '15m',
    key: '15m',
    size: 300,
    time: 15 * 60,
  },
  {
    name: '30m',
    key: '30m',
    size: 300,
    time: 30 * 60,
  },
  {
    name: '1h',
    key: '1h',
    size: 300,
    time: 60 * 60,
  },
  {
    name: 'Day',
    key: '1d',
    size: 300,
    time: 24 * 60 * 60,
  },
  {
    name: 'Month',
    key: '1M',
    size: 100,
    time: 30 * 24 * 60 * 60,
  },
]

const themeStyles: DeepPartial<Styles> = {
  candle: {
    tooltip: {
      showType: TooltipShowType.Rect,
      showRule: TooltipShowRule.FollowCross,
      rect: {
        position: 'absolute',
        color: 'rgba(248, 250, 252, 0.9)',
        borderColor: '#4d4d51',
      },
      text: { color: '#4d4d51' },
    },
  },
  grid: {
    horizontal: {
      show: true,
      size: 1,
      color: 'rgba(127,96,232,0.2)',
      style: LineType.Dashed,
      dashedValue: [2, 2],
    },
    vertical: {
      show: true,
      size: 1,
      color: 'rgba(127,96,232,0.2)',
      style: LineType.Dashed,
      dashedValue: [2, 2],
    },
  },
  xAxis: { axisLine: { color: '#4d4d51' } },
  yAxis: { axisLine: { color: '#4d4d51' } },
  separator: {
    color: 'rgba(127,96,232,0.4)',
  },
  crosshair: {
    horizontal: {
      line: { color: 'rgba(127,96,232,0.5)' },
      text: { backgroundColor: '#4d4d51', color: '#fff' },
    },
    vertical: {
      line: { color: 'rgba(127,96,232,0.5)' },
      text: { backgroundColor: '#4d4d51', color: '#fff' },
    },
  },
}

export default function useKMarketHook() {
  const optionIndex = ref(0)
  const kLineContainer = ref(null)

  onUnmounted(() => {
    dispose(kLineContainer.value)
  })

  // 创建k线图
  function createKLineChart(isExtension = true) {
    const chart = init(kLineContainer.value, {
      styles: themeStyles,
    })

    if (isExtension) {
      chart.createIndicator('MA', true, { id: 'candle_pane' })
    }

    return chart
  }

  function destroyInstance(instance) {
    dispose(instance)
  }

  return {
    optionIndex,
    kLineContainer,
    createKLineChart,
    destroyInstance,
  }
}
