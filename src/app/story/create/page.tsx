'use client'

import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import MediaGrid, { MediaItem } from '../../components/MediaGrid'
import StoryPreview from '../../components/StoryPreview'

function getImageDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.readAsDataURL(file)
  })
}

function getVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    video.autoplay = true
    video.muted = true
    video.src = URL.createObjectURL(file)
    video.onloadeddata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')?.drawImage(video, 0, 0)
      resolve(canvas.toDataURL('image/jpeg'))
      video.remove()
      URL.revokeObjectURL(video.src)
    }
  })
}

export default function CreateStoryPage() {
  const [title, setTitle] = useState('')
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  // Load story data if editing
  useEffect(() => {
    if (editId) {
      const stories = JSON.parse(localStorage.getItem('stories') || '[]')
      const story = stories.find((s: any) => s.id === editId)
      if (story) {
        setTitle(story.title)
        // Here you would normally fetch the media items from your backend
        // For now, we'll just show the thumbnail
        if (story.thumbnail) {
          setMediaItems([{
            id: '1',
            type: 'image',
            url: story.thumbnail,
            file: null // We don't have the original file
          }])
        }
      }
    }
  }, [editId])

  const handleAddMedia = (files: File[]) => {
    const newItems: MediaItem[] = files.map(file => ({
      id: Math.random().toString(36).slice(2),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      file
    }))
    setMediaItems(prev => [...prev, ...newItems])
  }

  const handleRemoveMedia = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id))
  }

  const handleReorderMedia = (items: MediaItem[]) => {
    setMediaItems(items)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a story title')
      return
    }
    if (mediaItems.length === 0) {
      alert('Please add at least one media item')
      return
    }

    // Get thumbnail from first media item
    const firstItem = mediaItems[0]
    const thumbnail = firstItem.file 
      ? firstItem.type === 'video' 
        ? await getVideoThumbnail(firstItem.file)
        : await getImageDataUrl(firstItem.file)
      : firstItem.url // Use existing URL if no file (editing case)

    const story = {
      id: editId || Math.random().toString(36).slice(2),
      title: title.trim(),
      createdAt: editId ? new Date() : new Date(),
      updatedAt: new Date(),
      views: editId ? JSON.parse(localStorage.getItem('stories') || '[]').find((s: any) => s.id === editId)?.views || 0 : 0,
      mediaCount: mediaItems.length,
      thumbnail
    }

    // Update or create story
    const existingStories = JSON.parse(localStorage.getItem('stories') || '[]')
    const newStories = editId
      ? existingStories.map((s: any) => s.id === editId ? story : s)
      : [story, ...existingStories]
    
    localStorage.setItem('stories', JSON.stringify(newStories))

    // Cleanup URLs
    mediaItems.forEach(item => item.file && URL.revokeObjectURL(item.url))

    router.push('/story')
  }

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      mediaItems.forEach(item => item.file && URL.revokeObjectURL(item.url))
    }
  }, [mediaItems])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/story"
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to stories
            </Link>
          </div>
          
          <button
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={!title.trim() || mediaItems.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            {editId ? 'Save changes' : 'Save story'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="border-b border-gray-200 px-8 py-6">
            <input
              type="text"
              placeholder="Enter story title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-semibold text-gray-900 bg-transparent border-0 outline-none focus:ring-0 p-0 placeholder:text-gray-400"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload and organize your media to create an engaging story for your e-commerce site.
            </p>
          </div>

          <div className="p-8">
            <div className="flex gap-12">
              {/* Left side: Media grid */}
              <div className="flex-1">
                {mediaItems.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center transition-all hover:border-gray-300">
                    <div className="max-w-sm mx-auto">
                      <div className="p-6 rounded-full bg-white border border-gray-200 mb-6 shadow-sm mx-auto w-fit">
                        <Upload className="w-8 h-8 text-gray-900" />
                      </div>
                      <p className="text-base font-medium text-gray-900 mb-2">
                        No media added yet
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Start by adding images or videos to create your story slides
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleAddMedia(Array.from(e.target.files))
                            e.target.value = '' // Reset input
                          }
                        }}
                      />
                      <button
                        className="inline-flex items-center justify-center w-full h-11 px-6 text-sm font-medium text-white transition-colors bg-gray-900 rounded-lg hover:bg-gray-800"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add media
                      </button>
                    </div>
                  </div>
                ) : (
                  <MediaGrid
                    items={mediaItems}
                    onAdd={handleAddMedia}
                    onRemove={handleRemoveMedia}
                    onReorder={handleReorderMedia}
                  />
                )}
              </div>

              {/* Right side: iPhone mockup with story preview */}
              <div className="w-[375px] flex-shrink-0">
                <div className="relative w-[375px] h-[667px] bg-gray-900 rounded-[2rem] shadow-xl p-3 border border-gray-800">
                  {/* Screen content */}
                  <div className="relative w-full h-full bg-gray-100 rounded-[1.75rem] overflow-hidden">
                    <StoryPreview items={mediaItems} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 