import { defineStore } from 'pinia'

export const usegloablVarStore = defineStore('gloablVar', () => {
  const timers = ref({})

  return {
    timers,
  }
})
