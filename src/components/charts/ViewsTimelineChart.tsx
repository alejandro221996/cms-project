'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

interface ViewsTimelineData {
  date: string
  views: number
  uniqueViews?: number
}

interface ViewsTimelineChartProps {
  data: ViewsTimelineData[]
  title?: string
  showUniqueViews?: boolean
  height?: number
}

export function ViewsTimelineChart({ 
  data, 
  title = "Vistas por Día", 
  showUniqueViews = false,
  height = 300 
}: ViewsTimelineChartProps) {
  // Formatear datos para el gráfico
  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    })
  }))

  // Calcular estadísticas
  const totalViews = data.reduce((sum, item) => sum + item.views, 0)
  const avgViews = Math.round(totalViews / data.length) || 0
  const maxViews = Math.max(...data.map(item => item.views))
  const minViews = Math.min(...data.map(item => item.views))

  // Calcular tendencia (últimos 7 días vs 7 días anteriores)
  const recentData = data.slice(-7)
  const previousData = data.slice(-14, -7)
  const recentAvg = recentData.reduce((sum, item) => sum + item.views, 0) / recentData.length
  const previousAvg = previousData.reduce((sum, item) => sum + item.views, 0) / previousData.length
  const trendPercentage = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ value: number }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Vistas: {payload[0].value}
          </p>
          {showUniqueViews && payload[1] && (
            <p className="text-green-600">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Únicas: {payload[1].value}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className={`h-4 w-4 ${trendPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={trendPercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
              {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalViews}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{avgViews}</div>
            <div className="text-xs text-gray-500">Promedio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{maxViews}</div>
            <div className="text-xs text-gray-500">Máximo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{minViews}</div>
            <div className="text-xs text-gray-500">Mínimo</div>
          </div>
        </div>

        {/* Gráfico */}
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {showUniqueViews && (
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              )}
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                name="Vistas Totales"
              />
              {showUniqueViews && (
                <Line 
                  type="monotone" 
                  dataKey="uniqueViews" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#10B981', strokeWidth: 2 }}
                  name="Vistas Únicas"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}