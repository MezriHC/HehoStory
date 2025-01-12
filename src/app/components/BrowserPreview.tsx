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

interface MediaItem {
  type: 'image' | 'video'
  url: string
}

function WidgetPreview({ format, stories }: { format: WidgetFormat; stories: string[] }) {
  const [storyData, setStoryData] = useState<Story[]>([])
  const [borderColor, setBorderColor] = useState('#000000')
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [selectedStoryPosition, setSelectedStoryPosition] = useState<{ top: number; right: number } | null>(null)
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleStoryClick = async (story: Story, event: React.MouseEvent) => {
    setIsLoading(true)
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setSelectedStoryPosition({
      top: rect.top,
      right: window.innerWidth - rect.right
    })

    // Précharger les médias de la story
    if (story.content) {
      try {
        const content = JSON.parse(story.content)
        const mediaItems = content.mediaItems || []
        
        // Précharger toutes les images
        await Promise.all(
          mediaItems.map((item: { type: string; url: string }) => {
            if (item.type === 'image') {
              return new Promise((resolve) => {
                const img = new Image()
                img.onload = resolve
                img.onerror = resolve // En cas d'erreur, on continue quand même
                img.src = item.url
              })
            }
            return Promise.resolve()
          })
        )
      } catch (error) {
        console.error('Error preloading media:', error)
      }
    }
    
    setIsLoading(false)
    setSelectedStory(story)
    setSlideDirection(null)
  }

  const handleNextStory = async (e: React.MouseEvent) => {
    e?.stopPropagation()
    if (isTransitioning || !selectedStory || isClosing) return

    const currentIndex = storyData.findIndex(story => story.id === selectedStory?.id)
    if (currentIndex < storyData.length - 1) {
      setIsTransitioning(true)
      setSlideDirection('next')
      
      // Attendre un peu plus longtemps pour la transition
      await new Promise(resolve => setTimeout(resolve, 400))
      
      setSelectedStory(storyData[currentIndex + 1])
      setIsTransitioning(false)
      setSlideDirection(null)
    } else {
      handleClose()
    }
  }

  const handlePrevStory = async (e: React.MouseEvent) => {
    e?.stopPropagation()
    if (isTransitioning || !selectedStory || isClosing) return

    const currentIndex = storyData.findIndex(story => story.id === selectedStory?.id)
    if (currentIndex > 0) {
      setIsTransitioning(true)
      setSlideDirection('prev')
      
      // Attendre un peu plus longtemps pour la transition
      await new Promise(resolve => setTimeout(resolve, 400))
      
      setSelectedStory(storyData[currentIndex - 1])
      setIsTransitioning(false)
      setSlideDirection(null)
    } else {
      handleClose()
    }
  }

  const getSlideAnimation = () => {
    if (isClosing) {
      if (selectedStoryPosition?.top && selectedStoryPosition.top < window.innerHeight / 2) {
        return 'animate-close-to-top-right'
      }
      return selectedStoryPosition?.top ? 'animate-close-to-bottom-right' : 'animate-close-to-center-right'
    }
    
    if (slideDirection === 'next') {
      return isTransitioning ? 'animate-slide-next' : 'animate-slide-in-next'
    }
    if (slideDirection === 'prev') {
      return isTransitioning ? 'animate-slide-prev' : 'animate-slide-in-prev'
    }
    return ''
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

    const showNavigationArrows = !['sticky', 'iframe'].includes(format)

    return (
      <div 
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center"
        onClick={handleClose}
      >
        <div 
          className={`relative w-[80vw] sm:w-[525px] ${isClosing || isTransitioning ? 'pointer-events-none' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          {showNavigationArrows && (
            <div className={`absolute inset-y-0 -left-12 sm:-left-16 -right-12 sm:-right-16 flex items-center justify-between pointer-events-none transition-opacity duration-300 z-10 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            } ${getSlideAnimation()}`}>
              <button
                onClick={handlePrevStory}
                className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300 relative z-10"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={handleNextStory}
                className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300 relative z-10"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          )}

          <div className={`w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden relative ${getSlideAnimation()}`}>
            {!isLoading && (
              <StoryPreview
                key={selectedStory.id}
                items={selectedStory.content ? JSON.parse(selectedStory.content).mediaItems : []}
                profileImage={selectedStory.profile_image}
                profileName={selectedStory.profile_name}
                onComplete={() => {
                  const currentIndex = storyData.findIndex(story => story.id === selectedStory?.id)
                  if (currentIndex < storyData.length - 1) {
                    handleNextStory(new MouseEvent('click') as any)
                  } else {
                    handleClose()
                  }
                }}
              />
            )}
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