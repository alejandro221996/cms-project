'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ToastProps {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  onClose: (id: string) => void
  actionUrl?: string
  actionText?: string
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

const styles = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
}

export function Toast({ 
  id, 
  title, 
  message, 
  type, 
  duration = 5000, 
  onClose, 
  actionUrl, 
  actionText 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = icons[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Wait for animation
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(id), 300)
  }

  const handleAction = () => {
    if (actionUrl) {
      window.open(actionUrl, '_blank')
    }
    handleClose()
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 w-96 max-w-sm transform transition-all duration-300 ease-in-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className={cn(
        'rounded-lg border p-4 shadow-lg',
        styles[type]
      )}>
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{title}</h4>
            {message && (
              <p className="text-sm mt-1 opacity-90">{message}</p>
            )}
            
            {actionUrl && actionText && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAction}
                className="mt-2 text-xs"
              >
                {actionText}
              </Button>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 