import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const author = searchParams.get('author')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const status = searchParams.get('status')

    // Build where clause
    const where: {
      status?: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' | 'ARCHIVED'
      categories?: {
        some: {
          slug: string
        }
      }
      author?: {
        name: { contains: string; mode: 'insensitive' }
      }
      publishedAt?: {
        gte?: Date
        lte?: Date
      }
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' }
        content?: { contains: string; mode: 'insensitive' }
        excerpt?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    // Status filter
    if (status) {
      where.status = status as 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' | 'ARCHIVED'
    }

    // Category filter
    if (category) {
      where.categories = {
        some: {
          slug: category
        }
      }
    }

    // Author filter
    if (author) {
      where.author = {
        name: { contains: author, mode: 'insensitive' }
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.publishedAt = {}
      if (dateFrom) {
        where.publishedAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.publishedAt.lte = new Date(dateTo)
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get posts with all statuses (admin can see all)
    const posts = await db.post.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          }
        },
        categories: {
          select: {
            name: true,
            slug: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50, // Limit results for performance
    })

    const total = await db.post.count({ where })

    return NextResponse.json({
      posts,
      total
    })
  } catch (error) {
    console.error('Error searching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 