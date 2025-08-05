import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
        },
      })
    }),

  getAll: adminProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input

      const items = await ctx.db.user.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem!.id
      }

      return {
        items,
        nextCursor,
      }
    }),

  updateRole: adminProcedure
    .input(z.object({
      userId: z.string(),
      role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR']),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      })
    }),

  delete: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({
        where: { id: input },
      })
    }),
}) 