import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  // SEO Fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  focusKeyword: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
})

export const postRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().nullish(),
      status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor, status } = input

      const items = await ctx.db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: status ? { status } : undefined,
        include: {
          author: true,
          categories: true,
          tags: true,
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

  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findUnique({
        where: { id: input },
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      })
    }),

  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findUnique({
        where: { slug: input },
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      })
    }),

  create: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      const { categoryIds, tagIds, ...postData } = input

      const post = await ctx.db.post.create({
        data: {
          ...postData,
          authorId: ctx.session.user.id,
          categories: categoryIds && categoryIds.length > 0 ? {
            connect: categoryIds.map(id => ({ id }))
          } : undefined,
          tags: tagIds && tagIds.length > 0 ? {
            connect: tagIds.map(id => ({ id }))
          } : undefined,
        },
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      })

      return post
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      ...postSchema.shape,
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, tagIds, ...postData } = input

      const post = await ctx.db.post.update({
        where: { id },
        data: {
          ...postData,
          categories: categoryIds ? {
            set: categoryIds.map(id => ({ id }))
          } : undefined,
          tags: tagIds ? {
            set: tagIds.map(id => ({ id }))
          } : undefined,
        },
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      })

      return post
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: { id: input },
      })
    }),

  publish: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: input },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })
    }),
}) 