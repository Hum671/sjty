import { defineStore } from 'pinia'
import { getNtfResources } from '@/api/ntf'
import { imgToBase64 } from '@/utils/utils'
import type { INtfCardItem, IStartItem } from '@/api/ntf/model/ntfModel'

import baiPng from '@/assets/images/白色.png'
import ziPng from '@/assets/images/紫色.png'
import lvPng from '@/assets/images/绿色.png'
import lanPng from '@/assets/images/蓝色.png'
import jinPng from '@/assets/images/金色.png'

export const useNtfStore = defineStore('ntfCtrl', () => {
  const loading = ref(false)
  const host = ref('http://47.130.117.64:8989')
  const loadedCount = ref(0)
  const imgPreLoadProgress = ref(0)
  const isFirstLoad = ref(true)
  const list = ref<INtfCardItem[]>([]) // 全部原始數据
  const shuffledList = ref<INtfCardItem[]>([]) // 打亂順序后的數据
  const borderImgMapLevelId = ref({})
  const idMapImagePath = computed<Map<number, IStartItem>>(() => {
    const imgMap = new Map()
    list.value.forEach((item) => {
      const newItem = {
        id: item.id,
        level: item.level,
        path: `${host.value}/${item.attachments.filepath}`,
      }
      imgMap.set(item.id, newItem)
    })
    return imgMap
  })

  onMounted(async () => {
    borderImgMapLevelId.value = {
      1: await imgToBase64(baiPng),
      2: await imgToBase64(lanPng),
      3: await imgToBase64(jinPng),
      4: await imgToBase64(lvPng),
      5: await imgToBase64(ziPng),
    }
  })

  function getResource() {
    loading.value = true
    getNtfResources()
      .then((res) => {
        if (res.code === 200) {
          host.value = res.data.host
          list.value = res.data.list
          shuffledList.value = shuffleArrayNew(res.data.list)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  function preloadImages() {
    if (!isFirstLoad.value) {
      return
    }
    imgPreLoadProgress.value = 0
    loading.value = true
    getNtfResources()
      .then((res) => {
        if (res.code === 200) {
          host.value = res.data.host
          list.value = res.data.list
          shuffledList.value = shuffleArrayNew(res.data.list)
          const urls = getImgPaths(res.data.list)
          loadImgList(urls)
        }
      })
      .catch(() => {
        loading.value = false
      })
  }

  function getImgPaths(imgList: INtfCardItem[] = []) {
    const imgPaths = imgList.map((item) => `${host.value}/${item.attachments.filepath}`)
    return imgPaths || []
  }

  function loadImgList(urls) {
    let count = 0
    urls.forEach((url) => {
      const img = new Image()
      img.src = url
      img.onload = img.onerror = () => {
        count++
        loadedCount.value = count
        const progress = count / urls.length
        imgPreLoadProgress.value = Math.round(progress * 100)
        if (count === urls.length) {
          imgPreLoadProgress.value = 0
          loading.value = false
          isFirstLoad.value = false
        }
      }
    })
  }

  // 洗牌
  function shuffleArrayNew(arr) {
    let i = arr.length
    const newArr = Array(i)
    while (i--) newArr[i] = arr[i]
    for (let m = newArr.length - 1; m > 0; m--) {
      const j = (Math.random() * (m + 1)) | 0
      const tmp = newArr[m]
      newArr[m] = newArr[j]
      newArr[j] = tmp
    }
    return newArr
  }

  return {
    host,
    list,
    borderImgMapLevelId,
    imgPreLoadProgress,
    loading,
    idMapImagePath,
    shuffledList,

    getResource,
    preloadImages,
  }
})
