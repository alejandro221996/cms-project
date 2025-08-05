'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Image as ImageIcon, Search, X } from 'lucide-react'
import Image from 'next/image'

interface MediaSelectorProps {
  onSelect: (url: string) => void
  onClose: () => void
  isOpen: boolean
}

interface MediaFile {
  id: string
  url: string
  name: string
  type: string
}

export function MediaSelector({ onSelect, onClose, isOpen }: MediaSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  // Mock data - in a real app, this would come from an API
  const mediaFiles: MediaFile[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      name: 'profile-avatar.jpg',
      type: 'image/jpeg'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      name: 'hero-banner.png',
      type: 'image/png'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      name: 'code-screenshot.jpg',
      type: 'image/jpeg'
    }
  ]

  const filteredFiles = mediaFiles.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    file.type.startsWith('image/')
  )

  const handleSelect = (file: MediaFile) => {
    setSelectedFile(file)
  }

  const handleConfirm = () => {
    if (selectedFile) {
      onSelect(selectedFile.url)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" alt="" />
                Select Image
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedFile?.id === file.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelect(file)}
              >
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <Image
                    src={file.url}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                </div>
                {selectedFile?.id === file.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedFile}
            >
              Select Image
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 