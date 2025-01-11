'use client'

import { Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { WidgetFormat } from './WidgetFormatSelector'

interface BrowserPreviewProps {
  isOpen: boolean
  onClose: () => void
  widget: {
    format: WidgetFormat
    stories: string[]
  }
}

function WidgetPreview({ format, stories }: { format: WidgetFormat; stories: string[] }) {
  switch (format) {
    case 'bubble':
      return (
        <div className="flex gap-2 mb-8">
          {stories.map((_, index) => (
            <div 
              key={index}
              className="w-12 h-12 rounded-full bg-black/90 flex items-center justify-center shadow-lg hover:scale-105 transform transition-transform cursor-pointer"
            >
              <Eye className="w-5 h-5 text-white" />
            </div>
          ))}
        </div>
      )

    case 'sticky':
      return (
        <div className="absolute bottom-8 right-8">
          <div 
            className="w-14 h-14 rounded-full bg-black/90 flex items-center justify-center shadow-lg hover:scale-[1.02] transform transition-transform cursor-pointer"
          >
            <Eye className="w-6 h-6 text-white" />
          </div>
        </div>
      )

    case 'iframe':
      return (
        <div className="absolute bottom-8 right-8 w-[320px] h-[500px] bg-black/90 rounded-xl shadow-lg hover:scale-[1.02] transform transition-transform cursor-pointer">
          <div className="w-full h-full flex items-center justify-center">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>
      )

    case 'card':
    case 'square':
      const isSquare = format === 'square'
      return (
        <div className="mb-8">
          <div className={isSquare ? "flex gap-2" : "flex gap-4 overflow-x-auto pb-2"}>
            {stories.map((_, index) => (
              <div 
                key={index}
                className={`${isSquare ? 'w-[160px] aspect-square rounded-xl' : 'flex-none w-[180px] aspect-[3/4] rounded-2xl'} 
                  bg-black/90 flex items-center justify-center shadow-lg hover:scale-[1.02] transform transition-transform cursor-pointer`}
              >
                <Eye className={`${isSquare ? 'w-5 h-5' : 'w-8 h-8'} text-white`} />
              </div>
            ))}
          </div>
        </div>
      )
  }
}

export default function BrowserPreview({ isOpen, onClose, widget }: BrowserPreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted || !isOpen) return null

  const modal = (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Browser Window */}
      <div className="absolute inset-4 lg:inset-12">
        <div 
          className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Browser Chrome */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              {/* Window Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onClose()
                  }}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              {/* URL Bar */}
              <div className="flex-1 mx-4">
                <div className="h-7 bg-white rounded-lg flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="flex-1 h-3 bg-gray-200 rounded-full" />
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="absolute inset-0 top-[49px] bg-white overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Product Section */}
              <div className="grid grid-cols-2 gap-12">
                {/* Left Column - Product Images */}
                <div className="animate-pulse space-y-4">
                  <div className="aspect-square bg-gray-200 rounded-xl" />
                  <div className="grid grid-cols-4 gap-4">
                    <div className="aspect-square bg-gray-100 rounded-lg" />
                    <div className="aspect-square bg-gray-100 rounded-lg" />
                    <div className="aspect-square bg-gray-100 rounded-lg" />
                    <div className="aspect-square bg-gray-100 rounded-lg" />
                  </div>
                </div>
                
                {/* Right Column - Product Info */}
                <div>
                  {/* Title and Price - Animated */}
                  <div className="animate-pulse">
                    <div className="space-y-4 mb-6">
                      <div className="w-3/4 h-8 bg-gray-200 rounded" />
                      <div className="w-1/2 h-6 bg-gray-100 rounded" />
                    </div>
                  </div>
                  
                  {/* Widget Preview - No Animation */}
                  <WidgetPreview format={widget.format} stories={widget.stories} />
                  
                  {/* Price and Add to Cart - Animated */}
                  <div className="animate-pulse">
                    <div className="space-y-4">
                      <div className="w-1/3 h-12 bg-gray-200 rounded" />
                      <div className="w-1/4 h-4 bg-gray-100 rounded" />
                      <div className="w-full h-24 bg-gray-100 rounded" />
                      <div className="flex gap-4">
                        <div className="flex-1 h-12 bg-gray-200 rounded" />
                        <div className="w-12 h-12 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
} 