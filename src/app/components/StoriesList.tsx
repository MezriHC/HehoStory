'use client'

import { Eye, Pencil, Search, Trash2, X, MoreHorizontal, Heart, Send } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export interface Story {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  views: number
  mediaCount: number
  thumbnail: string
}

interface StoriesListProps {
  stories: Story[]
  onDelete: (id: string) => void
}

export default function StoriesList({ stories, onDelete }: StoriesListProps) {
  const [search, setSearch] = useState('')
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null)
  const [previewStory, setPreviewStory] = useState<Story | null>(null)

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStories.map(story => (
          <div 
            key={story.id} 
            className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="aspect-[16/9] relative bg-gray-100 overflow-hidden">
              {story.thumbnail ? (
                <img
                  src={story.thumbnail}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-sm">No thumbnail</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <button
                onClick={() => setPreviewStory(story)}
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
                  {story.title}
                </h3>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {story.mediaCount} {story.mediaCount === 1 ? 'media' : 'medias'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {story.views} {story.views === 1 ? 'view' : 'views'}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <Link
                  href={`/story/${story.id}/edit`}
                  className="flex items-center justify-center flex-1 h-9 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 mr-1.5" />
                  Edit
                </Link>
                <button
                  onClick={() => setPreviewStory(story)}
                  className="flex items-center justify-center flex-1 h-9 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  Preview
                </button>
                <button
                  onClick={() => setStoryToDelete(story)}
                  className="flex items-center justify-center w-9 h-9 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {storyToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setStoryToDelete(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Delete Story</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Are you sure you want to delete "{storyToDelete.title}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setStoryToDelete(null)}
                className="h-9 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(storyToDelete.id)
                  setStoryToDelete(null)
                }}
                className="h-9 px-4 text-sm font-medium text-white bg-red-600 transition-colors hover:bg-red-700 rounded-lg"
              >
                Delete Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewStory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewStory(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Story Preview</h3>
                <p className="text-sm text-gray-500 mt-1">
                  This is how your story will appear to users
                </p>
              </div>
              <button 
                onClick={() => setPreviewStory(null)} 
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black">
              <div className="aspect-[9/16] relative">
                {/* Progress bars */}
                <div className="absolute top-0 left-0 right-0 p-2 flex gap-1 z-10 bg-gradient-to-b from-black/30 via-black/10 to-transparent">
                  <div className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full w-1/3 bg-white rounded-full" />
                  </div>
                </div>

                {/* Story header info */}
                <div className="absolute top-6 left-0 right-0 px-4 flex items-center justify-between z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300/50 backdrop-blur-sm"></div>
                    <div className="space-y-1.5">
                      <div className="w-24 h-2.5 bg-gray-300/50 backdrop-blur-sm rounded-full"></div>
                      <div className="w-16 h-2 bg-gray-300/30 backdrop-blur-sm rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-1 text-white/70">
                    <MoreHorizontal className="w-5 h-5" />
                  </div>
                </div>

                {/* Media content */}
                <div className="absolute inset-0 select-none">
                  {previewStory.thumbnail ? (
                    <img
                      src={previewStory.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-900">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-800 flex items-center justify-center">
                          <Eye className="w-8 h-8 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-500">No preview available</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Story footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/30 via-black/10 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-11 px-4 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/50 flex items-center select-none pointer-events-none">
                      Send message
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <div className="p-2 text-white/70">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div className="p-2 text-white/70">
                        <Send className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 