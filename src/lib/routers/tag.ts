import { z } from 'zod'
import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc'

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  color: z.string().optional(),
})

export const tagRouter = createTRPCRouter({
  // Obtener todos los tags (público)
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().nullish(),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search } = input

      const items = await ctx.db.tag.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        } : undefined,
        include: {
          _count: {
            select: { posts: true }
          }
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

  // Obtener tag por ID
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const tag = await ctx.db.tag.findUnique({
        where: { id: input },
        include: {
          posts: {
            where: { status: 'PUBLISHED' },
            include: {
              author: true,
              categories: true,
            },
            orderBy: { publishedAt: 'desc' },
          },
          _count: {
            select: { posts: true }
          }
        },
      })

      if (!tag) {
        throw new Error('Tag not found')
      }

      return tag
    }),

  // Obtener tag por slug
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const tag = await ctx.db.tag.findUnique({
        where: { slug: input },
        include: {
          posts: {
            where: { status: 'PUBLISHED' },
            include: {
              author: true,
              categories: true,
            },
            orderBy: { publishedAt: 'desc' },
          },
          _count: {
            select: { posts: true }
          }
        },
      })

      if (!tag) {
        throw new Error('Tag not found')
      }

      return tag
    }),

  // Crear tag (solo admin)
  create: adminProcedure
    .input(tagSchema)
    .mutation(async ({ ctx, input }) => {
      // Verificar que el slug no exista
      const existingTag = await ctx.db.tag.findUnique({
        where: { slug: input.slug }
      })

      if (existingTag) {
        throw new Error('Tag with this slug already exists')
      }

      const tag = await ctx.db.tag.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          color: input.color || '#3B82F6',
        },
        include: {
          _count: {
            select: { posts: true }
          }
        }
      })

      return tag
    }),

  // Actualizar tag (solo admin)
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      data: tagSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input

      // Si se está actualizando el slug, verificar que no exista
      if (data.slug) {
        const existingTag = await ctx.db.tag.findFirst({
          where: { 
            slug: data.slug,
            NOT: { id }
          }
        })

        if (existingTag) {
          throw new Error('Tag with this slug already exists')
        }
      }

      const tag = await ctx.db.tag.update({
        where: { id },
        data,
        include: {
          _count: {
            select: { posts: true }
          }
        }
      })

      return tag
    }),

  // Eliminar tag (solo admin)
  delete: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Verificar que el tag existe
      const tag = await ctx.db.tag.findUnique({
        where: { id: input },
        include: {
          _count: {
            select: { posts: true }
          }
        }
      })

      if (!tag) {
        throw new Error('Tag not found')
      }

      // Si tiene posts asociados, mostrar advertencia pero permitir eliminar
      // (las relaciones se manejan automáticamente por Prisma)
      
      await ctx.db.tag.delete({
        where: { id: input }
      })

      return { success: true, deletedPostsCount: tag._count.posts }
    }),

  // Obtener tags populares (más utilizados)
  getPopular: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(10),
    }))
    .query(async ({ ctx, input }) => {
      const tags = await ctx.db.tag.findMany({
        take: input.limit,
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        where: {
          posts: {
            some: {
              status: 'PUBLISHED'
            }
          }
        }
      })

      return tags
    }),
})