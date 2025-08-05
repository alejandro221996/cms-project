'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Bell, MessageCircle, FileText, User, Settings } from 'lucide-react'
import { showNotification } from '@/components/notifications/ToastContainer'

interface NotificationSettings {
  emailNotifications: boolean
  browserNotifications: boolean
  commentNotifications: boolean
  postNotifications: boolean
  userNotifications: boolean
  systemNotifications: boolean
  emailAddress: string
  notificationSchedule: 'immediate' | 'daily' | 'weekly'
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    browserNotifications: true,
    commentNotifications: true,
    postNotifications: true,
    userNotifications: false,
    systemNotifications: true,
    emailAddress: 'admin@example.com',
    notificationSchedule: 'immediate',
  })

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to the database
    showNotification(
      'Settings Saved',
      'Your notification preferences have been updated successfully.',
      'success'
    )
  }

  const handleTestNotification = () => {
    showNotification(
      'Test Notification',
      'This is a test notification to verify your settings.',
      'info',
      '/admin',
      'View Dashboard'
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure how you receive notifications and alerts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                <p className="text-sm text-gray-500">Show notifications in your browser</p>
              </div>
              <Switch
                id="browser-notifications"
                checked={settings.browserNotifications}
                onCheckedChange={(checked) => handleSettingChange('browserNotifications', checked)}
              />
            </div>

            <div>
              <Label htmlFor="email-address">Email Address</Label>
              <Input
                id="email-address"
                type="email"
                value={settings.emailAddress}
                onChange={(e) => handleSettingChange('emailAddress', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notification-schedule">Notification Schedule</Label>
              <select
                id="notification-schedule"
                value={settings.notificationSchedule}
                onChange={(e) => handleSettingChange('notificationSchedule', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Notification schedule"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <div>
                  <Label htmlFor="comment-notifications">Comment Notifications</Label>
                  <p className="text-sm text-gray-500">New comments on posts</p>
                </div>
              </div>
              <Switch
                id="comment-notifications"
                checked={settings.commentNotifications}
                onCheckedChange={(checked) => handleSettingChange('commentNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <div>
                  <Label htmlFor="post-notifications">Post Notifications</Label>
                  <p className="text-sm text-gray-500">New posts and updates</p>
                </div>
              </div>
              <Switch
                id="post-notifications"
                checked={settings.postNotifications}
                onCheckedChange={(checked) => handleSettingChange('postNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <div>
                  <Label htmlFor="user-notifications">User Notifications</Label>
                  <p className="text-sm text-gray-500">New user registrations</p>
                </div>
              </div>
              <Switch
                id="user-notifications"
                checked={settings.userNotifications}
                onCheckedChange={(checked) => handleSettingChange('userNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <div>
                  <Label htmlFor="system-notifications">System Notifications</Label>
                  <p className="text-sm text-gray-500">System updates and alerts</p>
                </div>
              </div>
              <Switch
                id="system-notifications"
                checked={settings.systemNotifications}
                onCheckedChange={(checked) => handleSettingChange('systemNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>Test Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Test your notification settings to make sure everything is working correctly.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleTestNotification}>
              Send Test Notification
            </Button>
            <Button variant="outline" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">New comment on &quot;Getting Started with Next.js&quot;</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Post &quot;Advanced TypeScript Patterns&quot; published</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">New user registration: john.doe@example.com</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 