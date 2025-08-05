import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // First, get the post
    const post = await db.post.findUnique({
      where: { slug },
      select: { id: true, status: true }
    })

    if (!post || post.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get approved comments
    const comments = await db.comment.findMany({
      where: {
        postId: post.id,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { content, authorName, authorEmail } = body

    // Validate input
    if (!content || !authorName || !authorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the post
    const post = await db.post.findUnique({
      where: { slug },
      select: { id: true, status: true }
    })

    if (!post || post.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Create comment
    const comment = await db.comment.create({
      data: {
        content,
        authorName,
        authorEmail,
        postId: post.id,
        isApproved: false, // Comments need approval by default
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 