'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Check, X, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  authorName: string
  authorEmail: string
  isApproved: boolean
  createdAt: string
  post: {
    title: string
    slug: string
  }
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/comments')
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModeration = async (commentId: string, isApproved: boolean) => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, isApproved }),
      })

      if (response.ok) {
        // Update the comment in the local state
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, isApproved }
              : comment
          )
        )
      }
    } catch (error) {
      console.error('Error moderating comment:', error)
      alert('Error moderating comment')
    }
  }

  const pendingComments = comments.filter(c => !c.isApproved)
  const approvedComments = comments.filter(c => c.isApproved)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comments</h1>
          <p className="mt-2 text-gray-600">
            Moderate comments on your posts
          </p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading comments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Comments</h1>
        <p className="mt-2 text-gray-600">
          Moderate comments on your posts
        </p>
      </div>

      {/* Pending Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Pending Comments ({pendingComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingComments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending comments to moderate</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border rounded-lg bg-yellow-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.authorName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {comment.authorEmail}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="h-3 w-3" />
                        <Link 
                          href={`/posts/${comment.post.slug}`}
                          className="text-blue-600 hover:underline"
                        >
                          {comment.post.title}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleModeration(comment.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleModeration(comment.id, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Approved Comments ({approvedComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedComments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Check className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No approved comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border rounded-lg bg-green-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.authorName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {comment.authorEmail}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="h-3 w-3" />
                        <Link 
                          href={`/posts/${comment.post.slug}`}
                          className="text-blue-600 hover:underline"
                        >
                          {comment.post.title}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModeration(comment.id, false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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