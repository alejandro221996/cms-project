import { createTRPCRouter } from './trpc'
import { postRouter } from './routers/post'
import { categoryRouter } from './routers/category'
import { userRouter } from './routers/user'
import { dashboardRouter } from './routers/dashboard'
import { settingsRouter } from './routers/settings'
import { tagRouter } from './routers/tag'
import { analyticsRouter } from './routers/analytics'

export const appRouter = createTRPCRouter({
  post: postRouter,
  category: categoryRouter,
  user: userRouter,
  dashboard: dashboardRouter,
  settings: settingsRouter,
  tag: tagRouter,
  analytics: analyticsRouter,
})

export type AppRouter = typeof appRouter 