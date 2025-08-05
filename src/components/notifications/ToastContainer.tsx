'use client'

import { useEffect, useState } from 'react'
import { Toast } from './Toast'
import { useNotificationStore } from '@/store/useNotificationStore'

export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    actionUrl?: string
    actionText?: string
  }>>([])

  const { addNotification } = useNotificationStore()

  // Listen for new notifications and show them as toasts
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent) => {
      const { title, message, type, actionUrl, actionText } = event.detail
      
      // Add to notification store
      addNotification({
        title,
        message,
        type,
        actionUrl,
        actionText,
      })

      // Show as toast
      const toastId = Math.random().toString(36).substr(2, 9)
      setToasts(prev => [...prev, {
        id: toastId,
        title,
        message,
        type,
        actionUrl,
        actionText,
      }])
    }

    window.addEventListener('show-notification', handleNewNotification as EventListener)
    
    return () => {
      window.removeEventListener('show-notification', handleNewNotification as EventListener)
    }
  }, [addNotification])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ transform: `translateY(${index * 80}px)` }}
        >
          <Toast
            {...toast}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  )
}

// Utility function to show notifications
export const showNotification = (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  actionUrl?: string,
  actionText?: string
) => {
  const event = new CustomEvent('show-notification', {
    detail: { title, message, type, actionUrl, actionText }
  })
  window.dispatchEvent(event)
} 