export const useSthemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('dark')

  return {
    theme,
  }
})
