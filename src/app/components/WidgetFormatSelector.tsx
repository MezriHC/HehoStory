'use client'

import { useState } from 'react'

export type WidgetFormat = 'bubble' | 'card' | 'square'

interface WidgetFormatSelectorProps {
  value: WidgetFormat | null
  onChange: (format: WidgetFormat) => void
}

function FormatVisual({ type, isSelected }: { type: WidgetFormat; isSelected: boolean }) {
  const renderWidget = () => {
    switch (type) {
      case 'bubble':
        return (
          <div className="flex items-center gap-2">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3.5 h-3.5 rounded-full transition-colors duration-200
                  ${isSelected ? 'bg-gray-600' : 'bg-gray-200 group-hover:bg-gray-300'}`} 
              />
            ))}
          </div>
        )
      case 'card':
        return (
          <div className="flex items-start gap-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`w-[22px] h-[32px] rounded transition-colors duration-200
                  ${isSelected ? 'bg-gray-600' : 'bg-gray-200 group-hover:bg-gray-300'}`} 
              />
            ))}
          </div>
        )
      case 'square':
        return (
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`w-5 h-5 rounded transition-colors duration-200
                  ${isSelected ? 'bg-gray-600' : 'bg-gray-200 group-hover:bg-gray-300'}`} 
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="aspect-[4/3] w-full bg-white rounded-lg relative shadow-sm overflow-hidden">
      {/* Header */}
      <div className="h-5 border-b border-gray-100 mx-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded bg-gray-200" />
          <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-1.5 bg-gray-200 rounded-full" />
          <div className="w-5 h-1.5 bg-gray-200 rounded-full" />
          <div className="w-2.5 h-2.5 rounded bg-gray-200" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Product image */}
          <div className="space-y-2">
            {/* Main image */}
            <div className="aspect-square bg-gray-100 rounded relative">
              {/* Image navigation dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-gray-400' : 'bg-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            {/* Thumbnail carousel */}
            <div className="flex gap-1.5 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-8 aspect-square flex-shrink-0 rounded bg-gray-100" />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col py-1">
            {/* Title and Description */}
            <div className="space-y-1.5">
              <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
              <div className="w-2/3 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Description lines */}
            <div className="space-y-1 mt-3">
              <div className="w-full h-1 bg-gray-100 rounded-full" />
              <div className="w-full h-1 bg-gray-100 rounded-full" />
              <div className="w-2/3 h-1 bg-gray-100 rounded-full" />
            </div>

            {/* Widget Display */}
            <div className="mt-3">
              {renderWidget()}
            </div>

            {/* Add to Cart */}
            <div className="mt-3 space-y-1">
              <div className="h-5 bg-gray-200 rounded" />
              <div className="flex gap-1">
                <div className="h-1 flex-1 bg-gray-100 rounded-full" />
                <div className="h-1 flex-1 bg-gray-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const formats: { type: WidgetFormat; label: string; description: string }[] = [
  { 
    type: 'bubble', 
    label: 'Bubble Stories',
    description: 'A row of circular story bubbles, perfect for minimal interfaces'
  },
  { 
    type: 'card', 
    label: 'Story Cards',
    description: 'Vertical story cards that showcase more content'
  },
  { 
    type: 'square', 
    label: 'Square Grid',
    description: 'Clean square tiles that fit any layout'
  }
]

export default function WidgetFormatSelector({ value, onChange }: WidgetFormatSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {formats.map((format) => (
        <button
          key={format.type}
          onClick={() => onChange(format.type)}
          className={`
            group relative transition-all duration-200
            ${value === format.type ? 'scale-[1.02]' : ''}
          `}
        >
          {/* Card background */}
          <div className={`
            absolute inset-0 rounded-2xl transition-all duration-200 bg-white
            ${value === format.type
              ? 'border-[3px] border-gray-600'
              : 'border-2 border-gray-200 group-hover:border-gray-300'}
          `} />

          <div className="relative p-4">
            {/* Format preview */}
            <div className="mb-4">
              <FormatVisual type={format.type} isSelected={value === format.type} />
            </div>

            {/* Format info */}
            <div className="text-left">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900">
                  {format.label}
                </h3>
                <div className={`
                  w-4 h-4 rounded-full border-2 transition-colors duration-200
                  ${value === format.type
                    ? 'border-gray-600 bg-gray-600'
                    : 'border-gray-300 group-hover:border-gray-400'}
                `} />
              </div>
              <p className="text-sm text-gray-500">
                {format.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
} 