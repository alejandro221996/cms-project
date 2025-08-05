'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  className?: string
}

const presetColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
  '#14B8A6', '#F43F5E', '#22C55E', '#EAB308', '#A855F7',
  '#0EA5E9', '#65A30D', '#EA580C', '#DB2777', '#4F46E5',
]

export function ColorPicker({ label, value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-12 h-10 p-0 border-2"
              style={{ backgroundColor: value }}
            >
              <Palette className="h-4 w-4 text-white drop-shadow-sm" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Preset Colors</Label>
                <div className="grid grid-cols-10 gap-2 mt-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        onChange(color)
                        setIsOpen(false)
                      }}
                    >
                      {value === color && (
                        <Check className="h-4 w-4 text-white m-auto drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Custom Color</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-10 p-1 border-2 border-gray-200 rounded"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  )
} 