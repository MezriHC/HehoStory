'use client'

import { ArrowLeft, ArrowRight, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Story } from '../../components/StoriesList'
import WidgetFormatSelector, { WidgetFormat } from '../../components/WidgetFormatSelector'
import { DragDropContext, Draggable, Droppable, DraggableProvided, DroppableProvided, DropResult } from '@hello-pangea/dnd'

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

function DraggableStory({ story, index, format, onRemove }: { story: Story; index: number; format: WidgetFormat; onRemove: (id: string) => void }) {
  const getFormatClasses = () => {
    switch (format) {
      case 'bubble':
        return 'w-16 h-16 rounded-full'
      case 'card':
        return 'w-24 h-32 rounded-xl'
      case 'square':
        return 'w-20 h-20 rounded-xl'
      case 'sticky':
        return 'w-16 h-16 rounded-full'
      case 'iframe':
        return 'w-[300px] h-[600px] rounded-xl'
    }
  }

  const getRemoveButtonClasses = () => {
    if (format === 'iframe') {
      return 'absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70'
    }
    return 'absolute -top-1 -right-1 p-1 bg-black/50 rounded-full hover:bg-black/70'
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
          <div className={`overflow-hidden bg-gray-100 ${getFormatClasses()}`}>
            {story.thumbnail && (
              <img
                src={story.thumbnail}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
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

export default function CreateWidgetPage() {
  const [step, setStep] = useState(1)
  const [format, setFormat] = useState<WidgetFormat | null>(null)
  const [selectedStories, setSelectedStories] = useState<string[]>([])
  const [name, setName] = useState('')
  const router = useRouter()

  // Load stories from localStorage
  const stories = JSON.parse(localStorage.getItem('stories') || '[]')
  const selectedStoriesData = stories.filter((s: Story) => selectedStories.includes(s.id))

  // Update selected stories when format changes
  const handleFormatChange = (newFormat: WidgetFormat) => {
    setFormat(newFormat)
    // If switching to a single-story format, keep only the first story if any are selected
    if (newFormat === 'sticky' || newFormat === 'iframe') {
      setSelectedStories(prev => prev.length > 0 ? [prev[0]] : [])
    }
  }

  const handleStorySelect = (id: string) => {
    if (format === 'sticky' || format === 'iframe') {
      // For removing a story in single-story formats
      if (selectedStories.includes(id)) {
        setSelectedStories([])
      } else {
        setSelectedStories([id])
      }
    } else {
      setSelectedStories(prev => 
        prev.includes(id)
          ? prev.filter(storyId => storyId !== id)
          : [...prev, id]
      )
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    
    const items = Array.from(selectedStoriesData) as Story[]
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    setSelectedStories(items.map(item => item.id))
  }

<<<<<<< HEAD
  const handleSave = async () => {
    try {
      const defaultSettings = {
        appearance: {
          borderColor: '#000000',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 8,
          backgroundColor: '#ffffff',
          textColor: '#000000'
        },
        display: {
          format: format,
          size: 'md',
          position: {
            bottom: 20,
            right: 20
          }
        },
        behavior: {
          autoPlay: false,
          loop: false,
          showControls: true
        }
      }

      const widget = {
        name: name.trim(),
        format,
        story_ids: selectedStories,
        settings: defaultSettings,
        status: 'active',
        user_id: (await supabase.auth.getUser()).data.user?.id
      }

      const { error } = await supabase
        .from('widgets')
        .insert([widget])

      if (error) throw error

      router.push('/widget')
    } catch (error) {
      console.error('Error creating widget:', error)
      alert('Failed to create widget. Please try again.')
=======
  const handleSave = () => {
    const widget = {
      id: Math.random().toString(36).slice(2),
      name,
      format,
      stories: selectedStories,
      createdAt: new Date(),
>>>>>>> parent of 237890d (Updated and working)
    }

    // Save widget to localStorage
    const existingWidgets = JSON.parse(localStorage.getItem('widgets') || '[]')
    localStorage.setItem('widgets', JSON.stringify([widget, ...existingWidgets]))

    router.push('/widget')
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
          
          <button
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={isLastStep ? handleSave : () => setStep(prev => prev + 1)}
            disabled={!canContinue}
          >
            {isLastStep ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create widget
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Choose format</h2>
              <WidgetFormatSelector value={format} onChange={handleFormatChange} />
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Select stories</h2>
              <StorySelector
                stories={stories}
                selectedStories={selectedStories}
                onSelect={handleStorySelect}
              />
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Name & arrange</h2>
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
                        {selectedStoriesData.map((story: Story, index: number) => (
                          <DraggableStory
                            key={story.id}
                            story={story}
                            format={format!}
                            index={index}
                            onRemove={(id) => handleStorySelect(id)}
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
    </div>
  )
} 