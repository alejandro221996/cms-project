import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure, adminProcedure } from '../trpc'

export const analyticsRouter = createTRPCRouter({
  // Registrar vista de post (público)
  recordView: publicProcedure
    .input(z.object({
      postId: z.string(),
      userAgent: z.string().optional(),
      ipAddress: z.string().optional(),
      referer: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { postId, userAgent, ipAddress, referer } = input

      // Verificar que el post existe
      const post = await ctx.db.post.findUnique({
        where: { id: postId, status: 'PUBLISHED' }
      })

      if (!post) {
        throw new Error('Post not found or not published')
      }

      // Crear registro de vista
      const view = await ctx.db.postView.create({
        data: {
          postId,
          userAgent,
          ipAddress,
          referer,
        }
      })

      // Incrementar contador de vistas en el post
      await ctx.db.post.update({
        where: { id: postId },
        data: {
          viewCount: {
            increment: 1
          }
        }
      })

      return view
    }),

  // Obtener analytics de un post específico
  getPostAnalytics: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: postId }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: postId },
        select: { viewCount: true }
      })

      if (!post) {
        throw new Error('Post not found')
      }

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Vistas hoy
      const viewsToday = await ctx.db.postView.count({
        where: {
          postId,
          createdAt: { gte: today }
        }
      })

      // Vistas esta semana
      const viewsThisWeek = await ctx.db.postView.count({
        where: {
          postId,
          createdAt: { gte: thisWeek }
        }
      })

      // Vistas este mes
      const viewsThisMonth = await ctx.db.postView.count({
        where: {
          postId,
          createdAt: { gte: thisMonth }
        }
      })

      // Vistas únicas (por IP)
      const uniqueViews = await ctx.db.postView.groupBy({
        by: ['ipAddress'],
        where: { postId },
        _count: true
      })

      // Top referrers
      const topReferrers = await ctx.db.postView.groupBy({
        by: ['referer'],
        where: { 
          postId,
          referer: { not: null }
        },
        _count: true,
        orderBy: {
          _count: { referer: 'desc' }
        },
        take: 10
      })

      // Vistas por día (últimos 30 días)
      const viewsByDay = await ctx.db.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as views
        FROM post_views 
        WHERE post_id = ${postId}
          AND created_at >= ${thisMonth}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      ` as { date: Date; views: bigint }[]

      return {
        totalViews: post.viewCount,
        uniqueViews: uniqueViews.length,
        viewsToday,
        viewsThisWeek,
        viewsThisMonth,
        topReferrers: topReferrers.map(r => ({
          referer: r.referer || 'Direct',
          count: r._count
        })),
        viewsByDay: viewsByDay.map(v => ({
          date: v.date.toISOString().split('T')[0],
          views: Number(v.views)
        }))
      }
    }),

  // Obtener analytics generales del sitio (solo admin)
  getSiteAnalytics: adminProcedure
    .input(z.object({
      days: z.number().min(1).max(365).default(30),
    }))
    .query(async ({ ctx, input }) => {
      const { days } = input
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Total de vistas
      const totalViews = await ctx.db.postView.count()

      // Vistas en el período
      const viewsInPeriod = await ctx.db.postView.count({
        where: {
          createdAt: { gte: startDate }
        }
      })

      // Vistas únicas en el período
      const uniqueViewsInPeriod = await ctx.db.postView.groupBy({
        by: ['ipAddress'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: true
      })

      // Posts más populares
      const popularPosts = await ctx.db.post.findMany({
        take: 10,
        where: {
          status: 'PUBLISHED',
          viewCount: { gt: 0 }
        },
        select: {
          id: true,
          title: true,
          slug: true,
          viewCount: true,
          author: {
            select: { name: true }
          }
        },
        orderBy: {
          viewCount: 'desc'
        }
      })

      // Vistas por día
      const viewsByDay = await ctx.db.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as views,
          COUNT(DISTINCT ip_address) as unique_views
        FROM post_views 
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      ` as { date: Date; views: bigint; unique_views: bigint }[]

      // Top referrers
      const topReferrers = await ctx.db.postView.groupBy({
        by: ['referer'],
        where: { 
          createdAt: { gte: startDate },
          referer: { not: null }
        },
        _count: true,
        orderBy: {
          _count: { referer: 'desc' }
        },
        take: 10
      })

      return {
        totalViews,
        viewsInPeriod,
        uniqueViewsInPeriod: uniqueViewsInPeriod.length,
        popularPosts,
        viewsByDay: viewsByDay.map(v => ({
          date: v.date.toISOString().split('T')[0],
          views: Number(v.views),
          uniqueViews: Number(v.unique_views)
        })),
        topReferrers: topReferrers.map(r => ({
          referer: r.referer || 'Direct',
          count: r._count
        }))
      }
    }),

  // Obtener estadísticas rápidas para el dashboard
  getDashboardStats: protectedProcedure
    .query(async ({ ctx }) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

      // Estadísticas de hoy
      const viewsToday = await ctx.db.postView.count({
        where: { createdAt: { gte: today } }
      })

      // Estadísticas de ayer
      const viewsYesterday = await ctx.db.postView.count({
        where: { 
          createdAt: { 
            gte: yesterday,
            lt: today
          }
        }
      })

      // Total de posts publicados
      const publishedPosts = await ctx.db.post.count({
        where: { status: 'PUBLISHED' }
      })

      // Total de tags
      const totalTags = await ctx.db.tag.count()

      // Post más visto hoy
      const topPostToday = await ctx.db.postView.groupBy({
        by: ['postId'],
        where: { createdAt: { gte: today } },
        _count: true,
        orderBy: {
          _count: { postId: 'desc' }
        },
        take: 1
      })

      let topPostInfo = null
      if (topPostToday.length > 0) {
        topPostInfo = await ctx.db.post.findUnique({
          where: { id: topPostToday[0].postId },
          select: {
            title: true,
            slug: true,
            viewCount: true
          }
        })
      }

      const growthPercentage = viewsYesterday === 0 
        ? (viewsToday > 0 ? 100 : 0)
        : ((viewsToday - viewsYesterday) / viewsYesterday) * 100

      return {
        viewsToday,
        viewsYesterday,
        growthPercentage: Math.round(growthPercentage * 100) / 100,
        publishedPosts,
        totalTags,
        topPostToday: topPostInfo ? {
          ...topPostInfo,
          viewsToday: topPostToday[0]._count
        } : null
      }
    }),
})