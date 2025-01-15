'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { WidgetFormat } from './WidgetFormatSelector'
import { Story } from './StoriesList'
import StoryStyle from '@/components/StoryStyle'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { useWidgetStories } from '@/hooks/useWidgetStories'
import WidgetStyle from './widgets/WidgetStyle'

interface BrowserPreviewProps {
  isOpen: boolean
  onClose: () => void
  widget: {
    format: WidgetFormat
    story_ids: string[]
  }
  stories?: Story[]
}

function ProductSkeleton({ 
  widget, 
  stories,
  selectedStory,
  onStorySelect
}: { 
  widget: { format: WidgetFormat; story_ids: string[] }
  stories?: Story[]
  selectedStory: Story | null
  onStorySelect: (story: Story | null) => void
}) {
  const getWidgetPosition = () => {
    switch (widget.format) {
      case 'sticky':
        return 'absolute bottom-8 right-8 z-50'
      case 'iframe':
        return 'absolute right-8 bottom-8 z-50'
      default:
        return ''
    }
  }

  const isInlineWidget = ['bubble', 'card', 'square'].includes(widget.format)
  const isFixedWidget = ['sticky', 'iframe'].includes(widget.format)

  return (
    <div className="relative h-full bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Product Images */}
          <div className="w-full lg:w-1/2 space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200" />
              {/* Thumbnails on mobile - absolute positioned circles */}
              <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/80 backdrop-blur shadow-sm" />
                ))}
              </div>
            </div>
            
            {/* Thumbnail Grid - desktop only */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="w-full lg:w-1/2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <div className="w-16 h-3 bg-gray-200 rounded" />
              <span>/</span>
              <div className="w-24 h-3 bg-gray-200 rounded" />
              <span>/</span>
              <div className="w-32 h-3 bg-gray-200 rounded" />
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              <div className="w-3/4 h-8 bg-gray-200 rounded" />
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <div className="w-24 h-7 bg-gray-200 rounded" />
              <div className="w-16 h-5 bg-gray-100 rounded line-through" />
            </div>

            {/* Description */}
            <div className="space-y-3 mb-8">
              <div className="w-full h-4 bg-gray-100 rounded" />
              <div className="w-5/6 h-4 bg-gray-100 rounded" />
              <div className="w-4/6 h-4 bg-gray-100 rounded" />
            </div>

            {/* Widget Preview - Formats intégrés (bubble, card, square) */}
            {isInlineWidget && (
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 mb-8">
                <WidgetStyle 
                  format={widget.format}
                  stories={stories}
                  onStoryClick={onStorySelect}
                />
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex items-center gap-4 mb-8">
              <button className="flex-1 h-14 px-8 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-3 text-lg font-medium hover:bg-gray-800 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span>Add to Cart</span>
              </button>
              <button className="h-14 w-14 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="h-14 w-14 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-600 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                <div className="w-2/3 h-4 bg-gray-100 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                <div className="w-3/4 h-4 bg-gray-100 rounded" />
              </div>
            </div>

            {/* Shipping Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="w-2/3 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formats fixes (sticky, iframe) */}
      {isFixedWidget && (
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <WidgetStyle 
              format={widget.format}
              stories={stories}
              onStoryClick={onStorySelect}
              className={`${getWidgetPosition()} pointer-events-auto`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function BrowserPreview({ isOpen, onClose, widget, stories }: BrowserPreviewProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

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
        onClick={() => {
          if (selectedStory) {
            setSelectedStory(null)
          } else {
            onClose()
          }
        }}
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
                  onClick={onClose}
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
            <ProductSkeleton 
              widget={widget} 
              stories={stories}
              selectedStory={selectedStory}
              onStorySelect={setSelectedStory}
            />
          </div>

          {/* Story Preview Modal */}
          {selectedStory && (
            <StoryStyle
              variant="preview"
              items={selectedStory.content ? JSON.parse(selectedStory.content).mediaItems : []}
              profileImage={selectedStory.profile_image}
              profileName={selectedStory.profile_name}
              onComplete={() => setSelectedStory(null)}
              className="!bg-black/60 !backdrop-blur-none !z-[70]"
            />
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
} 