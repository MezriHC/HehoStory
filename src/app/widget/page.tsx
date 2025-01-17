'use client'

import { Code2, Layers, Plus, Search, Settings, MoreVertical, ExternalLink, Trash2, Edit, X, Check, ClipboardCopy, MoreHorizontal, Heart, Send, Eye, Pencil, Image as ImageIcon, Play, Clock, Square, Circle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import { WidgetFormat } from '../components/WidgetFormatSelector'
import BrowserPreview from '../components/BrowserPreview'
import CodeModal from '../components/CodeModal'
import SettingsModal from '../components/SettingsModal'
import { supabase } from '@/lib/supabase'
import { Story } from '../components/StoriesList'
import React from 'react'
import Loader from '@/app/components/Loader'
import { useAuth } from '@/hooks/useAuth'
import DeleteConfirmation from '../components/DeleteConfirmation'

export interface Widget {
  id: string
  name: string
  format: WidgetFormat
  story_ids: string[]
  stories?: Story[]
  created_at: string
  settings?: any
  published: boolean
  author_id: string
}

function WidgetFormatIcon({ format }: { format: WidgetFormat }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
      <div className="w-6 h-6 text-white">
        {format.type === 'bubble' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        )}
        {format.type === 'card' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        )}
        {format.type === 'square' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" />
          </svg>
        )}
      </div>
    </div>
  )
}

