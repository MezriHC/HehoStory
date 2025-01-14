'use client'

import { ArrowLeft, ArrowRight, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Story } from '../../components/StoriesList'
import WidgetFormatSelector, { WidgetFormat } from '../../components/WidgetFormatSelector'
import { DragDropContext, Draggable, Droppable, DraggableProvided, DropResult } from '@hello-pangea/dnd'
import StoryThumbnail from '../../components/widgets/StoryThumbnail'
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
  const getRemoveButtonClasses = () => {
    if (format === 'iframe') {
      return 'absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70'
    }
    return 'absolute -top-1 -right-1 p-1 bg-black/50 rounded-full hover:bg-black/70'
  }

  const getVariant = () => {
    switch (format) {
      case 'bubble':
        return 'bubble'
      case 'card':
        return 'card'
      case 'sticky':
        return 'single-bubble'
      case 'iframe':
        return 'story'
      default:
        return 'square'
    }
  }

  return (
    <Draggable draggableId={story.id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className="relative"
        >
          <StoryThumbnail
            story={story}
            variant={getVariant()}
            size="md"
            borderColor={borderColor}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(story.id)
            }}
            className={getRemoveButtonClasses()}
          >
            <Trash2 className={format === 'iframe' ? 'w-4 h-4 text-white' : 'w-3 h-3 text-white'} />
          </button>
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
      // Pour les formats sticky et iframe, on ne permet qu'une seule story
      if (format === 'sticky' || format === 'iframe') {
        return [id]
      }
      
      // Pour les autres formats, comportement normal
      if (prev.includes(id)) {
        return prev.filter(storyId => storyId !== id)
      }
      return [...prev, id]
    })
  }

  // Ajouter un message d'aide pour les formats single-story
  const getFormatHelperText = () => {
    if (format === 'sticky' || format === 'iframe') {
      return "Ce format ne permet de sélectionner qu'une seule story"
    }
    return "Sélectionnez une ou plusieurs stories pour votre widget"
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(selectedStories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedStories(items)
  }

  const handleSave = async () => {
    if (!userId) {
      console.error('No user ID available')
      return
    }

    try {
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

  // Get the selected stories data
  const selectedStoriesData = stories.filter(story => selectedStories.includes(story.id))

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
            {format && (
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
              <div className="mb-6">
                <label htmlFor="widget-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Widget name
                </label>
                <input
                  type="text"
                  id="widget-name"
                  placeholder="Enter a name for your widget"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arrange stories
                </label>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="stories" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex items-start gap-6 min-h-[80px] p-4 bg-gray-50 rounded-lg"
                      >
                        {selectedStoriesData.map((story, index) => (
                          <DraggableStory
                            key={story.id}
                            story={story}
                            format={format!}
                            index={index}
                            onRemove={(id) => handleStorySelect(id)}
                            borderColor={widgetBorderColor}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
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