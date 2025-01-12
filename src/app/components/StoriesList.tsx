'use client'

import { Eye, Pencil, Search, Trash2, X, MoreHorizontal, Heart, Send, Image as ImageIcon, Play, Globe2 } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import StoryPreview from './StoryPreview'

export interface Story {
  id: string
  title: string
  created_at: string
  content: string
  author_id: string
  published: boolean
  thumbnail: string
  tags?: string[]
  profile_image?: string
  profile_name?: string
}

interface StoriesListProps {
  stories: Story[]
  onDelete: (id: string) => void
}

export default function StoriesList({ stories, onDelete }: StoriesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [previewStory, setPreviewStory] = useState<Story | null>(null)

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMediaCount = (story: Story) => {
    try {
      const content = JSON.parse(story.content)
      return content.mediaItems?.length || 0
    } catch {
      return 0
    }
  }

  const getMediaItems = (story: Story) => {
    try {
      const content = JSON.parse(story.content)
      return content.mediaItems || []
    } catch {
      return []
    }
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Stories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map(story => (
          <div key={story.id} className="group relative">
            {/* Delete confirmation */}
            {showDeleteConfirm === story.id && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="p-3 bg-red-100 rounded-2xl">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Delete Story</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Are you sure you want to delete this story? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 h-10 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onDelete(story.id)
                        setShowDeleteConfirm(null)
                      }}
                      className="px-4 h-10 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                    >
                      Delete Story
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Story card */}
            <div className="bg-white border border-gray-200/75 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] bg-gray-100 group/thumbnail">
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
                    onClick={() => setPreviewStory(story)}
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

      {/* Preview Modal */}
      {previewStory && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setPreviewStory(null)}
        >
          <div 
            className="w-[525px] aspect-[9/16] bg-black rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <StoryPreview 
              items={getMediaItems(previewStory)}
              profileImage={previewStory.profile_image}
              profileName={previewStory.profile_name}
            />
          </div>
        </div>
      )}
    </div>
  )
} 