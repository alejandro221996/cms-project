'use client'

import { useState } from 'react'
import { Bell, X, Check, Trash2, MessageCircle, FileText, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNotificationStore, type Notification } from '@/store/useNotificationStore'
import { cn } from '@/lib/utils'
import React from 'react'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'comment':
      return MessageCircle
    case 'post':
      return FileText
    case 'user':
      return User
    case 'system':
      return Settings
    default:
      return Bell
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'info':
      return 'bg-blue-100 text-blue-800'
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore()
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  const handleMarkAsRead = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="absolute top-16 right-4 w-96 max-h-[80vh] bg-white rounded-lg shadow-xl border"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={activeTab === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('unread')}
              >
                Unread ({unreadCount})
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">
                    {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer',
                        !notification.read && 'bg-blue-50'
                      )}
                      onClick={() => handleMarkAsRead(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            getNotificationColor(notification.type)
                          )}>
                            {React.createElement(getNotificationIcon(notification.type), {
                              className: 'h-4 w-4'
                            })}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.actionUrl && notification.actionText && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(notification.actionUrl, '_blank')
                              }}
                            >
                              {notification.actionText}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark all as read
                  </Button>
                  
                  <span className="text-xs text-gray-500">
                    {unreadCount} unread
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 