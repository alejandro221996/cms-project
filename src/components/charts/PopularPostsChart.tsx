'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Trophy, FileText } from 'lucide-react'
import Link from 'next/link'

interface PopularPostData {
  id: string
  title: string
  slug: string
  viewCount: number
  author?: {
    name: string | null
  }
}

interface PopularPostsChartProps {
  data: PopularPostData[]
  title?: string
  limit?: number
  height?: number
}

export function PopularPostsChart({ 
  data, 
  title = "Posts Más Populares",
  limit = 10,
  height = 400 
}: PopularPostsChartProps) {
  // Limitar y formatear datos
  const chartData = data
    .slice(0, limit)
    .map(post => ({
      ...post,
      shortTitle: post.title.length > 25 
        ? post.title.substring(0, 25) + '...' 
        : post.title
    }))

  const CustomTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{ payload: PopularPostData, value: number }>
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-sm">
          <p className="font-medium text-gray-900 mb-2">{data.title}</p>
          <p className="text-blue-600 mb-1">
            <span className="font-semibold">{payload[0].value}</span> vistas
          </p>
          {data.author && data.author.name && (
            <p className="text-gray-600 text-sm">
              Por: {data.author.name}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-2">
            /{data.slug}
          </p>
        </div>
      )
    }
    return null
  }

  const totalViews = data.reduce((sum, post) => sum + post.viewCount, 0)
  const averageViews = Math.round(totalViews / data.length) || 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="text-sm text-gray-500">
            Top {limit} posts
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Vistas Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{averageViews.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Promedio por Post</div>
          </div>
        </div>

        {/* Gráfico */}
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="shortTitle" 
                stroke="#666"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="viewCount" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="Vistas"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de Posts */}
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Detalles de Posts
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {chartData.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <Link 
                      href={`/posts/${post.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                    </Link>
                    {post.author && post.author.name && (
                      <p className="text-xs text-gray-500">
                        Por {post.author.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {post.viewCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">vistas</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}