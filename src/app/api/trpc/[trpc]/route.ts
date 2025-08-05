import { NextRequest } from 'next/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/lib/router'
import { createTRPCContext } from '@/lib/trpc'

async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      // For App Router, we create context without req/res since session
      // is handled by middleware or client-side authentication
      return createTRPCContext({ 
        req: undefined, 
        res: undefined,
        info: undefined
      })
    },
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error}`
            )
          }
        : undefined,
  })
}

export { handler as GET, handler as POST } 