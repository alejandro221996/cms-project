import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const author = searchParams.get('author')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search')
    const status = searchParams.get('status') || 'PUBLISHED'

    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' | 'ARCHIVED'
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
    } = {
      status: status as 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' | 'ARCHIVED',
    }

    if (category) {
      where.categories = {
        some: {
          slug: category
        }
      }
    }

    if (author) {
      where.author = {
        name: { contains: author, mode: 'insensitive' }
      }
    }

    if (dateFrom || dateTo) {
      where.publishedAt = {}
      if (dateFrom) {
        where.publishedAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.publishedAt.lte = new Date(dateTo)
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get posts with pagination
    const [posts, total] = await Promise.all([
      db.post.findMany({
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
          publishedAt: 'desc'
        },
        skip,
        take: limit,
      }),
      db.post.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 