function WidgetCard({ widget, onDelete, onPreview }: { widget: Widget; onDelete: (id: string) => void; onPreview: () => void }): React.ReactElement {
  const [showMenu, setShowMenu] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [storyData, setStoryData] = useState<Story[]>([])
  const { supabase: authClient } = useAuth()

  useEffect(() => {
    async function loadStories() {
      try {
        if (!widget.story_ids?.length) {
          setStoryData([])
          return
        }

        const validStoryIds = widget.story_ids.filter(id => id && typeof id === 'string')
        if (!validStoryIds.length) {
          setStoryData([])
          return
        }

        console.log('Loading stories for widget:', widget.id, 'with IDs:', validStoryIds)

        const { data, error } = await authClient
          .from('stories')
          .select('id, title, thumbnail, content, author_id, published, created_at, profile_image, profile_name')
          .in('id', validStoryIds)

        if (error) {
          console.error('Failed to fetch stories:', {
            error: error.message,
            code: error.code,
            details: error.details,
            widgetId: widget.id
          })
          setStoryData([])
          return
        }

        if (!data) {
          console.warn('No stories found for widget:', widget.id)
          setStoryData([])
          return
        }

        // Sort the stories to match the order in widget.story_ids
        const orderedStories = validStoryIds
          .map(id => data.find(story => story.id === id))
          .filter((story): story is Story => story !== undefined)

        setStoryData(orderedStories)
      } catch (error) {
        console.error('Unexpected error loading stories:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          widgetId: widget.id
        })
        setStoryData([])
      }
    }

    loadStories()
  }, [widget.id, widget.story_ids, authClient])

  const formatLabel = {
    bubble: 'Bubble Stories',
    card: 'Card Stories',
    square: 'Square Stories'
  }

  const handleDelete = () => {
    setShowMenu(false)
    onDelete(widget.id)
  }

  const getWidgetCode = () => {
    return `<!-- Hehostory Widget -->
    <script>
      window.HEHOSTORY_WIDGET = {
        id: "${widget.id}",
        format: "${widget.format}"
      }
    </script>
    <script async src="https://cdn.hehostory.com/widget.js"></script>`
  }

  const renderPreview = () => {
    // Find the first story based on the order in widget.story_ids
    const firstStoryId = widget.story_ids[0]
    console.log('Widget preview:', {
      widgetId: widget.id,
      firstStoryId,
      allStoryIds: widget.story_ids,
      loadedStories: storyData,
    })
    
    const firstStory = storyData.find(story => story.id === firstStoryId)
    if (!firstStory) {
      console.log('No story found for ID:', firstStoryId)
      return <WidgetFormatIcon format={widget.format} />
    }

    // Utiliser la thumbnail si elle existe, sinon fallback sur le premier média
    let mediaUrl = firstStory.thumbnail
    let isVideo = false

    if (!mediaUrl) {
      try {
        const content = JSON.parse(firstStory.content || '{}')
        const firstMedia = content.mediaItems?.[0]
        if (firstMedia) {
          isVideo = firstMedia.type === 'video'
          mediaUrl = firstMedia.thumbnailUrl || firstMedia.url
        }
      } catch (error) {
        console.error('Erreur lors du parsing du contenu:', error)
      }
    }

    if (!mediaUrl) {
      return <WidgetFormatIcon format={widget.format} />
    }

    return (
      <div className="absolute inset-0">
        <img src={mediaUrl} alt="" className="w-full h-full object-cover" />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Play className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    )
  }

  return (
    <div className="relative">
      <CodeModal
        isOpen={showCode}
        onClose={() => setShowCode(false)}
        code={getWidgetCode()}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        widget={{
          ...widget,
          stories: storyData
        }}
      />

      {/* Widget card */}
      <div className="bg-white border border-gray-200/75 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 h-[420px]">
        {/* Preview */}
        <div className="relative h-full bg-gray-100 rounded-2xl transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-2xl transition-all duration-300">
            {renderPreview()}
          </div>
          
          {/* Widget Info Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
            {/* Widget Title */}
            <h3 className="text-white font-semibold truncate text-lg mb-4">
              {widget.name}
            </h3>

            {/* Widget metadata */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {new Date(widget.created_at).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  {widget.story_ids.length} {widget.story_ids.length === 1 ? 'story' : 'stories'}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPreview}
                className="flex items-center justify-center flex-1 h-10 text-sm font-medium text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <div className="flex items-center gap-2">
                <Link
                  href={`/widget/${widget.id}/edit`}
                  className="flex items-center justify-center w-10 h-10 text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setShowCode(true)}
                  className="flex items-center justify-center w-10 h-10 text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center justify-center w-10 h-10 text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="group flex items-center justify-center w-10 h-10 text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 group-hover:text-red-300 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WidgetsPage() {
  const { userId, loading: authLoading, supabase: authClient } = useAuth()
  const router = useRouter()
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [widgetToDelete, setWidgetToDelete] = useState<string | null>(null)
  const [previewWidget, setPreviewWidget] = useState<Widget | null>(null)
  const [previewStories, setPreviewStories] = useState<Story[]>([])

  useEffect(() => {
    if (!authLoading && !userId) {
      router.push('/auth/signin')
    }
  }, [authLoading, userId, router])

  useEffect(() => {
    async function loadData() {
      if (!userId) return

      try {
        // Charger les widgets
        const { data: widgetsData, error: widgetsError } = await authClient
          .from('widgets')
          .select('*')
          .eq('author_id', userId)
          .order('created_at', { ascending: false })

        if (widgetsError) throw widgetsError
        setWidgets(widgetsData || [])
      } catch (error) {
        console.error('Error loading widgets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId, authClient])

  const handleDelete = async (id: string) => {
    setWidgetToDelete(id)
  }

  const confirmDelete = async () => {
    if (!widgetToDelete) return

    try {
      const { error } = await authClient
        .from('widgets')
        .delete()
        .eq('id', widgetToDelete)

      if (error) throw error

      setWidgets(prev => prev.filter(w => w.id !== widgetToDelete))
      setWidgetToDelete(null)
    } catch (error) {
      console.error('Error deleting widget:', error)
      alert('Failed to delete widget. Please try again.')
    }
  }

  const filteredWidgets = widgets.filter(widget =>
    widget.name.toLowerCase().includes(search.toLowerCase())
  )

  const handlePreview = async (widget: Widget) => {
    console.log('=== DÉBUT HANDLE PREVIEW ===')
    console.log('Widget reçu:', widget)
    
    try {
      // Parser le format s'il est en string
      const widgetWithParsedFormat = {
        ...widget,
        format: typeof widget.format === 'string' ? JSON.parse(widget.format) : widget.format
      }
      
      if (!widgetWithParsedFormat.story_ids?.length) {
        console.log('Aucun story_ids dans le widget')
        setPreviewStories([])
        setPreviewWidget(widgetWithParsedFormat)
        return
      }

      const validStoryIds = widgetWithParsedFormat.story_ids.filter(id => id && typeof id === 'string')
      console.log('Story IDs valides:', validStoryIds)
      
      if (!validStoryIds.length) {
        console.log('Aucun story ID valide après filtrage')
        setPreviewStories([])
        setPreviewWidget(widgetWithParsedFormat)
        return
      }

      // Charger les stories spécifiques pour ce widget
      console.log('Chargement des stories depuis Supabase...')
      const { data: storiesData, error: storiesError } = await authClient
        .from('stories')
        .select('id, title, thumbnail, content, author_id, published, created_at, profile_image, profile_name')
        .in('id', validStoryIds)

      if (storiesError) {
        console.error('Erreur lors du chargement des stories:', {
          error: storiesError.message,
          code: storiesError.code,
          details: storiesError.details,
          widgetId: widgetWithParsedFormat.id
        })
        throw storiesError
      }

      if (!storiesData) {
        console.warn('Aucune story trouvée pour le widget:', widgetWithParsedFormat.id)
        setPreviewStories([])
        setPreviewWidget(widgetWithParsedFormat)
        return
      }

      console.log('Stories chargées depuis Supabase:', storiesData)

      // Trier les stories dans l'ordre des story_ids
      const orderedStories = validStoryIds
        .map(id => storiesData.find(story => story.id === id))
        .filter((story): story is Story => story !== undefined)

      console.log('Stories triées et filtrées:', orderedStories)

      const widgetWithStories = {
        ...widgetWithParsedFormat,
        stories: orderedStories
      }

      console.log('Widget avec stories:', widgetWithStories)
      console.log('Mise à jour du state...')

      setPreviewStories(orderedStories)
      setPreviewWidget(widgetWithStories)

      console.log('=== FIN HANDLE PREVIEW ===')
    } catch (error) {
      console.error('Erreur lors du chargement des stories pour la prévisualisation:', error)
      alert('Impossible de charger les stories pour la prévisualisation')
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (widgets.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Widgets</h1>
              <p className="mt-2 text-gray-600">
                Gérez vos widgets et créez de nouvelles expériences
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href="/widget/create"
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un widget
              </Link>
            </div>
          </div>
          <EmptyState
            icon={Layers}
            title="Aucun widget"
            description="Créez votre premier widget pour commencer à collecter et afficher des stories"
            actionLabel="Créer un widget"
            actionHref="/widget/create"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <DeleteConfirmation 
        isOpen={widgetToDelete !== null}
        onClose={() => setWidgetToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Widget"
        description="Are you sure you want to delete this widget? This action cannot be undone."
      />

      {previewWidget && (
        <BrowserPreview 
          isOpen={true}
          onClose={() => {
            setPreviewWidget(null)
            setPreviewStories([])
          }}
          widget={{
            ...previewWidget,
            stories: previewStories
          }}
          stories={previewStories}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Widgets</h1>
            <p className="mt-2 text-gray-600">
              Gérez vos widgets et créez de nouvelles expériences
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/widget/create"
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un widget
            </Link>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search widgets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWidgets.map(widget => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              onDelete={handleDelete}
              onPreview={() => handlePreview(widget)}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 