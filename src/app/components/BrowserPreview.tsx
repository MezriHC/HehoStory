'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { WidgetFormat } from './WidgetFormatSelector'
import { Story } from './StoriesList'
import StoryStyle from '@/components/StoryStyle'
import { ShoppingCart, Heart, Share2, X } from 'lucide-react'
import { useWidgetStories } from '@/hooks/useWidgetStories'

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
  onStorySelect,
  onClose
}: { 
  widget: { format: WidgetFormat; story_ids: string[] }
  stories?: Story[]
  selectedStory: Story | null
  onStorySelect: (story: Story | null) => void
  onClose: () => void
}) {
  const isInlineWidget = ['bubble', 'card', 'square'].includes(widget.format)

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

            {/* Widget Preview */}
            {isInlineWidget && (
              <div className="mb-8">
                <div className="relative">
                  <div className="overflow-x-auto scrollbar-hide px-4">
                    <div className="py-2">
                      <div className="flex gap-4">
                        {widget.story_ids.map((storyId) => {
                          const story = stories?.find(s => s.id === storyId)
                          if (!story) return null
                          return (
                            <StoryStyle 
                              key={story.id}
                              variant={widget.format === 'bubble' ? 'bubble' : widget.format === 'card' ? 'card' : 'square'}
                              story={story}
                              onClick={() => onStorySelect(story)}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart */}
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

  useEffect(() => {
    // Reset selected story when modal is closed
    if (!isOpen) {
      setSelectedStory(null)
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const handleStorySelect = (story: Story | null) => {
    setSelectedStory(story)
  }

  const handleClose = () => {
    if (selectedStory) {
      setSelectedStory(null)
    } else {
      onClose()
    }
  }

  const modal = (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 transition-colors duration-200 ${
          selectedStory ? 'bg-black/80' : 'bg-black/70'
        } backdrop-blur-sm`}
        onClick={handleClose}
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

          {/* Content */}
          <div className="relative h-[calc(100%-3rem)] overflow-auto">
            <ProductSkeleton 
              widget={widget} 
              stories={stories}
              selectedStory={selectedStory}
              onStorySelect={handleStorySelect}
              onClose={onClose}
            />
          </div>

          {/* Story Preview */}
          {selectedStory && (
            <div 
              className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center"
              onClick={() => setSelectedStory(null)}
            >
              <div 
                className="relative w-full h-full max-w-[400px] flex items-center justify-center mx-auto p-3"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <StoryStyle
                    variant="preview"
                    story={selectedStory}
                    items={selectedStory.content ? JSON.parse(selectedStory.content).mediaItems : []}
                    profileImage={selectedStory.profile_image}
                    profileName={selectedStory.profile_name}
                    onComplete={() => setSelectedStory(null)}
                    className="rounded-xl overflow-hidden"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
} 