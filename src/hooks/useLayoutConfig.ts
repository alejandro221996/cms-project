import { api } from '@/lib/trpc/client'

export function useLayoutConfig() {
  const { data: layoutConfig, isLoading, error } = api.settings.getLayout.useQuery()

  return {
    layoutConfig,
    isLoading,
    error,
    isReady: !isLoading && !error
  }
} 