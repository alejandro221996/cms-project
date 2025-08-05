import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, FolderOpen, Eye } from 'lucide-react'

async function getStats() {
  // This would be replaced with tRPC call in a real implementation
  // For now, we'll return mock data
  return {
    totalPosts: 24,
    publishedPosts: 18,
    draftPosts: 6,
    totalCategories: 8,
    totalUsers: 5,
  }
}

export async function DashboardStats() {
  const stats = await getStats()

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      description: 'All posts in the system',
    },
    {
      title: 'Published Posts',
      value: stats.publishedPosts,
      icon: Eye,
      description: 'Posts currently live',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderOpen,
      description: 'Content categories',
    },
    {
      title: 'Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered users',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 