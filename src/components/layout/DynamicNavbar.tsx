'use client'

import { useLayoutConfig } from '@/hooks/useLayoutConfig'
import Link from 'next/link'
import Image from 'next/image'

export function DynamicNavbar() {
  const { layoutConfig, isLoading } = useLayoutConfig()

  if (isLoading || !layoutConfig) {
    return (
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">CMS Admin</h1>
          </div>
        </div>
      </nav>
    )
  }

  const { navbar } = layoutConfig

  return (
    <nav 
      className="border-b px-6 py-4"
      style={{
        backgroundColor: navbar.backgroundColor,
        color: navbar.textColor,
        borderColor: navbar.backgroundColor === '#ffffff' ? '#e5e7eb' : 'transparent'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {navbar.logo && (
            <div className="flex items-center">
              <Image
                src={navbar.logo}
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          )}
          <h1 className="text-xl font-semibold">{layoutConfig.header.title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {navbar.showSearch && (
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: navbar.backgroundColor === '#ffffff' ? '#f9fafb' : 'rgba(255,255,255,0.1)',
                  borderColor: navbar.backgroundColor === '#ffffff' ? '#d1d5db' : 'rgba(255,255,255,0.2)',
                  color: navbar.textColor
                }}
              />
            </div>
          )}
          
          {navbar.menuItems.length > 0 && (
            <div className="hidden md:flex items-center gap-6">
              {navbar.menuItems.map((item: { url: string; label: string; external: boolean }, index: number) => (
                <Link
                  key={index}
                  href={item.url}
                  target={item.external ? '_blank' : '_self'}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="hover:opacity-80 transition-opacity"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 