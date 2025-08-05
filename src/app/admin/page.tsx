import { Suspense } from 'react'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { AnalyticsStats } from '@/components/dashboard/AnalyticsStats'
import { CompactAnalyticsCharts } from '@/components/charts/CompactAnalyticsCharts'
import { RecentPosts } from '@/components/dashboard/RecentPosts'
import { PostsByStatus } from '@/components/dashboard/PostsByStatus'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="mt-2 text-gray-600">
            Welcome to your CMS dashboard. Here&apos;s an overview of your content.
          </p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<div>Loading analytics...</div>}>
        <AnalyticsStats />
      </Suspense>

      <Suspense fallback={<div>Loading charts...</div>}>
        <CompactAnalyticsCharts />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading recent posts...</div>}>
          <RecentPosts />
        </Suspense>
        
        <Suspense fallback={<div>Loading posts by status...</div>}>
          <PostsByStatus />
        </Suspense>
      </div>
    </div>
  )
} 