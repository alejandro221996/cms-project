'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, TrendingUp, TrendingDown, Hash } from 'lucide-react'
import { api } from '@/lib/trpc/client'

export function AnalyticsStats() {
  const { data: stats, isLoading, error } = api.analytics.getDashboardStats.useQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">Error al cargar estadísticas</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const growthIcon = stats.growthPercentage >= 0 ? TrendingUp : TrendingDown
  const growthColor = stats.growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'

  const statCards = [
    {
      title: 'Vistas Hoy',
      value: stats.viewsToday,
      icon: Eye,
      description: 'Vistas totales de hoy',
      growth: stats.growthPercentage,
      showGrowth: true,
    },
    {
      title: 'Vistas Ayer',
      value: stats.viewsYesterday,
      icon: Eye,
      description: 'Comparación con hoy',
      growth: null,
      showGrowth: false,
    },
    {
      title: 'Posts Publicados',
      value: stats.publishedPosts,
      icon: Hash,
      description: 'Contenido activo',
      growth: null,
      showGrowth: false,
    },
    {
      title: 'Tags Totales',
      value: stats.totalTags,
      icon: Hash,
      description: 'Etiquetas disponibles',
      growth: null,
      showGrowth: false,
    },
    {
      title: 'Post Top Hoy',
      value: stats.topPostToday?.viewsToday || 0,
      icon: TrendingUp,
      description: stats.topPostToday?.title?.substring(0, 30) + '...' || 'Sin actividad',
      growth: null,
      showGrowth: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics en Tiempo Real</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat) => {
            const IconComponent = stat.icon
            
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 mt-1 flex-1 truncate">
                      {stat.description}
                    </p>
                    {stat.showGrowth && stat.growth !== null && (
                      <div className={`flex items-center text-xs ${growthColor} ml-2`}>
                        {React.createElement(growthIcon, { className: "h-3 w-3 mr-1" })}
                        {Math.abs(stat.growth).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Post Top Info */}
      {stats.topPostToday && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔥 Post Más Popular Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{stats.topPostToday.title}</h3>
                <p className="text-sm text-gray-500">/{stats.topPostToday.slug}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.topPostToday.viewsToday}
                </div>
                <p className="text-xs text-gray-500">vistas hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Fix para el uso de React.createElement
import React from 'react'