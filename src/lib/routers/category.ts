import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
})

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input

      const items = await ctx.db.category.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
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

  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.category.findUnique({
        where: { id: input },
        include: {
          posts: {
            include: {
              author: true,
            },
          },
        },
      })
    }),

  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.category.findUnique({
        where: { slug: input },
        include: {
          posts: {
            where: {
              status: 'PUBLISHED',
            },
            include: {
              author: true,
            },
            orderBy: {
              publishedAt: 'desc',
            },
          },
        },
      })
    }),

  create: protectedProcedure
    .input(categorySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.create({
        data: input,
      })
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      ...categorySchema.shape,
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.db.category.update({
        where: { id },
        data,
      })
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.delete({
        where: { id: input },
      })
    }),
}) 