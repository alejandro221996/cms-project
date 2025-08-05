'use client'

import { useState, useEffect } from 'react'
import { MediaUploader } from '@/components/media/MediaUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Image as ImageIcon, Video, FileText, Search, Grid, List, Download, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface MediaFile {
  id: string
  url: string
  name: string
  size: number
  type: string
  uploadedAt: string
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos' | 'documents'>('all')

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockFiles: MediaFile[] = [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        name: 'profile-avatar.jpg',
        size: 1024000,
        type: 'image/jpeg',
        uploadedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
        name: 'hero-banner.png',
        size: 2048000,
        type: 'image/png',
        uploadedAt: '2024-01-14T15:45:00Z'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        name: 'code-screenshot.jpg',
        size: 1536000,
        type: 'image/jpeg',
        uploadedAt: '2024-01-13T09:20:00Z'
      }
    ]
    setMediaFiles(mockFiles)
  }, [])

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || 
      (filterType === 'images' && file.type.startsWith('image/')) ||
      (filterType === 'videos' && file.type.startsWith('video/')) ||
      (filterType === 'documents' && file.type === 'application/pdf')
    
    return matchesSearch && matchesType
  })

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />
    if (type === 'application/pdf') return <FileText className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUploadComplete = (urls: string[]) => {
    // In a real app, you would save these URLs to your database
    console.log('Uploaded URLs:', urls)
  }

  const handleDeleteFile = (fileId: string) => {
    setMediaFiles(prev => prev.filter(file => file.id !== fileId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="mt-2 text-gray-600">
            Manage your uploaded files and media
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <MediaUploader 
        onUploadComplete={handleUploadComplete}
        multiple={true}
        accept="media"
        maxFiles={20}
      />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Media Files ({filteredFiles.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'images' | 'videos' | 'documents')}
              className="px-3 py-2 border border-gray-300 rounded-md"
              aria-label="Filter by file type"
            >
              <option value="all">All Types</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="documents">Documents</option>
            </select>
          </div>

          {/* Media Grid/List */}
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'Upload some files to get started.'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4'
            }>
              {filteredFiles.map((file) => (
                <div key={file.id} className="group relative">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <span className="text-sm font-medium truncate">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {file.type.startsWith('image/') ? (
                        <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-3">
                          <Image
                            src={file.url}
                            alt={file.name}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-3">
                          <div className="flex items-center justify-center">
                            {getFileIcon(file.type)}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1 text-xs text-gray-500">
                        <p>{formatFileSize(file.size)}</p>
                        <p>{new Date(file.uploadedAt).toLocaleDateString()}</p>
                      </div>

                      <input
                        type="text"
                        value={file.url}
                        readOnly
                        className="w-full text-xs bg-gray-50 border rounded px-2 py-1 mt-2"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        aria-label="File URL"
                        title="Click to copy URL"
                      />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 