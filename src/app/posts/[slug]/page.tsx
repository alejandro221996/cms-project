'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { CommentSection } from '@/components/comments/CommentSection'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string | null
  publishedAt: string
  author: {
    name: string
  }
  categories: Array<{
    name: string
    slug: string
  }>
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)

  const fetchPost = useCallback(async () => {
    if (!resolvedParams?.slug) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${resolvedParams.slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Error loading post');
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams?.slug]);

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (resolvedParams) {
      fetchPost();
    }
  }, [resolvedParams, fetchPost]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The post you are looking for does not exist.'}</p>
          <Button asChild>
            <Link href="/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>
        </div>

        {/* Post Content */}
        <Card className="mb-8">
          {post.featuredImage && (
            <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </CardTitle>
            {post.excerpt && (
              <p className="text-xl text-gray-600 italic">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.slug}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Comments Section */}
        <CommentSection postSlug={post.slug} />
      </div>
    </div>
  )
} 