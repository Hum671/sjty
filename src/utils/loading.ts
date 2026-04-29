import Loading from '@/components/Loading.vue'
import { type App, createApp } from 'vue'

export function showMyLoading() {
  let mountNode: HTMLElement = null
  const dialogApp: App<Element> | undefined = createApp(Loading, {
    visible: false,
  })

  if (!isHaveLoadingEl()) {
    // 多次使用showMyLoading，全局只创建一个loading元素
    mountNode = document.createElement('div')
    mountNode.id = 'my-global-loading'
    document.body.appendChild(mountNode)
    dialogApp.mount(mountNode)
  }

  function showLoading() {
    mountNode.style.display = 'block'
  }

  function hideLoading() {
    mountNode.style.display = 'none'
  }

  return { showLoading, hideLoading }
}

function isHaveLoadingEl() {
  const bodyChildren = document.body.children
  for (let i = 0; i < bodyChildren.length; i++) {
    const childElement = bodyChildren[i]
    if (childElement.id === 'my-global-loading') {
      return true
    }
  }
  return false
}
