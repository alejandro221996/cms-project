import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const posts = await db.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            name: true,
          }
        },
        categories: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20, // Limit to 20 most recent posts
    })

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CMS Blog</title>
    <description>A modern CMS blog</description>
    <link>${process.env.NEXTAUTH_URL || 'http://localhost:3000'}</link>
    <atom:link href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/feed/rss" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200)}...]]></description>
      <link>${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/posts/${post.slug}</link>
      <guid>${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/posts/${post.slug}</guid>
      <pubDate>${post.publishedAt?.toUTCString() || post.createdAt.toUTCString()}</pubDate>
      <author>${post.author.name}</author>
      ${post.categories.map(category => `<category>${category.name}</category>`).join('')}
    </item>
    `).join('')}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 