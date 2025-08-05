'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

interface SEOFieldsProps {
  title: string
  content: string
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  ogImage?: string
  canonicalUrl?: string
  onChange: (seoData: {
    metaTitle?: string
    metaDescription?: string
    focusKeyword?: string
    ogImage?: string
    canonicalUrl?: string
  }) => void
}

export function SEOFields({
  title,
  content,
  metaTitle = '',
  metaDescription = '',
  focusKeyword = '',
  ogImage = '',
  canonicalUrl = '',
  onChange
}: SEOFieldsProps) {
  const [seoData, setSeoData] = useState({
    metaTitle,
    metaDescription,
    focusKeyword,
    ogImage,
    canonicalUrl
  })

  // Auto-generate meta title if empty
  const effectiveMetaTitle = seoData.metaTitle || title
  const effectiveMetaDescription = seoData.metaDescription || generateAutoDescription(content)

  useEffect(() => {
    onChange(seoData)
  }, [seoData, onChange])

  const updateSeoData = (field: string, value: string) => {
    setSeoData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Optimización SEO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meta Title */}
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Título SEO</Label>
          <Input
            id="metaTitle"
            value={seoData.metaTitle}
            onChange={(e) => updateSeoData('metaTitle', e.target.value)}
            placeholder={`${title} (auto-generado)`}
            maxLength={60}
          />
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">
              {seoData.metaTitle ? 'Personalizado' : 'Auto-generado del título'}
            </span>
            <span className={effectiveMetaTitle.length > 60 ? 'text-red-500' : 'text-gray-500'}>
              {effectiveMetaTitle.length}/60
            </span>
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Descripción</Label>
          <Textarea
            id="metaDescription"
            value={seoData.metaDescription}
            onChange={(e) => updateSeoData('metaDescription', e.target.value)}
            placeholder="Descripción que aparecerá en resultados de búsqueda..."
            rows={3}
            maxLength={160}
          />
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">
              {seoData.metaDescription ? 'Personalizada' : 'Auto-generada del contenido'}
            </span>
            <span className={effectiveMetaDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}>
              {effectiveMetaDescription.length}/160
            </span>
          </div>
        </div>

        {/* Focus Keyword */}
        <div className="space-y-2">
          <Label htmlFor="focusKeyword">Palabra Clave Principal</Label>
          <Input
            id="focusKeyword"
            value={seoData.focusKeyword}
            onChange={(e) => updateSeoData('focusKeyword', e.target.value)}
            placeholder="Ej: desarrollo web, marketing digital"
          />
          <p className="text-xs text-gray-500">
            Palabra clave principal para optimizar este contenido
          </p>
        </div>

        {/* OG Image */}
        <div className="space-y-2">
          <Label htmlFor="ogImage">Imagen Social (OG Image)</Label>
          <Input
            id="ogImage"
            value={seoData.ogImage}
            onChange={(e) => updateSeoData('ogImage', e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <p className="text-xs text-gray-500">
            Imagen que aparecerá al compartir en redes sociales
          </p>
        </div>

        {/* Canonical URL */}
        <div className="space-y-2">
          <Label htmlFor="canonicalUrl">URL Canónica</Label>
          <Input
            id="canonicalUrl"
            value={seoData.canonicalUrl}
            onChange={(e) => updateSeoData('canonicalUrl', e.target.value)}
            placeholder="https://ejemplo.com/post-original"
          />
          <p className="text-xs text-gray-500">
            URL original del contenido para evitar contenido duplicado
          </p>
        </div>

        {/* SEO Preview */}
        <div className="space-y-3">
          <Label>Vista Previa en Google</Label>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="space-y-1">
              <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                {effectiveMetaTitle}
              </div>
              <div className="text-green-700 text-sm">
                ejemplo.com › posts › slug-del-post
              </div>
              <div className="text-gray-700 text-sm">
                {effectiveMetaDescription}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Score */}
        <SEOScore 
          title={title}
          content={content}
          metaTitle={effectiveMetaTitle}
          metaDescription={effectiveMetaDescription}
          focusKeyword={seoData.focusKeyword}
        />
      </CardContent>
    </Card>
  )
}

function SEOScore({ 
  content, 
  metaTitle, 
  metaDescription, 
  focusKeyword 
}: {
  title: string
  content: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
}) {
  const checks = [
    {
      label: 'Título optimizado',
      passed: metaTitle.length >= 30 && metaTitle.length <= 60,
      description: 'Título entre 30-60 caracteres'
    },
    {
      label: 'Meta descripción optimizada',
      passed: metaDescription.length >= 120 && metaDescription.length <= 160,
      description: 'Descripción entre 120-160 caracteres'
    },
    {
      label: 'Palabra clave definida',
      passed: focusKeyword.length > 0,
      description: 'Palabra clave principal establecida'
    },
    {
      label: 'Palabra clave en título',
      passed: focusKeyword && metaTitle.toLowerCase().includes(focusKeyword.toLowerCase()),
      description: 'Palabra clave presente en el título'
    },
    {
      label: 'Contenido suficiente',
      passed: content.length >= 300,
      description: 'Al menos 300 caracteres de contenido'
    }
  ]

  const passedChecks = checks.filter(check => check.passed).length
  const score = Math.round((passedChecks / checks.length) * 100)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Puntuación SEO</Label>
        <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
          {score}/100
        </Badge>
      </div>
      <div className="space-y-2">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${check.passed ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={check.passed ? 'text-green-700' : 'text-red-700'}>
              {check.label}
            </span>
            <span className="text-gray-500 text-xs">- {check.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function generateAutoDescription(content: string): string {
  // Remove HTML tags and get first 160 characters
  const plainText = content.replace(/<[^>]*>/g, '').trim()
  return plainText.length > 160 
    ? plainText.substring(0, 157) + '...'
    : plainText
}