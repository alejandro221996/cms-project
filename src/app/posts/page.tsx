'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { SearchBar } from '@/components/search/SearchBar'

interface Post {
  id: string
  title: string
  slug: string
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

interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<{
    category?: string
    author?: string
    dateFrom?: string
    dateTo?: string
    status?: 'all' | 'published' | 'draft'
  }>({})
  const [currentPage, setCurrentPage] = useState(1)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '6',
        ...(search && { search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.author && { author: filters.author }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      })

      const response = await fetch(`/api/posts?${params}`)
      if (response.ok) {
        const data: PostsResponse = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, search, filters])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Posts
          </h1>
          <p className="text-xl text-gray-600">
            Latest articles and insights from our team
          </p>
        </div>

        {/* Search */}
        <div className="max-w-4xl mx-auto mb-8">
          <SearchBar
            onSearch={(query, searchFilters) => {
              setSearch(query)
              setFilters(searchFilters)
              setCurrentPage(1) // Reset to first page when searching
            }}
            placeholder="Search posts..."
            showFilters={true}
          />
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">
              {search ? 'Try adjusting your search terms.' : 'Check back later for new content.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  {post.featuredImage && (
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      {post.categories.map((category) => (
                        <span
                          key={category.slug}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 