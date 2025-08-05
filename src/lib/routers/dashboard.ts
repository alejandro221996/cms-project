import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const [
        totalPosts,
        publishedPosts,
        draftPosts,
        totalCategories,
        totalUsers,
      ] = await Promise.all([
        ctx.db.post.count(),
        ctx.db.post.count({
          where: { status: 'PUBLISHED' },
        }),
        ctx.db.post.count({
          where: { status: 'DRAFT' },
        }),
        ctx.db.category.count(),
        ctx.db.user.count(),
      ])

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalCategories,
        totalUsers,
      }
    }),

  getRecentPosts: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(10).default(5),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        take: input.limit,
        include: {
          author: {
            select: {
              name: true,
            },
          },
          categories: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),

  getPostsByStatus: protectedProcedure
    .query(async ({ ctx }) => {
      const [draft, published, scheduled, archived] = await Promise.all([
        ctx.db.post.count({ where: { status: 'DRAFT' } }),
        ctx.db.post.count({ where: { status: 'PUBLISHED' } }),
        ctx.db.post.count({ where: { status: 'SCHEDULED' } }),
        ctx.db.post.count({ where: { status: 'ARCHIVED' } }),
      ])

      return {
        draft,
        published,
        scheduled,
        archived,
      }
    }),
}) 