'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { NotificationButton } from '@/components/notifications/NotificationButton'
import { User, Settings, Bell, Palette, LogOut, Layout } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 lg:hidden">CMS</h1>
          <h1 className="text-xl font-semibold text-gray-900 hidden lg:block">CMS Admin</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationButton />
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{session?.user?.name || 'Admin'}</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Configuración</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings/notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificaciones
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings/themes" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Temas
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings/layout" className="flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    Layout
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings/general" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración General
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 