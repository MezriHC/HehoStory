'use client'

import { Eye, Pencil, Search, Trash2, X, MoreHorizontal, Heart, Send, Image as ImageIcon, Play, Globe2, User, Clock, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import StoryStyle from '@/components/StoryStyle'
import DeleteConfirmation from './DeleteConfirmation'

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
      onClick={(e) => {
        console.log('🎯 Click sur le backdrop du modal')
        // Ne ferme que si on clique sur le fond
        if (e.target === e.currentTarget) {
          console.log('🎯 Fermeture via le backdrop')
          setSelectedStory(null)
        }
      }}
    >
      <StoryStyle
        variant="preview"
        items={getMediaItems(selectedStory)}
        profileImage={selectedStory.profile_image || undefined}
        profileName={selectedStory.profile_name || undefined}
        onComplete={() => {
          console.log('✨ onComplete appelé dans StoriesList')
          setSelectedStory(null)
        }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStories.map(story => (
          <div key={story.id} className="relative">
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
            <div className="bg-white border border-gray-200/75 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] bg-gray-100">
                {story.thumbnail ? (
                  <img
                    src={story.thumbnail}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Story Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  {/* Author info if available */}
                  {story.profile_image || story.profile_name ? (
                    <div className="flex items-center gap-2 mb-3">
                      {story.profile_image ? (
                        <img 
                          src={story.profile_image} 
                          alt={story.profile_name || ''} 
                          className="w-8 h-8 rounded-full border border-white/20"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-500/20 border border-white/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-white/80" />
                        </div>
                      )}
                      {story.profile_name && (
                        <span className="text-white/90 text-sm font-medium">
                          {story.profile_name}
                        </span>
                      )}
                    </div>
                  ) : null}

                  <h3 className="text-white font-semibold mb-2 truncate">
                    {story.title}
                  </h3>

                  {/* Story metadata */}
                  <div className="flex flex-col gap-1.5 mb-4">
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(story.created_at).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        {getMediaCount(story)} médias
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="flex items-center justify-center flex-1 h-9 text-sm font-medium text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <Play className="w-4 h-4 mr-1.5" />
                      Preview
                    </button>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/story/create?edit=${story.id}`}
                        className="flex items-center justify-center w-9 h-9 text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(story.id)}
                        className="group flex items-center justify-center w-9 h-9 text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 group-hover:text-red-300 transition-colors" />
                      </button>
                    </div>
                  </div>
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