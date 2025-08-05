'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState, useEffect, useMemo } from 'react'
import { api } from '@/lib/trpc/client'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

function TRPCProvider({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const [queryClient] = useState(() => new QueryClient())
  
  // Create trpcClient with credentials
  const trpcClient = useMemo(() => {
    return api.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          fetch: ((input: RequestInfo, init?: RequestInit) => {
            return fetch(input, {
              ...init,
              credentials: 'include',
            });
          }) as typeof fetch,
        }),
      ],
    })
  }, [])

  // Clear TRPC cache when session changes
  useEffect(() => {
    if (status === 'unauthenticated') {
      queryClient.clear()
    }
  }, [status, queryClient])

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <TRPCProvider>
        {children}
      </TRPCProvider>
    </SessionProvider>
  )
} 