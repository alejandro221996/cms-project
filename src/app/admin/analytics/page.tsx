'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ViewsTimelineChart } from '@/components/charts/ViewsTimelineChart'
import { PopularPostsChart } from '@/components/charts/PopularPostsChart'
import { ReferrersChart } from '@/components/charts/ReferrersChart'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react'
import { api } from '@/lib/trpc/client'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState(30) // días
  
  // Cargar datos de analytics
  const { data: siteAnalytics, isLoading: loadingSite, refetch: refetchSite } = api.analytics.getSiteAnalytics.useQuery({
    days: timeRange
  })

  const { data: dashboardStats, isLoading: loadingStats, refetch: refetchStats } = api.analytics.getDashboardStats.useQuery()

  const isLoading = loadingSite || loadingStats

  const handleRefresh = () => {
    refetchSite()
    refetchStats()
  }

  const timeRangeOptions = [
    { label: '7 días', value: 7 },
    { label: '30 días', value: 30 },
    { label: '90 días', value: 90 }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-2 text-gray-600">
              Análisis detallado del rendimiento de tu contenido
            </p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        
        {/* Skeleton loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            Análisis detallado del rendimiento de tu contenido
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            {timeRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vistas Totales
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {siteAnalytics?.viewsInPeriod?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Últimos {timeRange} días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Visitantes Únicos
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {siteAnalytics?.uniqueViewsInPeriod?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Únicos en {timeRange} días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vistas Hoy
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardStats?.viewsToday?.toLocaleString() || 0}
            </div>
            <div className="flex items-center mt-1">
              <TrendingUp className={`h-3 w-3 mr-1 ${
                (dashboardStats?.growthPercentage || 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className={`text-xs ${
                (dashboardStats?.growthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(dashboardStats?.growthPercentage || 0) >= 0 ? '+' : ''}{(dashboardStats?.growthPercentage || 0).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Posts Activos
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardStats?.publishedPosts || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Posts publicados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Post Top Hoy */}
      {dashboardStats?.topPostToday && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔥 Post Trending Hoy
              <Badge variant="secondary">
                {dashboardStats.topPostToday.viewsToday} vistas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  {dashboardStats.topPostToday.title}
                </h3>
                <p className="text-sm text-gray-500">
                  /{dashboardStats.topPostToday.slug}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {dashboardStats.topPostToday.viewCount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">vistas totales</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráficos Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div className="xl:col-span-2">
          <ViewsTimelineChart 
            data={siteAnalytics?.viewsByDay || []}
            title={`Evolución de Vistas - Últimos ${timeRange} días`}
            showUniqueViews={true}
            height={350}
          />
        </div>

        {/* Popular Posts Chart */}
        <PopularPostsChart 
          data={siteAnalytics?.popularPosts || []}
          title="Posts Más Populares"
          limit={8}
          height={450}
        />

        {/* Referrers Chart */}
        <ReferrersChart 
          data={siteAnalytics?.topReferrers || []}
          title="Fuentes de Tráfico"
          height={450}
        />
      </div>

      {/* Insights y Recomendaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💡 Insights Automáticos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {siteAnalytics && (
              <>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Promedio diario:</span>{' '}
                    {Math.round((siteAnalytics.viewsInPeriod || 0) / timeRange).toLocaleString()} vistas
                  </p>
                </div>
                
                {siteAnalytics.popularPosts && siteAnalytics.popularPosts.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">Post líder:</span>{' '}
                      &ldquo;{siteAnalytics.popularPosts[0].title}&rdquo; con{' '}
                      {siteAnalytics.popularPosts[0].viewCount.toLocaleString()} vistas
                    </p>
                  </div>
                )}
                
                {siteAnalytics.topReferrers && siteAnalytics.topReferrers.length > 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <span className="font-semibold">Principal fuente:</span>{' '}
                      {siteAnalytics.topReferrers[0].referer} ({siteAnalytics.topReferrers[0].count} visitas)
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">SEO:</span> Optimiza los títulos de tus posts más populares para maximizar el tráfico orgánico.
              </p>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <span className="font-semibold">Contenido:</span> Crea más posts similares a los que tienen mejor rendimiento.
              </p>
            </div>
            
            <div className="p-3 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-800">
                <span className="font-semibold">Social:</span> Comparte tu contenido en las fuentes que generan más tráfico.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}