import { getNtfResources } from '@/api/ntf'
import type { INtfCardItem } from '@/api/ntf/model/ntfModel'

import baiPng from '@/assets/images/白色.png'
import ziPng from '@/assets/images/紫色.png'
import lvPng from '@/assets/images/绿色.png'
import lanPng from '@/assets/images/蓝色.png'
import jinPng from '@/assets/images/金色.png'

const borderImgMapLevelId = {
  1: baiPng,
  2: lanPng,
  3: jinPng,
  4: lvPng,
  5: ziPng,
}

export default function useNtfCache() {
  const imgPreLoading = ref(false)
  const host = ref('http://47.130.117.64:8989')
  const loadedCount = ref(0)
  const borderImgs = [baiPng, lanPng, jinPng, lvPng, ziPng]

  onMounted(() => {
    loadImgsToCache()
  })

  function loadImgsToCache() {
    imgPreLoading.value = true
    getNtfResources().then((res) => {
      if (res.code === 200) {
        host.value = res.data.host
        const urls = getImgPaths(res.data.list)
        preloadImages(borderImgs.concat(urls))
      }
    })
  }

  function getImgPaths(imgList: INtfCardItem[] = []) {
    const imgPaths = imgList.map((item) => `${host.value}/${item.attachments.filepath}`)
    return imgPaths || []
  }

  function preloadImages(urls) {
    let count = 0
    urls.forEach((url) => {
      const img = new Image()
      img.src = url
      img.onload = img.onerror = () => {
        count++
        loadedCount.value = count
        if (count === urls.length) {
          imgPreLoading.value = false
        }
      }
    })
  }

  return {
    borderImgMapLevelId,
    imgPreLoading,
  }
}
