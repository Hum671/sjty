import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { localCache } from './cache'
import { number } from 'echarts'

// 使用插件
dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)

export function handleEncryption(value: any, isEncryption: boolean) {
  return isEncryption ? value : '******'
}

export function getCurrentURLParams() {
  const params = {}
  const urlParts = location.href.split('?')

  if (urlParts.length > 1) {
    const queryString = urlParts[1]
    const keyValuePairs = queryString.split('&')

    for (const pair of keyValuePairs) {
      const [key, value] = pair.split('=')
      params[key] = decodeURIComponent(value)
    }
  }

  return params
}

export function getToken() {
  const token = localCache.getCache('SESSION_TOKEN')
  return token
}

export function delToken() {
  localCache.deleteCache('SESSION_TOKEN')
}

export function getLang() {
  return localCache.getCache('i18nLocale')
}

/**
 * 选择文件
 *
 * @returns Promise<File>
 */
export function selectImageFile(): Promise<File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.style.display = 'none'

    input.addEventListener('change', () => {
      const file = input.files ? input.files[0] : null
      if (file) {
        if (!file.type.startsWith('image/')) {
          reject(new Error('Please select an image file.'))
        } else {
          resolve(file)
        }
      } else {
        reject(new Error('No file selected.'))
      }
    })

    // 创建一个 label 元素，并将 input 元素包裹在其中
    const label = document.createElement('label')
    label.appendChild(input)

    // 将 label 元素添加到文档中
    document.body.appendChild(label)

    // 触发点击事件，打开文件选择对话框
    input.click()

    // 在操作完成后，移除 label 元素
    input.addEventListener('focusout', () => {
      document.body.removeChild(label)
    })
  })
}

/**
 * num格式化
 *
 * @param num
 * @param decimalPlaces
 * @returns
 */
export function formatNumber(num: number, decimalPlaces: number): string {
  const rounded = num.toFixed(decimalPlaces)
  const roundedFloat = parseFloat(rounded)
  const floatNum = roundedFloat === Math.floor(roundedFloat) ? roundedFloat.toString() : rounded
  return floatNum
}

// 深度copy
export function deepCopy<T>(obj: T): T {
  // 如果是基本类型直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  // 创建一个新的对象或数组
  const newObj: any = Array.isArray(obj) ? [] : {}

  // 遍历原对象的所有属性
  for (const key in obj) {
    // 递归调用深度拷贝函数，复制每个属性值
    newObj[key] = deepCopy(obj[key])
  }

  return newObj
}

// 将utc时间字符串转成本地时间（12小时制格式）
export function formatToLocaleTime(
  utcTimeString: string | number,
  formatStr: string = 'YYYY-MM-DD hh:mm:ss A',
) {
  // 判断输入是时间戳还是 UTC 时间字符串
  let localTime

  if (typeof utcTimeString === 'number') {
    // 如果是时间戳，转换为 UTC 时间并再转换为本地时间（12小时制）
    localTime = dayjs
      .utc(utcTimeString * 1000)  // 时间戳是秒，需要乘以 1000 转换为毫秒
      .local()
      .format(formatStr)  // 转换为本地时间并使用12小时制格式
  } else {
    const isoFormatString = `${utcTimeString.replace(' ', 'T')}Z`
    localTime = dayjs(isoFormatString).local().format(formatStr)
  }
  
  return localTime
}

// 判断设备是否为PC端
export function checkDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase() // 获取用户代理字符串并转为小写

  // 判断是否为移动设备
  const isMobile = /iphone|ipod|android|blackberry|windows phone|mobile/i.test(userAgent)

  return isMobile
}

export function convertSeconds(seconds = 0) {
  if (seconds >= 86400) {
    // 转换为天
    const days = (seconds / 86400).toFixed(0)
    return `${days} D`
  } else if (seconds >= 3600) {
    // 转换为小时
    const hours = (seconds / 3600).toFixed(0)
    return `${hours} H`
  } else {
    // 保留秒数
    return `${seconds}S`
  }
}

const allImages = import.meta.glob('@/assets/coinLogo/*.png', { eager: true, as: 'url' })
const imageObj = Object.fromEntries(
  Object.entries(allImages).map(([path, url]) => {
    const fileName = path.split('/').pop().split('.')[0] // 获取文件名
    return [fileName, url] // { "btc": "...url" }
  }),
)

