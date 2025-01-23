'use client'

import { ArrowLeft, ArrowRight, Save, Trash2, X, GripVertical, Search, Play, Check, Image } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Story } from '../../components/StoriesList'
import WidgetFormatSelector, { WidgetFormat } from '../../components/WidgetFormatSelector'
import { DragDropContext, Draggable, Droppable, DraggableProvided, DropResult } from '@hello-pangea/dnd'
import StoryStyle from '@/components/StoryStyle'
import { useAuth } from '@/hooks/useAuth'
import { Widget } from '@/app/widget/page'
import BrowserPreview from '@/app/components/BrowserPreview'
import { HexColorPicker } from 'react-colorful'

interface StorySelector {
  stories: Story[]
  selectedStories: string[]
  onSelect: (id: string) => void
}

function StorySelector({ stories, selectedStories, onSelect }: StorySelector) {
  const [search, setSearch] = useState('')

  const getMediaType = (story: Story) => {
    try {
      if (!story.content) return 'image'
      const content = JSON.parse(story.content)
      const firstMedia = content.mediaItems?.[0]
      return firstMedia?.type || 'image'
    } catch {
      return 'image'
    }
  }

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
      </div>

      {/* Stories grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredStories.map(story => {
          const isSelected = selectedStories.includes(story.id)
          const mediaType = getMediaType(story)

          return (
            <button
              key={story.id}
              onClick={() => onSelect(story.id)}
              className={`
                group relative bg-white rounded-xl overflow-hidden transition-all
                ${isSelected
                  ? 'ring-2 ring-gray-900 ring-offset-2'
                  : 'ring-1 ring-gray-200 hover:ring-gray-300'}
              `}
            >
              {/* Story preview container */}
              <div className="aspect-[9/16] relative">
                {/* Thumbnail */}
                {story.thumbnail ? (
                  <img
                    src={story.thumbnail}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                  </div>
                )}

                {/* Media type indicator */}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  {mediaType === 'video' ? (
                    <Play className="w-4 h-4 text-white" fill="currentColor" />
                  ) : (
                    <Image className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Permanent gradient overlay for title visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Selection overlay */}
                <div className={`
                  absolute inset-0 bg-black/20 transition-opacity duration-200
                  ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}
                `} />

                {/* Title and selection indicator - Always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate pr-2 drop-shadow-sm">
                      {story.title}
                    </span>
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                      transition-all duration-200
                      ${isSelected
                        ? 'bg-white border-white scale-100'
                        : 'border-white/40 bg-black/10 hover:border-white/60 hover:bg-black/20 scale-95 hover:scale-100'}
                    `}>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-gray-900" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DraggableStory({ story, index, format, onRemove, borderColor }: { story: Story; index: number; format: WidgetFormat; onRemove: (id: string) => void; borderColor: string }) {
  const getVariant = () => {
    return format.type
  }

  const getEmptyPreview = () => {
    switch (format.type) {
      case 'bubble':
        return (
          <div className={`rounded-full bg-gray-100 flex items-center justify-center ${
            format.size === 'S' ? 'w-[70px] h-[70px]' :
            format.size === 'M' ? 'w-[90px] h-[90px]' :
            'w-[120px] h-[120px]'
          }`}>
            <div className={`rounded-full bg-gray-200 ${
              format.size === 'S' ? 'w-8 h-8' :
              format.size === 'M' ? 'w-10 h-10' :
              'w-14 h-14'
            }`} />
          </div>
        )
      case 'card':
        return (
          <div className={`aspect-[9/16] rounded-xl bg-gray-100 flex flex-col ${
            format.size === 'S' ? 'w-[150px]' :
            format.size === 'M' ? 'w-[225px]' :
            'w-[300px]'
          }`}>
            <div className="h-2/3 bg-gray-200 rounded-t-xl" />
            <div className="p-3">
              <div className="w-2/3 h-2 bg-gray-200 rounded mb-2" />
              <div className="w-1/2 h-2 bg-gray-200 rounded" />
            </div>
          </div>
        )
      case 'square':
      default:
        return (
          <div className={`aspect-square rounded-lg bg-gray-100 flex items-center justify-center ${
            format.size === 'S' ? 'w-14' :
            format.size === 'M' ? 'w-16' :
            'w-24'
          }`}>
            <div className={`rounded bg-gray-200 ${
              format.size === 'S' ? 'w-8 h-8' :
              format.size === 'M' ? 'w-10 h-10' :
              'w-14 h-14'
            }`} />
          </div>
        )
    }
  }

  return (
    <Draggable draggableId={story.id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
          }}
          className="relative group"
        >
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(story.id)
            }}
            className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors group"
            title="Remove story"
          >
            <X className="w-3 h-3 text-gray-400 group-hover:text-red-500" />
          </button>

          {/* Story content */}
          <div className="cursor-grab active:cursor-grabbing">
            {story ? (
              <StoryStyle 
                variant={getVariant()} 
                size="md"
                className=""
                story={story}
                style={{ borderColor: borderColor || '#000000' }}
              />
            ) : (
              getEmptyPreview()
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

function ColorPickerPopover({ color, onChange }: { color: string, onChange: (color: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (value.startsWith('#')) {
      value = value.slice(1)
    }
    if (/^[0-9A-Fa-f]{0,6}$/.test(value)) {
      onChange('#' + value.padEnd(6, '0'))
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Border color
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-[42px] w-[42px] rounded-lg border border-gray-200 p-1 cursor-pointer hover:border-gray-300"
        >
          <div
            className="w-full h-full rounded-md border border-gray-200"
            style={{ backgroundColor: color }}
          />
        </button>
        <input
          type="text"
          value={color}
          onChange={handleHexInputChange}
          className="flex-1 px-4 py-2 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
          placeholder="#000000"
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 top-full mt-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

export default function WidgetEditor({ initialWidget }: { initialWidget?: Widget }) {
  const router = useRouter()
  const { userId, loading: authLoading, supabase: authClient } = useAuth()
  const [step, setStep] = useState(1)
  const [format, setFormat] = useState<WidgetFormat | null>(() => {
    if (!initialWidget) return null
    return typeof initialWidget.format === 'string' 
      ? JSON.parse(initialWidget.format) 
      : initialWidget.format
  })
  const [selectedStories, setSelectedStories] = useState<string[]>(() => 
    initialWidget?.story_ids || []
  )
  const [name, setName] = useState(() => initialWidget?.name || '')
  const [stories, setStories] = useState<Story[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [widgetBorderColor, setWidgetBorderColor] = useState(() => initialWidget?.border_color || '#000000')
  const [defaultBorderColor, setDefaultBorderColor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; visible: boolean; type?: 'success' | 'error' | 'info' }>({ message: '', visible: false })

  useEffect(() => {
    if (!authLoading && !userId) {
      router.push('/auth/signin')
    }
  }, [authLoading, userId, router])

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        // Charger les stories
        const { data: storiesData, error: storiesError } = await authClient
          .from('stories')
          .select('id, title, thumbnail, content, author_id, published, created_at, profile_image, profile_name, folder_id')
          .eq('author_id', userId)
          .order('created_at', { ascending: false })

        if (storiesError) throw storiesError
        setStories(storiesData || [])

        // Charger les préférences
        const { data: prefsData, error: prefsError } = await authClient
          .from('preferences')
          .select('widget_border_color')
          .eq('user_id', userId)
          .single()

        if (!prefsError && prefsData) {
          // Ne mettre à jour la couleur de bordure que si le widget n'a pas de couleur personnalisée
          setDefaultBorderColor(prefsData.widget_border_color)
          if (!initialWidget?.border_color) {
            setWidgetBorderColor(prefsData.widget_border_color)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      loadData()
    }
  }, [userId, authClient])

  const handleFormatChange = (newFormat: WidgetFormat) => {
    setFormat(newFormat)
  }

  const handleStorySelect = (id: string) => {
    setSelectedStories(prev => {
      if (prev.includes(id)) {
        return prev.filter(storyId => storyId !== id)
      }
      return [...prev, id]
    })
  }

  // Message d'aide pour les formats
  const getFormatHelperText = () => {
    return "Sélectionnez une ou plusieurs stories pour votre widget"
  }

  const handleDragEnd = (result: DropResult) => {
    console.log('DragEnd result:', result)
    
    if (!result.destination) {
      console.log('No destination, drag cancelled')
      return
    }

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    
    console.log('Moving story from index', sourceIndex, 'to index', destinationIndex)
    console.log('Current selectedStories:', selectedStories)
    
    const newOrder = Array.from(selectedStories)
    const [movedStory] = newOrder.splice(sourceIndex, 1)
    newOrder.splice(destinationIndex, 0, movedStory)
    
    console.log('New order:', newOrder)
    
    setSelectedStories(newOrder)
  }

  const handleSave = async () => {
    if (!userId) {
      console.error('No user ID available')
      return
    }

    try {
      // Get the first story in the selected order
      const firstStory = selectedStoriesData[0]
      if (!firstStory) {
        throw new Error('No stories selected')
      }

      const widget = {
        name: name.trim(),
        format: {
          type: format?.type || 'bubble',
          size: format?.size || 'S',
          alignment: format?.alignment || 'center'
        },
        story_ids: selectedStories,
        settings: initialWidget?.settings || {},
        published: true,
        author_id: userId,
        border_color: widgetBorderColor
      }

      console.log('Creating widget with data:', widget)

      if (initialWidget) {
        const { data, error } = await authClient
          .from('widgets')
          .update(widget)
          .eq('id', initialWidget.id)
          .select()

        if (error) {
          console.error('Error updating widget:', error)
          throw error
        }
        console.log('Updated widget:', data)
      } else {
        const { data, error } = await authClient
          .from('widgets')
          .insert([widget])
          .select()

        if (error) {
          console.error('Error creating widget:', error)
          throw error
        }
        console.log('Created widget:', data)
      }

      router.push('/widget')
    } catch (error) {
      console.error('Error saving widget:', error)
      alert('Failed to save widget. Please try again.')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1)
    }
  }

  const canContinue = step === 1 
    ? format !== null 
    : step === 2 
    ? selectedStories.length > 0
    : name.trim().length > 0
  const isLastStep = step === 3

  // Get the selected stories data in the correct order
  const selectedStoriesData = selectedStories
    .map(id => stories.find(story => story.id === id))
    .filter((story): story is Story => story !== undefined)

  console.log('Rendered with selectedStories:', selectedStories)
  console.log('selectedStoriesData:', selectedStoriesData)

  const previewWidget = format ? {
    format,
    story_ids: selectedStories,
    stories: selectedStoriesData,
    name: name || 'Preview Widget',
    id: 'preview',
    created_at: new Date().toISOString(),
    published: true,
    author_id: userId || ''
  } : null

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {step === 1 ? (
              <Link
                href="/widget"
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to widgets
              </Link>
            ) : (
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {format && step > 1 && selectedStories.length > 0 && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            )}
            <button
              className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={isLastStep ? handleSave : () => setStep(prev => prev + 1)}
              disabled={!canContinue}
            >
              {isLastStep ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {initialWidget ? 'Save changes' : 'Create widget'}
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {initialWidget ? 'Edit format' : 'Choose format'}
              </h2>
              <WidgetFormatSelector value={format} onChange={handleFormatChange} />
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {initialWidget ? 'Edit stories' : 'Select stories'}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {getFormatHelperText()}
              </p>
              <StorySelector
                stories={stories}
                selectedStories={selectedStories}
                onSelect={handleStorySelect}
              />
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {initialWidget ? 'Edit name & arrangement' : 'Name & arrange'}
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Widget name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-4 py-2 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                      placeholder="Enter widget name"
                    />
                  </div>
                  <div className="mb-6">
                    <ColorPickerPopover
                      color={widgetBorderColor}
                      onChange={setWidgetBorderColor}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Arrange stories</h3>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="stories" direction="horizontal">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="flex flex-wrap items-start gap-6 min-h-[80px] p-4 bg-gray-50 rounded-lg"
                        >
                          {selectedStories.map((storyId, index) => {
                            const story = stories.find(s => s.id === storyId)
                            if (!story) return null
                            
                            return (
                              <DraggableStory
                                key={story.id}
                                story={story}
                                index={index}
                                format={format || { type: 'bubble', size: 'S', alignment: 'center' }}
                                onRemove={(id) => {
                                  setSelectedStories(prev => prev.filter(sid => sid !== id))
                                }}
                                borderColor={widgetBorderColor}
                              />
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewWidget && (
        <BrowserPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          widget={previewWidget}
          stories={selectedStoriesData}
          borderColor={widgetBorderColor}
        />
      )}
    </div>
  )
} 