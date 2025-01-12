'use client'

import { Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { WidgetFormat } from './WidgetFormatSelector'
import { supabase } from '@/lib/supabase'
import { Story } from './StoriesList'
import StoryThumbnail from './widgets/StoryThumbnail'
import { WidgetSettings } from '@/types/database.types'

interface BrowserPreviewProps {
  isOpen: boolean
  onClose: () => void
  widget: {
    format: WidgetFormat
    stories: string[]
    settings?: WidgetSettings
  }
}

function WidgetPreview({ format, stories, settings }: { format: WidgetFormat; stories: string[]; settings?: WidgetSettings }) {
  const [storyData, setStoryData] = useState<Story[]>([])

  // Apply widget settings to style
  const widgetStyle = {
    borderColor: settings?.appearance?.borderColor,
    borderWidth: settings?.appearance?.borderWidth ? `${settings.appearance.borderWidth}px` : undefined,
    borderStyle: settings?.appearance?.borderStyle || 'solid',
    borderRadius: settings?.appearance?.borderRadius ? `${settings.appearance.borderRadius}px` : undefined,
    backgroundColor: settings?.appearance?.backgroundColor,
    color: settings?.appearance?.textColor,
  }

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
          .select('id, title, thumbnail, content, author_id, published, created_at')
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

  // Common styles for all formats
  const containerClasses = {
    base: "",
    withGap: "py-8 flex justify-start gap-6"
  }

  // For formats that show multiple stories
  if (['bubble', 'card', 'square'].includes(format)) {
    return (
      <div className={containerClasses.withGap} style={widgetStyle}>
        {storyData.map((story) => (
          <StoryThumbnail 
            key={story.id}
            story={story}
            variant={format === 'bubble' ? 'bubble' : format === 'card' ? 'card' : 'square'}
            size={settings?.display?.size || "md"}
          />
        ))}
      </div>
    )
  }

  // For formats that show single story
  if (format === 'sticky') {
    const position = {
      bottom: settings?.display?.position?.bottom || 20,
      right: settings?.display?.position?.right || 20
    }
    
    return (
      <div className={containerClasses.base}>
        <div className="fixed" style={{ ...widgetStyle, bottom: `${position.bottom}px`, right: `${position.right}px` }}>
          <StoryThumbnail 
            story={storyData[0]}
            variant="single-bubble"
            size={settings?.display?.size || "md"}
          />
        </div>
      </div>
    )
  }

  // For iframe format
  if (format === 'iframe') {
    return (
      <div className={containerClasses.base}>
        <div 
          className="w-[320px] h-[500px] bg-black/90 rounded-xl shadow-lg overflow-hidden"
          style={widgetStyle}
        >
          {storyData[0]?.thumbnail ? (
            <img src={storyData[0].thumbnail} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
      </div>
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
                    <div className="space-y-4">
                      <div className="w-3/4 h-8 bg-gray-200 rounded" />
                      <div className="w-1/2 h-6 bg-gray-100 rounded" />
                    </div>
                  </div>
                  
                  {/* Widget Preview - No Animation */}
                  <WidgetPreview format={widget.format} stories={widget.stories} settings={widget.settings} />
                  
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