'use client'

import { useLayoutConfig } from '@/hooks/useLayoutConfig'
import Link from 'next/link'

export function DynamicFooter() {
  const { layoutConfig, isLoading } = useLayoutConfig()

  if (isLoading || !layoutConfig) {
    return (
      <footer className="bg-gray-100 border-t border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-600">
            <p>© 2024 CMS Admin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }

  const { footer } = layoutConfig

  return (
    <footer 
      className="border-t px-6 py-8"
      style={{
        backgroundColor: footer.backgroundColor,
        color: footer.textColor,
        borderColor: footer.backgroundColor === '#f8f9fa' ? '#e5e7eb' : 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Links */}
          {footer.links.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                {footer.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.url}
                      target={link.external ? '_blank' : '_self'}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Media */}
          {footer.socialMedia.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Redes Sociales</h3>
              <div className="flex gap-4">
                {footer.socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm">{footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
} 