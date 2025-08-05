'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ExternalLink, Globe } from 'lucide-react'

interface ReferrerData {
  referer: string
  count: number
}

interface ReferrersChartProps {
  data: ReferrerData[]
  title?: string
  height?: number
}

// Colores para el gráfico circular
const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280'  // Gray
]

export function ReferrersChart({ 
  data, 
  title = "Fuentes de Tráfico",
  height = 350 
}: ReferrersChartProps) {
  // Procesar datos para el gráfico
  const totalReferrals = data.reduce((sum, item) => sum + item.count, 0)
  
  // Agrupar referrers pequeños en "Otros"
  const threshold = totalReferrals * 0.02 // 2% threshold
  const mainReferrers: ReferrerData[] = []
  let othersCount = 0

  data.forEach(item => {
    if (item.count >= threshold && mainReferrers.length < 8) {
      mainReferrers.push(item)
    } else {
      othersCount += item.count
    }
  })

  if (othersCount > 0) {
    mainReferrers.push({
      referer: 'Otros',
      count: othersCount
    })
  }

  // Calcular percentajes
  const chartData = mainReferrers.map(item => ({
    ...item,
    percentage: ((item.count / totalReferrals) * 100).toFixed(1)
  }))

  const formatReferer = (referer: string) => {
    if (referer === 'Direct' || referer === 'Directo') return 'Directo'
    if (referer === 'Otros') return 'Otros'
    
    try {
      const url = new URL(referer.startsWith('http') ? referer : `https://${referer}`)
      return url.hostname.replace('www.', '')
    } catch {
      return referer.length > 20 ? referer.substring(0, 20) + '...' : referer
    }
  }

  const CustomTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{ payload: { referer: string, count: number, percentage: string } }>
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">
            {formatReferer(data.referer)}
          </p>
          <p className="text-blue-600">
            <span className="font-semibold">{data.count}</span> visitas ({data.percentage}%)
          </p>
          {data.referer !== 'Direct' && data.referer !== 'Directo' && data.referer !== 'Otros' && (
            <p className="text-gray-500 text-xs mt-1 break-all">
              {data.referer}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: {
    cx?: number
    cy?: number
    midAngle?: number
    innerRadius?: number
    outerRadius?: number
    percentage?: string
  }) => {
    if (parseFloat(percentage) < 5) return null // No mostrar labels para segmentos pequeños
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="600"
      >
        {`${percentage}%`}
      </text>
    )
  }

  // Top 3 referrers para destacar
  const topReferrers = chartData
    .filter(item => item.referer !== 'Otros')
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {topReferrers.map((referrer, index) => (
            <div key={referrer.referer} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                #{index + 1}
              </div>
              <div className="text-sm font-medium text-gray-700">
                {formatReferer(referrer.referer)}
              </div>
              <div className="text-xs text-gray-500">
                {referrer.count} visitas ({referrer.percentage}%)
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico Circular */}
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: { color: string, payload: { percentage: string } }) => (
                  <span style={{ color: entry.color }}>
                    {formatReferer(value)} ({entry.payload.percentage}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lista Detallada */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Detalles por Fuente
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {chartData.map((referrer, index) => (
              <div key={referrer.referer} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatReferer(referrer.referer)}
                    </div>
                    {referrer.referer !== 'Direct' && referrer.referer !== 'Directo' && referrer.referer !== 'Otros' && (
                      <div className="text-xs text-gray-500 truncate max-w-48">
                        {referrer.referer}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {referrer.count}
                  </div>
                  <div className="text-xs text-gray-500">
                    {referrer.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <span className="font-semibold">{totalReferrals.toLocaleString()}</span> visitas totales desde{' '}
            <span className="font-semibold">{data.length}</span> fuentes diferentes
          </div>
        </div>
      </CardContent>
    </Card>
  )
}