const commoditiesSymbols = [
  'T_XAU',
  'T_XAG',
  'T_XPT',
  'T_XPD',
  'hf_CL',
  'hf_HG',
  'HX_AMD',
  'HX_AAPL',
  'HX_TSLA',
  'HX_GOOG',
  'HX_AMZH',
  'HX_AIG',
  'HX_AXP',
  'HX_HSI',
  'HX_SENSEX',
  'HX_KS11',
  'HX_SET',
  'HX_UDI',
  'HX_MSFT',
  'HX_NVDA',
  'HX_META',
]
const commoditiesSymbolMapName = new Map([
  ['T_XAU', 'Gold'],
  ['T_XAG', 'Silver'],
  ['T_XPT', 'Platinum'],
  ['T_XPD', 'Palladium'],
  ['hf_CL', 'WTI'],
  ['hf_HG', 'Copper'],
  ['HX_AMD', 'AMD'],
  ['HX_AAPL', 'Apple Inc'],
  ['HX_TSLA', 'Tesla'],
  ['HX_GOOG', 'Alphabet'],
  ['HX_AMZH', 'Amazon'],
  ['HX_AIG', 'AIG'],
  ['HX_AXP', 'American Express'],
  ['HX_HSI', 'HSI'],
  ['HX_SENSEX', 'CHA'],
  ['HX_KS11', 'SH000300'],
  ['HX_SET', 'YM'],
  ['HX_UDI', 'DAX'],
  ['HX_MSFT', 'Microsoft'],
  ['HX_NVDA', 'NVIDIA'],
  ['HX_META', 'Meta Platforms'],
])

export function getCoinNameBySymbol(symbol) {
  if (commoditiesSymbols.includes(symbol)) {
    // 处理symbol与名字不同的币种
    return commoditiesSymbolMapName.get(symbol)
  } else {
    // 处理其他币种，比如数字货币
    return symbol?.replace('usdt', '').replace('fx_s', '').toLocaleUpperCase() || ''
  }
}

export function getIconImage(name = 'USDT') {
  if (name.toUpperCase().includes('USDT')) {
    return imageObj['USDT']
  }

  // 名字有空格的，两个词的
  if (name.includes(' ')) {
    const firstName = name.split(' ')[0]
    if (!getCoinNameBySymbol(firstName)) {
      return
    }
    return imageObj[getCoinNameBySymbol(firstName).toLocaleUpperCase()]
  }

  if (commoditiesSymbols.includes(name)) {
    if (!getCoinNameBySymbol(name)) {
      return
    }
    return imageObj[getCoinNameBySymbol(name).toLocaleUpperCase()]
  }

  return imageObj[getCoinNameBySymbol(name)]
}

export async function imgToBase64(url: string) {
  const response = await fetch(url) // 获取图片资源
  const blob = await response.blob() // 转 Blob
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob) // 转 base64
  })
}

export function debounceFunc(func, wait = 300, immediate = false) {
  let timeout

  return function (...args) {
    const context = this

    // 如果立即执行，且没有等待定时器
    if (immediate && !timeout) {
      func.apply(context, args)
    }

    clearTimeout(timeout) // 清除之前的定时器
    timeout = setTimeout(() => {
      if (!immediate) {
        func.apply(context, args) // 延迟执行函数
      }
    }, wait)
  }
}

export function formataFix2(num: string | number) {
  return usFormat(Number(num ?? 0).toFixed(4))
}

// 处理数字格式化的逻辑
// usFormat 函数，格式化数字并处理负号
export function usFormat(numb: string | number = 0): string {
  let num
  if (typeof numb === 'string') {
    num = Number(numb)
  } else {
    num = numb
  }

  // 将输入转为字符串类型处理
  const numStr = num.toString().trim()

  // 使用正则匹配所有数字部分（包括负数），并进行千分符格式化
  const formattedString = numStr.replace(/-?\d+(?:\.\d+)?/g, (match) => {
    // 分割整数和小数部分
    const parts = match.split('.')

    // 对整数部分进行千分符格式化
    parts[0] = new Intl.NumberFormat('en-US').format(Number(parts[0]))

    // 重新组合整数和小数部分
    return parts.join('.')
  })

  return formattedString
}

// 千分符格式化函数
export function formatInputUs(val: string) {
  if (!val) return ''

  val = String(val)

  // 移除已有千分符
  val = val.replace(/,/g, '')

  // 允许负号和小数点
  let isNegative = false
  if (val.startsWith('-')) {
    isNegative = true
    val = val.slice(1)
  }

  // 分割整数和小数部分
  let [intPart, decimalPart] = val.split('.')

  // 防止空整数
  intPart = intPart || '0'

  // 只对整数部分加千分符
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // 合并整数和小数部分
  const formatted = decimalPart !== undefined ? `${intPart}.${decimalPart}` : intPart

  return isNegative ? `-${formatted}` : formatted
}

// 千分符字符串还原成数字
export function parseFormatInputUsNumber(val: string) {
  if (Number(val) === 0) {
    return 0
  }

  if (!val) return ''

  val = String(val)
  // 去掉所有逗号
  val = val.replace(/,/g, '')

  // 保留负号和小数点，其余非法字符去掉
  val = val.replace(/[^\d.-]/g, '')

  // 处理负号：只允许开头有一个负号
  const isNegative = val.startsWith('-')
  val = isNegative ? '-' + val.slice(1).replace(/-/g, '') : val

  // 如果有多个小数点，只保留第一个
  const parts = val.split('.')
  if (parts.length > 2) {
    val = parts[0] + '.' + parts.slice(1).join('')
  }

  return val
}
