import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, User } from 'lucide-react'
import Link from 'next/link'

async function getRecentPosts() {
  // This would be replaced with tRPC call in a real implementation
  // For now, we'll return mock data
  return [
    {
      id: '1',
      title: 'Getting Started with Next.js 14',
      status: 'PUBLISHED',
      author: { name: 'John Doe' },
      createdAt: new Date('2024-01-15'),
      categories: [{ name: 'Development' }],
    },
    {
      id: '2',
      title: 'Building a Modern CMS',
      status: 'DRAFT',
      author: { name: 'Jane Smith' },
      createdAt: new Date('2024-01-14'),
      categories: [{ name: 'Tutorial' }],
    },
    {
      id: '3',
      title: 'TypeScript Best Practices',
      status: 'PUBLISHED',
      author: { name: 'Mike Johnson' },
      createdAt: new Date('2024-01-13'),
      categories: [{ name: 'Development' }],
    },
  ]
}

export async function RecentPosts() {
  const posts = await getRecentPosts()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Posts
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/posts">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 truncate">{post.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {post.categories.map((category) => (
                    <span
                      key={category.name}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 