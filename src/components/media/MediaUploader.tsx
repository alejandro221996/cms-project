'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
// import { useUploadThing } from '@/lib/uploadthing-hook'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, File, Video, FileText } from 'lucide-react'
import Image from 'next/image'

interface MediaUploaderProps {
  onUploadComplete?: (urls: string[]) => void
  multiple?: boolean
  accept?: 'images' | 'media' | 'all'
  maxFiles?: number
}

interface UploadedFile {
  url: string
  name: string
  size: number
  type: string
}

export function MediaUploader({ 
  onUploadComplete, 
  multiple = true, 
  accept = 'images',
  maxFiles = 10 
}: MediaUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Simulated upload for development
  const startUpload = async (files: File[]) => {
    setIsUploading(true)
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newFiles = files.map((file, index) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      }))
      
      setUploadedFiles(prev => [...prev, ...newFiles])
      onUploadComplete?.(newFiles.map(f => f.url))
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }
  
  const isUploadThingUploading = false

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)
      await startUpload(acceptedFiles)
    },
    [startUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles,
    accept: accept === 'images' ? {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    } : {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'application/pdf': ['.pdf']
    }
  })

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" alt="" />
    if (type.startsWith('video/')) return <Video className="h-4 w-4" alt="" />
    if (type === 'application/pdf') return <FileText className="h-4 w-4" alt="" />
    return <File className="h-4 w-4" alt="" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Media
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg font-medium text-blue-600">
                Drop the files here...
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  {accept === 'images' 
                    ? 'Images (PNG, JPG, GIF, WebP) up to 4MB'
                    : 'Images, videos, and PDFs up to 100MB'
                  }
                </p>
                <Button className="mt-4" variant="outline">
                  Select Files
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {(isUploading || isUploadThingUploading) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Uploading files...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="text-sm font-medium truncate">
                          {file.name}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {file.type.startsWith('image/') ? (
                      <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={file.url}
                          alt={file.name}
                          width={200}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      {formatFileSize(file.size)}
                    </p>
                    
                    <input
                      type="text"
                      value={file.url}
                      readOnly
                      className="w-full text-xs bg-gray-50 border rounded px-2 py-1 mt-2"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      aria-label="File URL"
                      title="Click to copy URL"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 