import useSort from '@/hooks/useSortHook'

export default function useMoptional() {
  const { setOriginList } = useSort()

  const optionalList = []

  watchEffect(() => {
    // 只在(自选tab)生效
  })
}
