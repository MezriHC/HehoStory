'use client'

import { Code2, Layers, Plus, Search, Settings, MoreVertical, ExternalLink, Trash2, Edit, X, Check, ClipboardCopy, MoreHorizontal, Heart, Send, Eye } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import { WidgetFormat } from '../components/WidgetFormatSelector'
import BrowserPreview from '../components/BrowserPreview'
import CodeModal from '../components/CodeModal'
import SettingsModal from '../components/SettingsModal'

interface Widget {
  id: string
  name: string
  format: WidgetFormat
  stories: string[]
  createdAt: Date
}

function WidgetFormatIcon({ format }: { format: WidgetFormat }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
      <div className="w-6 h-6 text-white">
        {format === 'bubble' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        )}
        {format === 'card' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        )}
        {format === 'square' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" />
          </svg>
        )}
        {format === 'iframe' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
          </svg>
        )}
        {format === 'sticky' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        )}
      </div>
    </div>
  )
}

function DeleteConfirmation({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Delete Widget</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this widget? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-9 px-4 text-sm font-medium text-white bg-red-600 transition-colors hover:bg-red-700 rounded-lg"
          >
            Delete Widget
          </button>
        </div>
      </div>
    </div>
  );
}

function WidgetCard({ widget, onDelete, onPreview }: { widget: Widget; onDelete: (id: string) => void; onPreview: () => void }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const formatLabel = {
    bubble: 'Bubble Stories',
    card: 'Card Stories',
    square: 'Square Stories',
    iframe: 'Story Widget',
    sticky: 'Sticky Button'
  }

  const handleDelete = () => {
    setShowMenu(false)
    setShowDeleteConfirm(true)
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

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete(widget.id)
          setShowDeleteConfirm(false)
        }}
      />

      <CodeModal
        isOpen={showCode}
        onClose={() => setShowCode(false)}
        code={getWidgetCode()}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        widget={widget}
      />

      <div className="aspect-[16/9] relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <WidgetFormatIcon format={widget.format} />
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
            {formatLabel[widget.format]}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {widget.stories.length} {widget.stories.length === 1 ? 'story' : 'stories'}
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
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [previewWidget, setPreviewWidget] = useState<Widget | null>(null)

  useEffect(() => {
    // Load widgets from localStorage and ensure they have names
    const savedWidgets = JSON.parse(localStorage.getItem('widgets') || '[]')
    const widgetsWithNames = savedWidgets.map((widget: Widget) => ({
      ...widget,
      name: widget.name || `${widget.format} Widget`
    }))
    setWidgets(widgetsWithNames)
    setIsLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== id)
    localStorage.setItem('widgets', JSON.stringify(updatedWidgets))
    setWidgets(updatedWidgets)
  }

  const filteredWidgets = widgets.filter(widget =>
    (widget.name || '').toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <BrowserPreview 
        isOpen={previewWidget !== null}
        onClose={() => setPreviewWidget(null)}
        widget={previewWidget!}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Widgets</h1>
            <p className="mt-2 text-gray-600">
              Create and manage your story widgets
            </p>
          </div>

          <Link
            href="/widget/create"
            className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create widget
          </Link>
        </div>

        {widgets.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No widgets yet"
            description="Create your first widget to start collecting and displaying stories"
            actionLabel="Create widget"
            actionHref="/widget/create"
          />
        ) : (
          <>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search widgets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWidgets.map(widget => (
                <WidgetCard
                  key={widget.id}
                  widget={widget}
                  onDelete={handleDelete}
                  onPreview={() => setPreviewWidget(widget)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 