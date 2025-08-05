import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Eye, Clock, Archive } from 'lucide-react'

async function getPostsByStatus() {
  // This would be replaced with tRPC call in a real implementation
  // For now, we'll return mock data
  return {
    draft: 6,
    published: 18,
    scheduled: 2,
    archived: 1,
  }
}

export async function PostsByStatus() {
  const stats = await getPostsByStatus()

  const statusItems = [
    {
      name: 'Published',
      value: stats.published,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Draft',
      value: stats.draft,
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Scheduled',
      value: stats.scheduled,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Archived',
      value: stats.archived,
      icon: Archive,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ]

  const total = Object.values(stats).reduce((sum, value) => sum + value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Posts by Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusItems.map((item) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.value} posts</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{percentage}%</p>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.bgColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 