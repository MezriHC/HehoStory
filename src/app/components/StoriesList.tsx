'use client'

import { Eye, Pencil, Search, Trash2, X, MoreHorizontal, Heart, Send, Image as ImageIcon, Play, Globe2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import StoryStyle from '@/components/StoryStyle'
import DeleteConfirmation from './DeleteConfirmation'
import VideoThumbnail from '@/components/VideoThumbnail'

export interface Story {
  id: string
  title: string
  thumbnail: string | null
  content: string | null
  author_id: string
  published: boolean
  created_at: string
  profile_image: string | null
  profile_name: string | null
}

interface StoriesListProps {
  stories: Story[]
  onDelete: (id: string) => void
}

export default function StoriesList({ stories, onDelete }: StoriesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMediaCount = (story: Story) => {
    try {
      if (!story.content) return 0
      const content = JSON.parse(story.content)
      return content.mediaItems?.length || 0
    } catch {
      return 0
    }
  }

  const getMediaItems = (story: Story) => {
    try {
      if (!story.content) return []
      const content = JSON.parse(story.content)
      return content.mediaItems || []
    } catch {
      return []
    }
  }

  const getThumbnail = (story: Story) => {
    try {
      if (!story.content) return null
      const content = JSON.parse(story.content)
      const mediaItems = content.mediaItems || []
      if (mediaItems.length === 0) return null
      
      // Utiliser le premier média
      const firstMedia = mediaItems[0]
      return {
        url: firstMedia.thumbnailUrl || firstMedia.url,
        type: firstMedia.type
      }
    } catch {
      return null
    }
  }

  const modal = selectedStory && mounted ? createPortal(
    <div 
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
      onClick={() => setSelectedStory(null)}
    >
      <StoryStyle
        variant="preview"
        items={getMediaItems(selectedStory)}
        profileImage={selectedStory.profile_image || undefined}
        profileName={selectedStory.profile_name || undefined}
        onComplete={() => setSelectedStory(null)}
        className="rounded-xl overflow-hidden"
        isPhonePreview={true}
        isModal={true}
      />
    </div>,
    document.body
  ) : null

  useEffect(() => {
    if (selectedStory) {
      // Bloquer le scroll
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${scrollY}px`
      document.body.style.overflow = 'hidden'
    } else {
      // Restaurer le scroll
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.body.style.overflow = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    return () => {
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      document.body.style.overflow = ''
    }
  }, [selectedStory])

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
      </div>

      {/* Stories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map(story => (
          <div key={story.id} className="group relative">
            <DeleteConfirmation 
              isOpen={showDeleteConfirm === story.id}
              onClose={() => setShowDeleteConfirm(null)}
              onConfirm={() => {
                onDelete(story.id)
                setShowDeleteConfirm(null)
              }}
              title="Delete Story"
              description="Are you sure you want to delete this story? This action cannot be undone."
            />

            {/* Story card */}
            <div className="bg-white border border-gray-200/75 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] bg-gray-100 group/thumbnail">
                {story.thumbnail ? (
                  <img
                    src={getThumbnail(story)?.url || story.thumbnail}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {/* Overlay with quick actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/thumbnail:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 translate-y-2 group-hover/thumbnail:translate-y-0 transition-transform duration-300">
                      <Link
                        href={`/story/create?edit=${story.id}`}
                        className="flex items-center space-x-2 px-3 h-8 text-sm font-medium text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(story.id)}
                        className="flex items-center space-x-2 px-3 h-8 text-sm font-medium text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {story.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>
                        {new Date(story.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <ImageIcon className="w-4 h-4 mr-1" />
                        {getMediaCount(story)}
                      </span>
                    </div>
                  </div>
                  {story.published && (
                    <div className="flex items-center space-x-1 px-2.5 h-6 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      <Globe2 className="w-3 h-3" />
                      <span>Public</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedStory(story)}
                    className="flex items-center justify-center w-full h-9 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Preview Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal}
    </div>
  )
} 