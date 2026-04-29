import { useSthemeStore } from '@/stores/theme'

export function useThemeHook() {
  // 当前主题状态
  const { theme } = storeToRefs(useSthemeStore())

  // 设置主题
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    localStorage.setItem('theme-mode', newTheme)
  }

  // 切换主题
  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  // 初始化主题（读取本地存储，如果没有默认 dark）
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme-mode') as 'dark' | 'light'
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme('dark')
    }
  })

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
