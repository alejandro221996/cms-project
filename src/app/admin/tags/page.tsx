'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Hash, Search, Edit, Trash2, FileText } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/trpc/client'
import { Tag } from '@/types'

function TagsClient() {
  const [search, setSearch] = useState('')
  const { data: tagsData, isLoading, error, refetch } = api.tag.getAll.useQuery({
    limit: 50,
    search: search || undefined
  })

  const deleteMutation = api.tag.delete.useMutation({
    onSuccess: () => {
      refetch()
    }
  })

  const tags = tagsData?.items || []

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el tag "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Error deleting tag:', error)
        alert('Error al eliminar el tag')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
            <p className="mt-2 text-gray-600">
              Gestiona las etiquetas del contenido
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/tags/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tag
            </Link>
          </Button>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
            <p className="mt-2 text-gray-600">
              Gestiona las etiquetas del contenido
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/tags/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tag
            </Link>
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">Error al cargar los tags</p>
          <Button onClick={() => refetch()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
          <p className="mt-2 text-gray-600">
            Gestiona las etiquetas del contenido
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tags/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Tag
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags Grid */}
      {tags.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Hash className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search ? 'No se encontraron tags' : 'No hay tags aún'}
            </h3>
            <p className="text-gray-600 mb-4">
              {search 
                ? 'Intenta con otros términos de búsqueda.' 
                : 'Comienza creando tu primer tag para organizar el contenido.'
              }
            </p>
            {!search && (
              <Button asChild>
                <Link href="/admin/tags/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primer Tag
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag: any) => (
            <Card key={tag.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    <CardTitle className="text-lg">{tag.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {tag._count?.posts || 0} posts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {tag.description || 'Sin descripción'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    /{tag.slug}
                  </span>
                  <span>
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/tags/${tag.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(tag.id, tag.name)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TagsPage() {
  return <TagsClient />
}