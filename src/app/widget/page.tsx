'use client'

import { Code2, Layers, Plus, Search, Settings, MoreVertical, ExternalLink, Trash2, Edit, X, Check, ClipboardCopy, MoreHorizontal, Heart, Send, Eye, Pencil, Image as ImageIcon, Play } from 'lucide-react'
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
import VideoThumbnail from '@/components/VideoThumbnail'

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

    // Vérifier si le contenu est une vidéo
    let isVideo = false
    let mediaUrl = firstStory.thumbnail || ''
    try {
      const content = JSON.parse(firstStory.content || '{}')
      const firstMedia = content.mediaItems?.[0]
      if (firstMedia?.type === 'video') {
        isVideo = true
        mediaUrl = firstMedia.url || ''
      }
    } catch (error) {
      console.error('Erreur lors du parsing du contenu:', error)
    }

    if (!mediaUrl) {
      return <WidgetFormatIcon format={widget.format} />
    }

    return (
      <div className="absolute inset-0">
        {isVideo ? (
          <VideoThumbnail url={mediaUrl} className="w-full h-full object-cover" />
        ) : (
          <img src={mediaUrl} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    )
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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

      <div className="aspect-[16/9] relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          {renderPreview()}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onPreview()
          }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg text-gray-900 hover:bg-gray-50 transition-all duration-200 hover:scale-110">
            <Eye className="w-5 h-5" />
          </div>
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900 truncate pr-4">
            {widget.name}
          </h3>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {formatLabel[widget.format.type]}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {widget.story_ids.length} {widget.story_ids.length === 1 ? 'story' : 'stories'}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <Link
            href={`/widget/${widget.id}/edit`}
            className="flex items-center justify-center flex-1 h-10 px-4 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg transition-all hover:text-gray-900 hover:bg-gray-100"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setShowCode(true)}
            className="flex items-center justify-center flex-1 h-10 px-4 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg transition-all hover:text-gray-900 hover:bg-gray-100"
          >
            <Code2 className="w-4 h-4 mr-2.5" />
            Get Code
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg transition-all hover:text-gray-900 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center w-10 h-10 text-sm font-medium text-red-600 bg-red-50 rounded-lg transition-all hover:text-red-700 hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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