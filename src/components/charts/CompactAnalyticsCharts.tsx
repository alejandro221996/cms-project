'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, Trophy, Activity } from 'lucide-react'
import { api } from '@/lib/trpc/client'
import Link from 'next/link'

export function CompactAnalyticsCharts() {
  const { data: siteAnalytics, isLoading } = api.analytics.getSiteAnalytics.useQuery({
    days: 7 // Últimos 7 días para dashboard principal
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!siteAnalytics) {
    return null
  }

  // Preparar datos para gráfico de línea (últimos 7 días)
  const weekData = siteAnalytics.viewsByDay.slice(-7).map(item => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { weekday: 'short' }),
    views: item.views
  }))

  // Preparar datos para top posts (top 5)
  const topPostsData = siteAnalytics.popularPosts.slice(0, 5).map(post => ({
    title: post.title.length > 15 ? post.title.substring(0, 15) + '...' : post.title,
    views: post.viewCount
  }))

  const totalWeekViews = weekData.reduce((sum, day) => sum + day.views, 0)

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ value: number }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-blue-600">
            {payload[0].value} vistas
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          📊 Resumen de Analytics
        </h2>
        <Link 
          href="/admin/analytics"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver análisis completo →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vistas de la Semana */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Vistas Últimos 7 Días
              </CardTitle>
              <div className="text-lg font-bold text-gray-900">
                {totalWeekViews.toLocaleString()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 120 }}>
              <ResponsiveContainer>
                <LineChart data={weekData}>
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 1, r: 3 }}
                  />
                  <XAxis 
                    dataKey="date" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Posts Compacto */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Posts Más Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 120 }}>
              <ResponsiveContainer>
                <BarChart data={topPostsData} layout="horizontal">
                  <Bar dataKey="views" fill="#3B82F6" radius={[0, 2, 2, 0]} />
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="title" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Esta Semana</span>
          </div>
          <div className="text-xl font-bold text-blue-900 mt-1">
            {totalWeekViews.toLocaleString()}
          </div>
          <div className="text-xs text-blue-700">vistas totales</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Post Top</span>
          </div>
          <div className="text-xl font-bold text-green-900 mt-1">
            {siteAnalytics.popularPosts[0]?.viewCount.toLocaleString() || 0}
          </div>
          <div className="text-xs text-green-700">vistas máximas</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Promedio</span>
          </div>
          <div className="text-xl font-bold text-purple-900 mt-1">
            {Math.round(totalWeekViews / 7).toLocaleString()}
          </div>
          <div className="text-xs text-purple-700">vistas/día</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Fuentes</span>
          </div>
          <div className="text-xl font-bold text-orange-900 mt-1">
            {siteAnalytics.topReferrers.length}
          </div>
          <div className="text-xs text-orange-700">diferentes</div>
        </div>
      </div>

      {/* Insights Rápidos */}
      {siteAnalytics.popularPosts.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">💡 Insight de la Semana</h4>
                <p className="text-sm text-gray-700">
                  Tu post <span className="font-semibold">&ldquo;{siteAnalytics.popularPosts[0].title}&rdquo;</span>{' '}
                  es el más popular con <span className="font-semibold">{siteAnalytics.popularPosts[0].viewCount}</span> vistas.{' '}
                  {siteAnalytics.topReferrers.length > 0 && (
                    <>La principal fuente de tráfico es <span className="font-semibold">{siteAnalytics.topReferrers[0].referer}</span>.</>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}