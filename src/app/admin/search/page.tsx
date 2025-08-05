'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Calendar, Eye, Edit, Trash2, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { SearchBar } from '@/components/search/SearchBar'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
  featuredImage: string | null
  publishedAt: string | null
  createdAt: string
  author: {
    name: string
    email: string
  }
  categories: Array<{
    name: string
    slug: string
  }>
}

interface SearchResponse {
  posts: Post[]
  total: number
}

export default function SearchPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  const handleSearch = useCallback(async (query: string, filters: {
    category?: string
    author?: string
    dateFrom?: string
    dateTo?: string
    status?: 'all' | 'published' | 'draft'
  }) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        ...(query && { search: query }),
        ...(filters.category && { category: filters.category }),
        ...(filters.author && { author: filters.author }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      })

      const response = await fetch(`/api/admin/search?${params}`)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setPosts(data.posts)
        setTotalResults(data.total)
      }
    } catch (error) {
      console.error('Error searching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Published'
      case 'DRAFT':
        return 'Draft'
      case 'SCHEDULED':
        return 'Scheduled'
      case 'ARCHIVED':
        return 'Archived'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
          <p className="mt-2 text-gray-600">
            Search and filter posts with advanced options
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search posts by title, content, or excerpt..."
            showFilters={true}
          />
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Search Results</CardTitle>
            {totalResults > 0 && (
              <span className="text-sm text-gray-600">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Featured Image */}
                    {post.featuredImage && (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                            {post.excerpt}
                          </p>
                        </div>
                        <Badge className={getStatusColor(post.status)}>
                          {getStatusText(post.status)}
                        </Badge>
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.publishedAt 
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : new Date(post.createdAt).toLocaleDateString()
                          }
                        </span>
                      </div>

                      {/* Categories */}
                      <div className="flex items-center gap-2 mb-3">
                        {post.categories.map((category) => (
                          <Badge key={category.slug} variant="outline" className="text-xs">
                            {category.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/posts/${post.slug}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 