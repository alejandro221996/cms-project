'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Palette, Shield, Database, Globe, Users } from 'lucide-react'
import Link from 'next/link'

const settingsCategories = [
  {
    title: 'Notifications',
    description: 'Configure how you receive notifications and alerts',
    icon: Bell,
    href: '/admin/settings/notifications',
    color: 'bg-blue-500',
  },
  {
    title: 'Themes & Customization',
    description: 'Customize your site appearance and branding',
    icon: Palette,
    href: '/admin/settings/themes',
    color: 'bg-purple-500',
  },
  {
    title: 'Security',
    description: 'Manage authentication and security settings',
    icon: Shield,
    href: '/admin/settings/security',
    color: 'bg-red-500',
  },
  {
    title: 'Database',
    description: 'Database configuration and maintenance',
    icon: Database,
    href: '/admin/settings/database',
    color: 'bg-green-500',
  },
  {
    title: 'General',
    description: 'General site settings and preferences',
    icon: Globe,
    href: '/admin/settings/general',
    color: 'bg-yellow-500',
  },
  {
    title: 'User Management',
    description: 'Manage user roles and permissions',
    icon: Users,
    href: '/admin/settings/users',
    color: 'bg-indigo-500',
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your CMS settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => {
          const Icon = category.icon
          return (
            <Link key={category.title} href={category.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Export Settings
            </Button>
            <Button variant="outline" size="sm">
              Import Settings
            </Button>
            <Button variant="outline" size="sm">
              Reset to Default
            </Button>
            <Button variant="outline" size="sm">
              Backup Database
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 