'use client'

import { Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { WidgetFormat } from './WidgetFormatSelector'
import { supabase } from '@/lib/supabase'
import { Story } from './StoriesList'
import StoryThumbnail from './widgets/StoryThumbnail'
import StoryPreview from './StoryPreview'

interface BrowserPreviewProps {
  isOpen: boolean
  onClose: () => void
  widget: {
    format: WidgetFormat
    stories: string[]
  }
}

function WidgetPreview({ format, stories }: { format: WidgetFormat; stories: string[] }) {
  const [storyData, setStoryData] = useState<Story[]>([])
  const [borderColor, setBorderColor] = useState('#000000')
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [selectedStoryPosition, setSelectedStoryPosition] = useState<{ top: number; right: number } | null>(null)

  useEffect(() => {
    // Load border color from preferences
    const loadBorderColor = async () => {
      const { data, error } = await supabase
        .from('preferences')
        .select('widget_border_color')
        .single()

      if (!error && data?.widget_border_color) {
        setBorderColor(data.widget_border_color)
      }
    }

    loadBorderColor()

    // Subscribe to changes
    const channel = supabase
      .channel('preferences_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'preferences'
        },
        (payload: any) => {
          if (payload.new?.widget_border_color) {
            setBorderColor(payload.new.widget_border_color)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  useEffect(() => {
    async function loadStories() {
      try {
        if (!stories?.length) {
          setStoryData([])
          return
        }

        const validStoryIds = stories.filter(id => id && typeof id === 'string')
        if (!validStoryIds.length) {
          setStoryData([])
          return
        }

        const { data, error } = await supabase
          .from('stories')
          .select('id, title, thumbnail, content, author_id, published, created_at, profile_image, profile_name')
          .in('id', validStoryIds)

        if (error) {
          console.error('Failed to fetch stories:', {
            error: error.message,
            code: error.code,
            details: error.details,
            storyIds: validStoryIds
          })
          setStoryData([])
          return
        }

        setStoryData(data || [])
      } catch (error) {
        console.error('Unexpected error loading stories:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          storyIds: stories
        })
        setStoryData([])
      }
    }

    loadStories()
  }, [stories])

  const handleStoryClick = (story: Story, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setSelectedStoryPosition({
      top: rect.top,
      right: window.innerWidth - rect.right
    })
    setSelectedStory(story)
  }

  const handleClose = () => {
    if (isClosing) return
    setIsClosing(true)
    
    setTimeout(() => {
      setSelectedStory(null)
      setIsClosing(false)
    }, 300) // Match the new animation duration
  }

  const renderStoryPreview = () => {
    if (!selectedStory) return null

    return (
      <div 
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center"
        onClick={handleClose}
      >
        <div 
          className={`relative w-[525px] ${isClosing ? 'pointer-events-none' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Navigation Arrows */}
          <div className={`absolute inset-y-0 -left-16 -right-16 flex items-center justify-between pointer-events-none ${
            isClosing ? 'opacity-0 transition-opacity duration-200' : ''
          }`}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = storyData.findIndex(story => story.id === selectedStory?.id)
                if (currentIndex > 0) {
                  setSelectedStory(storyData[currentIndex - 1])
                } else {
                  handleClose()
                }
              }}
              className="pointer-events-auto w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = storyData.findIndex(story => story.id === selectedStory?.id)
                if (currentIndex < storyData.length - 1) {
                  setSelectedStory(storyData[currentIndex + 1])
                } else {
                  handleClose()
                }
              }}
              className="pointer-events-auto w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className={`w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden ${
            isClosing ? (
              selectedStoryPosition?.top && selectedStoryPosition.top < window.innerHeight / 2
                ? 'animate-close-to-top-right'
                : selectedStoryPosition?.top
                ? 'animate-close-to-bottom-right'
                : 'animate-close-to-center-right'
            ) : ''
          }`}>
            <StoryPreview 
              items={selectedStory.content ? JSON.parse(selectedStory.content).mediaItems : []}
              profileImage={selectedStory.profile_image}
              profileName={selectedStory.profile_name}
            />
          </div>
        </div>
      </div>
    )
  }

  // Common styles for all formats
  const containerClasses = {
    base: "",
    withGap: "py-8 flex justify-start gap-6"
  }

  // For formats that show multiple stories
  if (['bubble', 'card', 'square'].includes(format)) {
    return (
      <>
        <div className={containerClasses.withGap}>
          {storyData.map((story) => (
            <div key={story.id} onClick={(e) => handleStoryClick(story, e)}>
              <StoryThumbnail 
                story={story}
                variant={format === 'bubble' ? 'bubble' : format === 'card' ? 'card' : 'square'}
                size="md"
                borderColor={borderColor}
              />
            </div>
          ))}
        </div>
        {renderStoryPreview()}
      </>
    )
  }

  // For formats that show single story
  if (format === 'sticky') {
    return (
      <>
        <div className={containerClasses.base}>
          <div className="absolute bottom-6 right-6" onClick={(e) => storyData[0] && handleStoryClick(storyData[0], e)}>
            <StoryThumbnail 
              story={storyData[0]}
              variant="single-bubble"
              size="md"
              borderColor={borderColor}
            />
          </div>
        </div>
        {renderStoryPreview()}
      </>
    )
  }

  // For iframe format (now using story variant)
  if (format === 'iframe') {
    return (
      <>
        <div className={containerClasses.base}>
          <div className="absolute bottom-8 right-8" onClick={(e) => storyData[0] && handleStoryClick(storyData[0], e)}>
            <StoryThumbnail 
              story={storyData[0]}
              variant="story"
              size="md"
              borderColor={borderColor}
            />
          </div>
        </div>
        {renderStoryPreview()}
      </>
    )
  }

  return null
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
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-xl" />
                  <div className="grid grid-cols-4 gap-4">
                    <div className="aspect-square bg-gray-100 rounded-lg" />
                    <div className="aspect-square bg-gray-100 rounded-lg" />
                    <div className="aspect-square bg-gray-100 rounded-lg" />
                    <div className="aspect-square bg-gray-100 rounded-lg" />
                  </div>
                </div>
                
                {/* Right Column - Product Info */}
                <div>
                  {/* Title and Price */}
                  <div>
                    <div className="space-y-4">
                      <div className="w-3/4 h-8 bg-gray-200 rounded" />
                      <div className="w-1/2 h-6 bg-gray-100 rounded" />
                    </div>
                  </div>
                  
                  {/* Widget Preview */}
                  <WidgetPreview format={widget.format} stories={widget.stories} />
                  
                  {/* Price and Add to Cart */}
                  <div>
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