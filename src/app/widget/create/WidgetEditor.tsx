'use client'

import { ArrowLeft, ArrowRight, Save, Trash2, X, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Story } from '../../components/StoriesList'
import WidgetFormatSelector, { WidgetFormat } from '../../components/WidgetFormatSelector'
import { DragDropContext, Draggable, Droppable, DraggableProvided, DropResult } from '@hello-pangea/dnd'
import StoryStyle from '@/components/StoryStyle'
import { useAuth } from '@/hooks/useAuth'
import { Widget } from '@/app/widget/page'
import BrowserPreview from '@/app/components/BrowserPreview'

interface StorySelector {
  stories: Story[]
  selectedStories: string[]
  onSelect: (id: string) => void
}

function StorySelector({ stories, selectedStories, onSelect }: StorySelector) {
  const [search, setSearch] = useState('')

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 px-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      {/* Stories grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredStories.map(story => (
          <button
            key={story.id}
            onClick={() => onSelect(story.id)}
            className={`
              group relative bg-white border-2 rounded-xl overflow-hidden transition-all
              ${selectedStories.includes(story.id)
                ? 'border-gray-900 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <div className="aspect-[16/9] relative bg-gray-100">
              {story.thumbnail && (
                <div className="absolute inset-0">
                  <img
                    src={story.thumbnail}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {story.title}
                </span>
                <div 
                  className={`
                    w-4 h-4 rounded-full border-2 transition-colors
                    ${selectedStories.includes(story.id)
                      ? 'border-gray-900 bg-gray-900'
                      : 'border-gray-300 group-hover:border-gray-400'}
                  `}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function DraggableStory({ story, index, format, onRemove, borderColor }: { story: Story; index: number; format: WidgetFormat; onRemove: (id: string) => void; borderColor: string }) {
  const getVariant = () => {
    return format
  }

  const getEmptyPreview = () => {
    switch (format) {
      case 'bubble':
        return (
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        )
      case 'card':
        return (
          <div className="w-32 h-48 rounded-xl bg-gray-100 flex flex-col">
            <div className="h-32 bg-gray-200 rounded-t-xl" />
            <div className="p-2">
              <div className="w-16 h-3 bg-gray-200 rounded mb-1" />
              <div className="w-12 h-2 bg-gray-200 rounded" />
            </div>
          </div>
        )
      case 'square':
      default:
        return (
          <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-200 rounded" />
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
                story={story}
                className={borderColor ? `border-2 ${borderColor}` : ''}
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

export default function WidgetEditor({ initialWidget }: { initialWidget?: Widget }) {
  const { userId, loading: authLoading, supabase: authClient } = useAuth()
  const router = useRouter()
  const [name, setName] = useState(initialWidget?.name || '')
  const [format, setFormat] = useState<WidgetFormat | null>(initialWidget?.format || null)
  const [selectedStories, setSelectedStories] = useState<string[]>(initialWidget?.story_ids || [])
  const [step, setStep] = useState(1)
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [widgetBorderColor, setWidgetBorderColor] = useState('#000000')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (initialWidget) {
      setName(initialWidget.name)
      setFormat(initialWidget.format)
      setSelectedStories(initialWidget.story_ids)
    }
  }, [initialWidget])

  useEffect(() => {
    if (!authLoading && !userId) {
      router.push('/auth/signin')
    }
  }, [authLoading, userId, router])

  useEffect(() => {
    async function loadData() {
      try {
        // Charger les stories
        const { data: storiesData, error: storiesError } = await authClient
          .from('stories')
          .select('*')
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
          setWidgetBorderColor(prefsData.widget_border_color)
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
        format,
        story_ids: selectedStories,
        settings: initialWidget?.settings || {},
        published: true,
        author_id: userId
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                                format={format || 'bubble'}
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
        />
      )}
    </div>
  )
} 