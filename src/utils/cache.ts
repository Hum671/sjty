enum CacheType {
  local = 'local',
  session = 'session',
}

class HYCache {
  storage: Storage

  constructor(type: CacheType) {
    this.storage = type === CacheType.local ? localStorage : sessionStorage
  }

  setCache(key: string, value: any = '') {
    this.storage.setItem(key, JSON.stringify(value))
  }

  getCache(key: string) {
    const value = this.storage.getItem(key)
    if (value && value !== 'undefined') {
      return JSON.parse(value)
    }
  }

  get(key: string) {
    return this.storage.getItem(key)
  }

  deleteCache(key: string | string[]) {
    if (Array.isArray(key)) {
      key.forEach((item) => {
        this.storage.removeItem(item)
      })
    } else {
      this.storage.removeItem(key)
    }
  }

  clearCache() {
    this.storage.clear()
  }
}

const localCache = new HYCache(CacheType.local)
const sessionCache = new HYCache(CacheType.session)

export { localCache, sessionCache }
