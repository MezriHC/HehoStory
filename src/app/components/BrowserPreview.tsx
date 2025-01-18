'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { WidgetSize } from './WidgetFormatSelector'
import { Story } from './StoriesList'
import StoryStyle, { StoryCarousel, StoryViewer } from '@/components/StoryStyle'
import { ShoppingCart, Heart, Share2, X, Store, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { useWidgetStories } from '@/hooks/useWidgetStories'
import { WidgetFormat } from '@/types/database.types'

interface BrowserPreviewProps {
  isOpen: boolean
  onClose: () => void
  widget: {
    format: WidgetFormat
    story_ids: string[]
    stories?: Story[]
    border_color?: string
  }
  stories?: Story[]
  borderColor?: string
}

// Fonction de conversion des tailles
function convertWidgetSizeToStorySize(widgetSize: WidgetSize): 'sm' | 'md' | 'lg' {
  switch (widgetSize) {
    case 'S': return 'sm'
    case 'M': return 'md'
    case 'L': return 'lg'
    default: return 'md'
  }
}

// Memoize the story carousel to prevent unnecessary re-renders
const MemoizedStoryCarousel = React.memo(StoryCarousel)

function ProductSkeleton({ 
  widget, 
  stories,
  selectedStory,
  onStorySelect,
  onClose
}: { 
  widget: { format: WidgetFormat; story_ids: string[]; stories?: Story[]; border_color?: string }
  stories?: Story[]
  selectedStory: Story | null
  onStorySelect: (story: Story | null) => void
  onClose: () => void
}) {
  console.log('🎨 ProductSkeleton - Widget border_color:', widget.border_color)
  const isInlineWidget = ['bubble', 'card', 'square'].includes(widget.format.type)
  const displayStories = useMemo(() => widget.stories || stories || [], [widget.stories, stories])

  // Définir les classes d'alignement pour le conteneur
  const getContainerAlignmentClasses = () => {
    switch (widget.format.alignment) {
      case 'left':
        return 'items-start'
      case 'right':
        return 'items-end'
      case 'center':
      default:
        return 'items-center'
    }
  }

  console.log('ProductSkeleton rendering:', {
    widget,
    stories,
    displayStories,
    selectedStory,
    hasWidgetStories: !!widget.stories,
    hasStories: !!stories,
    storiesLength: displayStories.length
  })

  if (!isInlineWidget || displayStories.length === 0) {
    console.log('Not showing widget preview:', {
      isInlineWidget,
      storiesLength: displayStories.length
    })
  }

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
            {isInlineWidget && displayStories.length > 0 && (
              <div className="mb-8 relative w-full overflow-hidden">
                <div className={`flex flex-col ${getContainerAlignmentClasses()}`}>
                  <MemoizedStoryCarousel
                    stories={displayStories}
                    variant={widget.format.type === 'bubble' ? 'bubble' : widget.format.type === 'card' ? 'card' : 'square'}
                    size={convertWidgetSizeToStorySize(widget.format.size)}
                    onStorySelect={onStorySelect}
                    alignment={widget.format.alignment}
                    className="w-full"
                    borderColor={widget.border_color}
                  />
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

function HomeSkeleton({ 
  widget, 
  stories,
  selectedStory,
  onStorySelect,
  onClose
}: { 
  widget: { format: WidgetFormat; story_ids: string[]; stories?: Story[]; border_color?: string }
  stories?: Story[]
  selectedStory: Story | null
  onStorySelect: (story: Story | null) => void
  onClose: () => void
}) {
  console.log('🎨 HomeSkeleton - Widget border_color:', widget.border_color)
  const isInlineWidget = ['bubble', 'card', 'square'].includes(widget.format.type)
  const displayStories = useMemo(() => widget.stories || stories || [], [widget.stories, stories])

  // Définir les classes d'alignement pour le conteneur
  const getContainerAlignmentClasses = () => {
    switch (widget.format.alignment) {
      case 'left':
        return 'items-start'
      case 'right':
        return 'items-end'
      case 'center':
      default:
        return 'items-center'
    }
  }

  console.log('HomeSkeleton rendering:', {
    widget,
    stories,
    displayStories,
    selectedStory,
    hasWidgetStories: !!widget.stories,
    hasStories: !!stories,
    storiesLength: displayStories.length
  })

  if (!isInlineWidget || displayStories.length === 0) {
    console.log('Not showing widget preview:', {
      isInlineWidget,
      storiesLength: displayStories.length
    })
  }

  // Convertir la taille du widget en taille de story
  const getStorySize = () => {
    switch (widget.format.size) {
      case 'S': return 'sm'
      case 'M': return 'md'
      case 'L': return 'lg'
      default: return 'md'
    }
  }

  return (
    <div className="relative h-full bg-white">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="w-32 h-6 bg-gray-200 rounded" />
            <div className="hidden md:flex items-center gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-4 bg-gray-100 rounded" />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full" />
              <div className="w-10 h-10 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Plus compact */}
      <div className="relative h-[40vh] bg-gray-50">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.02),transparent)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="w-48 h-5 bg-gray-200 rounded" />
                <div className="w-96 h-10 bg-gray-100 rounded" />
              </div>
              <div className="space-y-3">
                <div className="w-full max-w-md h-4 bg-gray-200 rounded" />
                <div className="w-4/5 max-w-md h-4 bg-gray-200 rounded" />
              </div>
              <div className="pt-4 flex gap-4">
                <div className="w-36 h-11 bg-gray-200 rounded-lg" />
                <div className="w-36 h-11 bg-white border-2 border-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Widget Preview Section */}
      {isInlineWidget && displayStories.length > 0 && (
        <div className="bg-white py-16">
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
            <div className={`flex flex-col ${getContainerAlignmentClasses()}`}>
              <MemoizedStoryCarousel
                stories={displayStories}
                variant={widget.format.type === 'bubble' ? 'bubble' : widget.format.type === 'card' ? 'card' : 'square'}
                size={convertWidgetSizeToStorySize(widget.format.size)}
                onStorySelect={onStorySelect}
                alignment={widget.format.alignment}
                className="w-full"
                borderColor={widget.border_color}
              />
            </div>
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-10">
          {/* Featured Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="w-48 h-6 bg-gray-400 rounded" />
                <div className="w-96 h-4 bg-gray-200 rounded" />
              </div>
              <div className="w-28 h-10 bg-gray-100 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="group">
                  <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="w-3/4 h-4 bg-gray-400 rounded" />
                    <div className="w-1/2 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            <div className="space-y-1">
              <div className="w-48 h-6 bg-gray-400 rounded" />
              <div className="w-96 h-4 bg-gray-200 rounded" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden group">
                  <div className="absolute inset-0">
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100" />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="w-32 h-5 bg-white rounded" />
                    <div className="w-24 h-8 bg-white/90 backdrop-blur rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrowserPreview({ isOpen, onClose, widget, stories, borderColor }: BrowserPreviewProps) {
  console.log('🎨 BrowserPreview - Props borderColor:', borderColor)
  console.log('🎨 BrowserPreview - Widget border_color:', widget?.border_color)
  
  const [mounted, setMounted] = useState(false)
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'home' | 'product'>('home')
  const displayStories = (widget?.stories || stories || [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleStorySelect = (story: Story | null) => {
    console.log('📱 BrowserPreview - handleStorySelect:', { 
      oldId: selectedStoryId,
      newId: story?.id,
      story 
    })
    setSelectedStoryId(story?.id || null)
  }

  if (!mounted || !isOpen) return null

  // Créer le contenu du modal
  const browserContent = (
    <>
      {/* Browser Window */}
      <div className="absolute inset-4 lg:inset-12">
        <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Browser Chrome */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              {/* Window Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    // Si une story est ouverte, la fermer d'abord
                    if (selectedStoryId) {
                      setSelectedStoryId(null)
                    } else {
                      onClose()
                    }
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
              {/* View Toggle */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setViewMode('home')}
                  className={`flex items-center justify-center h-7 px-3 rounded-lg text-sm transition-colors ${
                    viewMode === 'home'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Store className="w-4 h-4 mr-2" />
                  Accueil
                </button>
                <button
                  onClick={() => setViewMode('product')}
                  className={`flex items-center justify-center h-7 px-3 rounded-lg text-sm transition-colors ${
                    viewMode === 'product'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Produit
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative h-[calc(100%-3rem)] overflow-auto">
            {viewMode === 'product' ? (
              <ProductSkeleton 
                widget={widget} 
                stories={displayStories}
                selectedStory={selectedStoryId ? displayStories.find(s => s.id === selectedStoryId) ?? null : null}
                onStorySelect={handleStorySelect}
                onClose={onClose}
              />
            ) : (
              <HomeSkeleton 
                widget={widget} 
                stories={displayStories}
                selectedStory={selectedStoryId ? displayStories.find(s => s.id === selectedStoryId) ?? null : null}
                onStorySelect={handleStorySelect}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )

  // Créer le modal complet avec le backdrop
  const modal = (
    <>
      <div className="fixed inset-0 z-50">
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-colors duration-200"
          onClick={(e) => {
            if (!selectedStoryId) {
              onClose()
            }
            e.stopPropagation()
          }}
        />
        {browserContent}
      </div>

      {/* Story Viewer - Maintenant en dehors du browser preview */}
      {selectedStoryId && displayStories.length > 0 && (
        <StoryViewer
          stories={displayStories}
          selectedStoryId={selectedStoryId}
          onClose={() => {
            console.log('🔄 BrowserPreview - StoryViewer onClose')
            setSelectedStoryId(null)
          }}
        />
      )}
    </>
  )

  // Un seul portail pour tout le contenu
  return createPortal(modal, document.body)
} 