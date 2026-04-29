import { sessionCache } from '@/utils/cache'

// 自选
export default function useCustomizedHook() {
  const customizedKey = 'SESSION_SYMBOLS_CUSTOMIZED_SYMBOL'

  function setSymbol(symbol) {
    const list = getSymbols()
    const index = list.findIndex((item) => item === symbol)

    if (index === -1) {
      list.push(symbol)
      sessionCache.setCache(customizedKey, list)
    } else {
      list.splice(index, 1)
      sessionCache.setCache(customizedKey, list)
    }
  }

  function isExistSymbol(symbol: string) {
    if (symbol === '') {
      return false
    }
    return getSymbols().includes(symbol)
  }

  function getSymbols(): string[] {
    return sessionCache.getCache(customizedKey) ?? []
  }

  return {
    setSymbol,
    isExistSymbol,
    getSymbols,
  }
}
